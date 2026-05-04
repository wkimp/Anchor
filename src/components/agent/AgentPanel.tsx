'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, X, Mic, MicOff, Volume2, VolumeX, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import type { AgentMessage } from '@/lib/types'

const SUGGESTIONS = [
  'What should I focus on today?',
  'Am I on track with my habits?',
  'Who should I reach out to?',
  'How can I improve my wellness?',
  'What deadlines are coming up?',
  'Plan my week',
]

const GREETING = "Morning. I've got your plans in front of me — ask me anything about today, your projects, how you're tracking, or what to do next."

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onstart: ((ev: Event) => void) | null
  onresult: ((ev: SpeechRecognitionEvent) => void) | null
  onerror: ((ev: Event & { error: string }) => void) | null
  onend: ((ev: Event) => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

export default function AgentPanel({ onClose }: { onClose: () => void }) {
  const demoMode = useAppStore((s) => s.demoMode)
  const [messages, setMessages] = useState<AgentMessage[]>([
    { role: 'assistant', content: GREETING },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const [interim, setInterim] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const finalRef = useRef('')

  const RecCtor = typeof window !== 'undefined'
    ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
    : undefined

  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window
  const canListen = !!RecCtor

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, busy, interim])

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try { window.speechSynthesis?.cancel() } catch { /* noop */ }
      try { recognitionRef.current?.stop() } catch { /* noop */ }
    }
  }, [])

  function speak(text: string) {
    if (!canSpeak || !voiceOn) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text.replace(/[*_`#>—]/g, ' ').trim())
    u.rate = 1.02
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find((v) => /en-US/i.test(v.lang) && /samantha|google/i.test(v.name))
      ?? voices.find((v) => /en-US/i.test(v.lang))
      ?? voices[0]
    if (preferred) { u.voice = preferred; u.lang = preferred.lang }
    window.speechSynthesis.speak(u)
  }

  const send = useCallback(async (text?: string) => {
    const q = (text ?? input).trim()
    if (!q || busy) return
    setInput('')
    setInterim('')
    finalRef.current = ''
    const next: AgentMessage[] = [...messages, { role: 'user', content: q }]
    setMessages(next)
    setBusy(true)
    try { window.speechSynthesis?.cancel() } catch { /* noop */ }

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, demoMode }),
      })
      if (!res.ok || !res.body) throw new Error('Network error')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let reply = ''

      setMessages((m) => [...m, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        reply += decoder.decode(value, { stream: true })
        setMessages((m) => {
          const updated = [...m]
          updated[updated.length - 1] = { role: 'assistant', content: reply }
          return updated
        })
      }

      if (voiceOn) speak(reply)
    } catch {
      const msg = 'Something went sideways. Try again in a moment.'
      setMessages((m) => [...m, { role: 'assistant', content: msg }])
    } finally {
      setBusy(false)
    }
  }, [input, busy, messages, demoMode, voiceOn])

  function startListening() {
    if (!RecCtor) { setVoiceError("Voice input not supported in this browser."); return }
    setVoiceError('')
    finalRef.current = ''
    try { window.speechSynthesis?.cancel() } catch { /* noop */ }

    const rec = new RecCtor()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.onstart = () => setListening(true)
    rec.onresult = (e) => {
      let final = ''
      let inter = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript
        else inter += e.results[i][0].transcript
      }
      if (final) { finalRef.current += final; setInput((p) => p + final) }
      setInterim(inter)
    }
    rec.onerror = (e) => {
      const err = e.error
      if (err === 'not-allowed') setVoiceError('Microphone access denied.')
      else if (err === 'no-speech') setVoiceError("Didn't catch that — try again.")
      else if (err !== 'aborted') setVoiceError('Voice input error.')
    }
    rec.onend = () => {
      setListening(false)
      setInterim('')
      if (finalRef.current.trim()) send(finalRef.current.trim())
    }
    rec.start()
    recognitionRef.current = rec
  }

  function stopListening() {
    try { recognitionRef.current?.stop() } catch { /* noop */ }
    setListening(false)
  }

  return (
    <div
      className="fixed inset-0 lg:inset-auto lg:right-3.5 lg:bottom-3.5 z-50 flex flex-col bg-paper border border-rule lg:rounded-md lg:w-[420px] lg:h-[580px]"
      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.08)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-rule bg-paper-alt flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-ink text-paper flex items-center justify-center flex-shrink-0">
          <Sparkles size={13} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display italic text-[17px] text-ink tracking-[-0.2px] leading-none">Ask Anchor</p>
          <p className="font-mono text-[9.5px] text-ink-3 uppercase tracking-[0.4px] mt-1">
            {listening ? 'listening…' : speaking ? 'speaking…' : 'your planner, out loud'}
          </p>
        </div>

        {/* Voice output toggle */}
        <button
          onClick={() => {
            if (voiceOn) { try { window.speechSynthesis?.cancel() } catch { /* noop */ } }
            setVoiceOn((v) => !v)
          }}
          disabled={!canSpeak}
          title={voiceOn ? 'Voice on' : 'Voice off'}
          className={`w-7 h-7 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${voiceOn ? 'bg-ink text-paper border-ink' : 'bg-card text-ink-2 border-rule'} disabled:opacity-40`}
        >
          {voiceOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>

        <button
          onClick={onClose}
          title="Close (Esc)"
          className="w-7 h-7 rounded-full border border-rule bg-card text-ink-2 flex items-center justify-center cursor-pointer hover:text-ink transition-colors"
        >
          <X size={12} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-3"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[86%] ${m.role === 'user' ? 'self-end' : 'self-start'}`}
          >
            {m.role === 'assistant' && (
              <p className="font-mono text-[9px] text-ink-4 uppercase tracking-[0.5px] mb-1">Anchor</p>
            )}
            <div
              className={`font-body text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-ink text-paper px-3 py-2 rounded-2xl'
                  : 'text-ink'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* Live interim */}
        {listening && (finalRef.current || interim) && (
          <div className="max-w-[86%] self-end bg-transparent border border-dashed border-rule px-3 py-2 rounded-2xl font-body text-sm text-ink-3 italic">
            {finalRef.current}{interim ? ' ' + interim : ''}
          </div>
        )}

        {/* Thinking dots */}
        {busy && (
          <div className="self-start flex gap-1.5 py-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-ink-3"
                style={{ animation: `anchor-pulse 1.2s ${i * 0.18}s infinite ease-in-out` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Suggestions (first turn only) */}
      {messages.length === 1 && !busy && !listening && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s)}
              className="border border-rule bg-card text-ink-2 px-2.5 py-1.5 font-body text-xs rounded-2xl cursor-pointer hover:border-ink hover:text-ink transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Voice error */}
      {voiceError && (
        <div className="mx-4 mb-2 px-3 py-2 bg-[#F6E4DE] text-[#8A3A28] text-xs font-body rounded-sm flex justify-between items-center">
          {voiceError}
          <button onClick={() => setVoiceError('')} className="ml-2 text-base leading-none cursor-pointer">×</button>
        </div>
      )}

      {/* Composer */}
      <div className="px-3.5 py-3 border-t border-rule bg-paper-alt flex gap-2 items-end flex-shrink-0">
        <button
          onClick={listening ? stopListening : startListening}
          disabled={busy || !canListen}
          className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer relative ${
            listening
              ? 'bg-[#B45B47] border-[#B45B47] text-white'
              : 'bg-card border-rule text-ink-2 hover:border-ink'
          } disabled:opacity-40`}
        >
          {listening ? <MicOff size={15} /> : <Mic size={15} />}
          {listening && (
            <span
              className="absolute inset-[-4px] rounded-full border-2 border-[#B45B47] pointer-events-none"
              style={{ animation: 'anchor-ring 1.3s infinite ease-out' }}
            />
          )}
        </button>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder={listening ? 'Listening…' : 'Ask — or tap the mic'}
          rows={1}
          readOnly={listening}
          className={`flex-1 bg-card border rounded-md px-3 py-2 font-body text-sm text-ink placeholder-ink-4 outline-none resize-none max-h-28 min-h-[38px] leading-relaxed transition-colors ${
            listening ? 'border-accent italic' : 'border-rule focus:border-ink'
          }`}
          style={{ fieldSizing: 'content' } as React.CSSProperties}
        />

        <button
          onClick={() => send()}
          disabled={busy || !input.trim() || listening}
          className="h-[38px] px-3.5 bg-ink text-paper font-body text-xs rounded-md flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-default hover:opacity-90 transition-opacity flex-shrink-0"
        >
          Ask <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}
