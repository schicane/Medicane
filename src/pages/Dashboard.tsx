import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const stats = [
  { label: 'Total Records', value: '12', icon: '📄' },
  { label: 'Medications', value: '4', icon: '💊' },
  { label: 'Allergies', value: '2', icon: '⚠️' },
  { label: 'Upcoming Reminders', value: '3', icon: '🔔' },
]

const recentRecords = [
  { name: 'ER Discharge Summary', date: 'Feb 10, 2025', type: 'Discharge', source: 'City Hospital' },
  { name: 'Blood Panel Results', date: 'Jan 28, 2025', type: 'Lab', source: 'LabCorp' },
  { name: 'Amoxicillin Prescription', date: 'Jan 15, 2025', type: 'Prescription', source: 'Dr. Smith' },
]

type Profile = {
  full_name: string
  age: number
  city: string
  phone: string
  blood_type: string
  emergency_contact: string
  date_of_birth: string
}

type ExtractedData = {
  medication?: string
  dosage?: string
  frequency?: string
  doctor?: string
  date?: string
  notes?: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [extracted, setExtracted] = useState<ExtractedData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) setProfile(data)
      else navigate('/profile')
    }
    fetchProfile()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
      setExtracted(null)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!image) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8000/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      })
      const data = await response.json()
      if (data.error) setError(data.error)
      else setExtracted(data)
    } catch {
      setError('Could not connect to OCR server. Make sure the Python backend is running.')
    }
    setLoading(false)
  }

  const closeModal = () => {
    setShowModal(false)
    setImage(null)
    setExtracted(null)
    setError(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      {/* Navbar */}
      <nav style={{ background: '#fff', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h1 style={{ color: '#1a6ef5', fontSize: '22px', fontWeight: 700 }}>MediCANE</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/vault')} style={{ background: 'transparent', border: '1px solid #1a6ef5', color: '#1a6ef5', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Document Vault</button>
          <button onClick={handleSignOut} style={{ background: '#f0f4ff', border: 'none', color: '#555', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        {/* Welcome */}
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          Welcome back, {profile?.full_name || 'there'} 👋
        </h2>
        <p style={{ color: '#777', marginBottom: '32px' }}>Here's your health summary</p>

        {/* Profile Card */}
        {profile && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '4px' }}>Age</div>
              <div style={{ fontWeight: 700 }}>{profile.age}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '4px' }}>Blood Type</div>
              <div style={{ fontWeight: 700, color: '#e74c3c' }}>{profile.blood_type}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '4px' }}>City</div>
              <div style={{ fontWeight: 700 }}>{profile.city}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '4px' }}>Phone</div>
              <div style={{ fontWeight: 700 }}>{profile.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '4px' }}>Emergency Contact</div>
              <div style={{ fontWeight: 700 }}>{profile.emergency_contact}</div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              style={{ marginLeft: 'auto', background: '#f0f4ff', border: 'none', color: '#1a6ef5', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
            >
              Edit Profile
            </button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: '#fff', borderRadius: '12px', padding: '24px', minWidth: '180px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', flex: 1 }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#1a6ef5' }}>{s.value}</div>
              <div style={{ color: '#777', fontSize: '14px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Prescriptions */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>💊 Prescriptions</h3>
              <p style={{ color: '#777', fontSize: '14px' }}>Upload a photo of a handwritten prescription</p>
            </div>
            <button onClick={() => setShowModal(true)} style={{ background: '#1a6ef5', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
              + Upload Prescription
            </button>
          </div>
        </div>

        {/* Recent Records */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '18px' }}>Recent Records</h3>
            <button onClick={() => navigate('/vault')} style={{ background: '#1a6ef5', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>View All</button>
          </div>
          {recentRecords.map((r) => (
            <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f4ff' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{r.name}</div>
                <div style={{ fontSize: '13px', color: '#777' }}>{r.source} · {r.date}</div>
              </div>
              <span style={{ background: '#f0f4ff', color: '#1a6ef5', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>{r.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prescription Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '500px', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Upload Prescription</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#999' }}>✕</button>
            </div>

            <label style={{ display: 'block', border: '2px dashed #dde3f0', borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px', background: '#f9fbff' }}>
              {image ? (
                <img src={image} alt="preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
              ) : (
                <div>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>📷</div>
                  <div style={{ fontWeight: 600, color: '#1a6ef5', marginBottom: '4px' }}>Click to upload or take a photo</div>
                  <div style={{ fontSize: '13px', color: '#999' }}>Supports JPG, PNG, PDF</div>
                </div>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>

            {image && !extracted && (
              <button onClick={handleUpload} disabled={loading} style={{ width: '100%', background: '#1a6ef5', color: '#fff', border: 'none', padding: '13px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: '12px' }}>
                {loading ? '🔄 Extracting...' : '🤖 Extract Prescription Details'}
              </button>
            )}

            {error && (
              <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px', color: '#cc0000', fontSize: '14px', marginBottom: '12px' }}>
                {error}
              </div>
            )}

            {extracted && (
              <div style={{ background: '#f0f7ff', borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '14px', color: '#1a6ef5' }}>✅ Extracted Details</h4>
                {Object.entries(extracted).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #dde3f0' }}>
                    <span style={{ color: '#777', fontSize: '14px', textTransform: 'capitalize' }}>{key}</span>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{value}</span>
                  </div>
                ))}
                <button style={{ width: '100%', background: '#48c774', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '16px' }}>
                  ✓ Save to Records
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}