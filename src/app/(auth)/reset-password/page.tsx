'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { hasSupabasePublicEnv } from '@/lib/supabase/config'
import AnchorLogo from '@/components/branding/AnchorLogo'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  const supabaseConfigured = hasSupabasePublicEnv()

  useEffect(() => {
    if (!supabaseConfigured) return

    const supabase = createClient()

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setReady(Boolean(session))
    }

    void checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabaseConfigured])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim() || !confirmPassword.trim()) return

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setMessage('')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setMessage('')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.updateUser({ password })

      if (err) {
        setError(err.message)
      } else {
        setMessage('Password updated. Redirecting you to sign in…')
        setTimeout(() => {
          router.push('/login?reset=success')
          router.refresh()
        }, 900)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <AnchorLogo
            size="auth"
            subtitle="Choose a new password"
          />
        </div>

        <div className="bg-card border border-rule rounded-sm p-8">
          {!supabaseConfigured ? (
            <div className="text-center space-y-4">
              <p className="font-body text-sm text-ink-2 leading-relaxed">
                Supabase isn&rsquo;t configured yet, so password recovery can&rsquo;t run.
              </p>
              <a
                href="/login"
                className="block w-full text-center bg-ink text-paper font-body text-sm py-2.5 rounded-sm hover:opacity-90 transition-opacity"
              >
                Back to login
              </a>
            </div>
          ) : !ready ? (
            <div className="space-y-4 text-center">
              <p className="font-body text-sm text-ink-2 leading-relaxed">
                Open this page from the password reset email so we can securely verify your recovery session.
              </p>
              <a
                href="/login"
                className="block w-full text-center bg-ink text-paper font-body text-sm py-2.5 rounded-sm hover:opacity-90 transition-opacity"
              >
                Back to login
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mono-label text-ink-4 block mb-2">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a new password"
                  required
                  minLength={8}
                  className="w-full bg-paper border border-rule rounded-sm px-3 py-2.5 font-body text-sm text-ink placeholder-ink-4 outline-none focus:border-ink transition-colors"
                />
              </div>

              <div>
                <label className="mono-label text-ink-4 block mb-2">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
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
                {loading ? 'Updating password…' : 'Save new password'}
              </button>
            </form>
          )}
        </div>

        <p className="mono-label text-ink-4 text-center mt-8">
          Use a password you haven&apos;t used elsewhere.
        </p>
      </div>
    </div>
  )
}
