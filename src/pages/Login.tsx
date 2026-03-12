import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState<'patient' | 'provider'>('patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleAuth = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role }
        }
      })
      if (error) setError(error.message)
      else setMessage('Check your email for a confirmation link!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else navigate('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ color: '#1a6ef5', fontWeight: 800, fontSize: '28px', marginBottom: '8px' }}>MediCANE</h2>
        <p style={{ color: '#777', marginBottom: '28px' }}>{isSignUp ? 'Create your account' : 'Sign in to your account'}</p>

        {/* Role Toggle */}
        <div style={{ display: 'flex', background: '#f0f4ff', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
          {(['patient', 'provider'] as const).map((r) => (
            <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, background: role === r ? '#1a6ef5' : 'transparent', color: role === r ? '#fff' : '#555', transition: 'all 0.2s' }}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <input
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dde3f0', marginBottom: '12px', fontSize: '15px' }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dde3f0', marginBottom: '24px', fontSize: '15px' }}
        />

        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px', color: '#cc0000', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: '#f0fff4', border: '1px solid #b2f5c8', borderRadius: '8px', padding: '12px', color: '#276749', fontSize: '14px', marginBottom: '16px' }}>
            {message}
          </div>
        )}

        <button
          onClick={handleAuth}
          disabled={loading}
          style={{ width: '100%', background: '#1a6ef5', color: '#fff', border: 'none', padding: '13px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '...' : isSignUp ? `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}` : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px', color: '#777', fontSize: '14px' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => { setIsSignUp(!isSignUp); setError(null) }} style={{ color: '#1a6ef5', cursor: 'pointer', fontWeight: 600 }}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  )
} 