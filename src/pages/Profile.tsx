import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function generateDoctorId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'MED-'
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default function Profile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<'patient' | 'provider'>('patient')
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    city: '',
    phone: '',
    date_of_birth: '',
    blood_type: '',
    emergency_contact: '',
  })

  useEffect(() => {
    const fetchExisting = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const userRole = user.user_metadata?.role || 'patient'
      setRole(userRole)

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setForm({
          full_name: data.full_name || '',
          age: data.age?.toString() || '',
          city: data.city || '',
          phone: data.phone || '',
          date_of_birth: data.date_of_birth || '',
          blood_type: data.blood_type || '',
          emergency_contact: data.emergency_contact || '',
        })
        if (data.doctor_id) setDoctorId(data.doctor_id)
      }
    }
    fetchExisting()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not logged in'); setLoading(false); return }

    const userRole = user.user_metadata?.role || 'patient'
    let newDoctorId = doctorId

    if (userRole === 'provider' && !doctorId) {
      newDoctorId = generateDoctorId()

      // Make sure it's unique
      const { data: existing } = await supabase
        .from('profiles')
        .select('doctor_id')
        .eq('doctor_id', newDoctorId)
        .single()

      if (existing) newDoctorId = generateDoctorId()
      setDoctorId(newDoctorId)
    }

    const { error } = await supabase.from('profiles').upsert({
      user_id: user.id,
      full_name: form.full_name,
      age: parseInt(form.age),
      city: form.city,
      phone: form.phone,
      date_of_birth: form.date_of_birth,
      blood_type: form.blood_type,
      emergency_contact: form.emergency_contact,
      role: userRole,
      doctor_id: newDoctorId,
    })

    if (error) setError(error.message)
    else navigate(userRole === 'provider' ? '/provider' : '/dashboard')
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
        <p style={{ color: '#777', marginBottom: '28px' }}>
          {role === 'provider' ? 'Setting up your provider account' : 'This helps your providers know you better'}
        </p>

        {/* Doctor ID display */}
        {role === 'provider' && doctorId && (
          <div style={{ background: '#f0f7ff', border: '1px solid #1a6ef5', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#777', marginBottom: '4px' }}>Your Doctor ID</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1a6ef5', letterSpacing: '2px' }}>{doctorId}</div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>Share this with your patients</div>
          </div>
        )}

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

        {role === 'patient' && (
          <>
            <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Emergency Contact</label>
            <input name="emergency_contact" placeholder="Jane Doe - +1 234 567 8901" value={form.emergency_contact} onChange={handleChange} style={inputStyle} />
          </>
        )}

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