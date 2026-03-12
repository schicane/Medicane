import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Profile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    city: '',
    phone: '',
    date_of_birth: '',
    blood_type: '',
    emergency_contact: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not logged in'); setLoading(false); return }

    const { error } = await supabase.from('profiles').upsert({
      user_id: user.id,
      full_name: form.full_name,
      age: parseInt(form.age),
      city: form.city,
      phone: form.phone,
      date_of_birth: form.date_of_birth,
      blood_type: form.blood_type,
      emergency_contact: form.emergency_contact,
    })

    if (error) setError(error.message)
    else navigate('/dashboard')
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #dde3f0',
    fontSize: '15px',
    marginBottom: '16px',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '500px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ color: '#1a6ef5', fontWeight: 800, fontSize: '26px', marginBottom: '8px' }}>Complete Your Profile</h2>
        <p style={{ color: '#777', marginBottom: '28px' }}>This helps your providers know you better</p>

        <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Full Name</label>
        <input name="full_name" placeholder="John Doe" value={form.full_name} onChange={handleChange} style={inputStyle} />

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Age</label>
            <input name="age" placeholder="25" type="number" value={form.age} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Blood Type</label>
            <select name="blood_type" value={form.blood_type} onChange={handleChange} style={inputStyle}>
              <option value="">Select...</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Date of Birth</label>
        <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} style={inputStyle} />

        <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>City</label>
        <input name="city" placeholder="New York" value={form.city} onChange={handleChange} style={inputStyle} />

        <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Phone Number</label>
        <input name="phone" placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} style={inputStyle} />

        <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Emergency Contact</label>
        <input name="emergency_contact" placeholder="Jane Doe - +1 234 567 8901" value={form.emergency_contact} onChange={handleChange} style={inputStyle} />

        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px', color: '#cc0000', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: '#1a6ef5', color: '#fff', border: 'none', padding: '13px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving...' : 'Save & Continue →'}
        </button>
      </div>
    </div>
  )
}