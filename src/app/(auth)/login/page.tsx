'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const supabaseConfigured = hasSupabasePublicEnv()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    setError('')
    setMessage('')

    const supabase = createClient()
    const trimmedEmail = email.trim()

    if (mode === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })

      if (err) {
        setError(err.message)
      } else {
        router.push('/')
        router.refresh()
      }
    } else {
      const { data, error: err } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })

      if (err) {
        setError(err.message)
      } else if (data.session) {
        router.push('/')
        router.refresh()
      } else {
        setMessage('Account created. Check your inbox to confirm your email, then sign in with your password.')
      }
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
          ) : (
            <div className="space-y-4">
              <div className="flex gap-1 border border-rule rounded-sm p-0.5">
                {(['login', 'signup'] as const).map((nextMode) => (
                  <button
                    key={nextMode}
                    type="button"
                    onClick={() => {
                      setMode(nextMode)
                      setError('')
                      setMessage('')
                    }}
                    className={`flex-1 px-3 py-2 text-xs font-body uppercase tracking-[0.2px] transition-colors cursor-pointer ${
                      mode === nextMode ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    {nextMode === 'login' ? 'Log in' : 'Create account'}
                  </button>
                ))}
              </div>

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

                <div>
                  <label className="mono-label text-ink-4 block mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={8}
                    className="w-full bg-paper border border-rule rounded-sm px-3 py-2.5 font-body text-sm text-ink placeholder-ink-4 outline-none focus:border-ink transition-colors"
                  />
                </div>

                {error && (
                  <p className="font-body text-xs text-[#B45B47]">{error}</p>
                )}

                {message && (
                  <p className="font-body text-xs text-ink-3">{message}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ink text-paper font-body text-sm py-2.5 rounded-sm disabled:opacity-50 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {loading
                    ? (mode === 'login' ? 'Logging in…' : 'Creating account…')
                    : (mode === 'login' ? 'Log in' : 'Create account')}
                </button>
              </form>
            </div>
          )}
        </div>

        <p className="mono-label text-ink-4 text-center mt-8">
          {mode === 'login' ? 'Sign in with your email and password.' : 'Create an account with email and password.'}
        </p>
      </div>
    </div>
  )
}
