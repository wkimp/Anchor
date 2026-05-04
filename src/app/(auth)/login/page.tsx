'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (err) {
      setError(err.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="mb-10 text-center">
          <h1 className="font-display text-[44px] italic text-ink leading-none tracking-[-0.5px]">
            Anchor
          </h1>
          <p className="mono-label text-ink-4 mt-3">Your life, quietly organised</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-rule rounded-sm p-8">
          {!supabaseConfigured ? (
            <div className="text-center space-y-4">
              <p className="font-body text-sm text-ink-2 leading-relaxed">
                Supabase isn&rsquo;t configured yet. Copy{' '}
                <code className="font-mono text-xs bg-paper-alt px-1 py-0.5 rounded">.env.example</code>{' '}
                to{' '}
                <code className="font-mono text-xs bg-paper-alt px-1 py-0.5 rounded">.env.local</code>{' '}
                and add your keys to enable auth.
              </p>
              <a
                href="/"
                className="block w-full text-center bg-ink text-paper font-body text-sm py-2.5 rounded-sm hover:opacity-90 transition-opacity"
              >
                Continue in demo mode →
              </a>
            </div>
          ) : sent ? (
            <div className="text-center space-y-3">
              <div className="text-2xl">✉️</div>
              <p className="font-display text-xl italic text-ink">Check your inbox</p>
              <p className="font-body text-sm text-ink-3">
                We sent a magic link to <strong className="text-ink">{email}</strong>. Click it to sign in.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mono-label text-ink-4 block mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-paper border border-rule rounded-sm px-3 py-2.5 font-body text-sm text-ink placeholder-ink-4 outline-none focus:border-ink transition-colors"
                />
              </div>
              {error && (
                <p className="font-body text-xs text-[#B45B47]">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-paper font-body text-sm py-2.5 rounded-sm disabled:opacity-50 hover:opacity-90 transition-opacity cursor-pointer"
              >
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </form>
          )}
        </div>

        <p className="mono-label text-ink-4 text-center mt-8">
          No password. No friction. Just a link.
        </p>
      </div>
    </div>
  )
}
