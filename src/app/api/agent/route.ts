import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import {
  DEMO_TASKS, DEMO_HABITS, DEMO_HABIT_LOGS, DEMO_WELLNESS,
  DEMO_PROJECTS, DEMO_PEOPLE, DEMO_FINANCE_CATEGORIES, DEMO_FINANCE_TRANSACTIONS,
  DEMO_BUSINESS,
} from '@/lib/demo-data'
import type { Task, Habit, HabitLog, WellnessLog } from '@/lib/types'

export async function POST(request: Request) {
  const body = await request.json() as { messages: Array<{ role: string; content: string }>; demoMode?: boolean }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      )
    }
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const today = new Date().toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  // Build context from real data or demo
  let tasks: Task[] = DEMO_TASKS
  let habits: Habit[] = DEMO_HABITS
  let habitLogs: HabitLog[] = DEMO_HABIT_LOGS
  let wellness: WellnessLog | null = DEMO_WELLNESS

  if (!body.demoMode && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const todayStr = new Date().toISOString().split('T')[0]
        const [t, h, hl, w] = await Promise.all([
          supabase.from('tasks').select('*').eq('user_id', user.id).eq('done', false).limit(20),
          supabase.from('habits').select('*').eq('user_id', user.id),
          supabase.from('habit_logs').select('*').eq('user_id', user.id).gte('date', offsetDate(todayStr, -30)),
          supabase.from('wellness_logs').select('*').eq('user_id', user.id).eq('date', todayStr).single(),
        ])
        tasks = (t.data ?? []) as Task[]
        habits = (h.data ?? []) as Habit[]
        habitLogs = (hl.data ?? []) as HabitLog[]
        wellness = (w.data as WellnessLog | null) ?? null
      }
    } catch {
      // fallback to demo
    }
  }

  const openTasks = tasks
    .filter((t) => !t.done)
    .slice(0, 12)
    .map((t) => `- [${['low','med','high'][t.priority - 1]}] ${t.text}${t.project ? ` (${t.project})` : ''}`)
    .join('\n')

  const habitSummary = habits
    .map((h) => {
      const streak = computeStreak(habitLogs.filter((l) => l.habit_id === h.id))
      return `- ${h.name}: ${streak} day streak`
    })
    .join('\n')

  const wellnessSummary = wellness
    ? `Sleep ${wellness.sleep_hours}h, steps ${wellness.steps ?? 'N/A'}, water ${wellness.water_cups ?? 'N/A'} cups, mood ${wellness.mood ?? 'N/A'}/10`
    : 'No wellness data today.'

  const systemPrompt = `You are "Anchor", an AI assistant embedded in the user's life planner. Answer briefly, warmly, and concretely. Prefer specifics from the context below over generic advice. Use short paragraphs or tight bullet lists. Never invent data the user doesn't have. If asked something you can't answer from context, say so. Your replies may be spoken aloud — prefer natural sentences over lists when the user seems to be speaking. Avoid markdown symbols.

TODAY: ${today}

OPEN TASKS:
${openTasks || '(none)'}

HABITS:
${habitSummary || '(none)'}

WELLNESS (today):
${wellnessSummary}

Keep answers under 120 words unless the user asks for depth.`

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const messages = body.messages.filter((m) => m.role === 'user' || m.role === 'assistant')

  const stream = anthropic.messages.stream({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    system: systemPrompt,
    messages: messages as Anthropic.MessageParam[],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  })
}

function computeStreak(logs: HabitLog[]): number {
  const today = new Date().toISOString().split('T')[0]
  let streak = 0
  let d = today
  while (true) {
    if (!logs.some((l) => l.date === d && l.done)) break
    streak++
    const dt = new Date(d)
    dt.setDate(dt.getDate() - 1)
    d = dt.toISOString().split('T')[0]
  }
  return streak
}

function offsetDate(base: string, days: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}
