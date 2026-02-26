import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState<'patient' | 'provider'>('patient')

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ color: '#1a6ef5', fontWeight: 800, fontSize: '28px', marginBottom: '8px' }}>MediCANE</h2>
        <p style={{ color: '#777', marginBottom: '28px' }}>Sign in to your account</p>

        <div style={{ display: 'flex', background: '#f0f4ff', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
          {(['patient', 'provider'] as const).map((r) => (
            <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, background: role === r ? '#1a6ef5' : 'transparent', color: role === r ? '#fff' : '#555', transition: 'all 0.2s' }}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <input placeholder="Email address" type="email" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dde3f0', marginBottom: '12px', fontSize: '15px' }} />
        <input placeholder="Password" type="password" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dde3f0', marginBottom: '24px', fontSize: '15px' }} />

        <button onClick={() => navigate('/dashboard')} style={{ width: '100%', background: '#1a6ef5', color: '#fff', border: 'none', padding: '13px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
          Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px', color: '#777', fontSize: '14px' }}>
          Don't have an account? <span style={{ color: '#1a6ef5', cursor: 'pointer', fontWeight: 600 }}>Sign up</span>
        </p>
      </div>
    </div>
  )
}