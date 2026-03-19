import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

type Document = {
  id: string
  name: string
  type: string
  source: string
  size: string
  file_path: string
  created_at: string
  patient_name?: string
}

type SharedPatient = {
  patient_id: string
  full_name: string
  age: number
  blood_type: string
  city: string
  phone: string
}

const typeColors: Record<string, string> = {
  Discharge: '#ff6b6b',
  Lab: '#48c774',
  Prescription: '#1a6ef5',
  Imaging: '#9b59b6',
  'Visit Summary': '#f39c12',
  Other: '#888',
}

export default function Provider() {
  const navigate = useNavigate()
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const [doctorName, setDoctorName] = useState('')
  const [documents, setDocuments] = useState<Document[]>([])
  const [patients, setPatients] = useState<SharedPatient[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'documents' | 'patients'>('documents')

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!profile || profile.role !== 'provider') {
        navigate('/dashboard')
        return
      }

      setDoctorId(profile.doctor_id)
      setDoctorName(profile.full_name)

      // Fetch documents shared with this doctor
      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .eq('shared_with_doctor', profile.doctor_id)
        .order('created_at', { ascending: false })

      if (docs) setDocuments(docs)

      // Fetch patients who shared all records
      const { data: shared } = await supabase
        .from('shared_records')
        .select('patient_id')
        .eq('doctor_id', profile.doctor_id)

      if (shared && shared.length > 0) {
        const patientIds = shared.map(s => s.patient_id)
        const { data: patientProfiles } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', patientIds)

        if (patientProfiles) setPatients(patientProfiles)
      }

      setLoading(false)
    }
    fetchData()
  }, [])

  const handleView = async (filePath: string) => {
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  const copyDoctorId = () => {
    if (doctorId) {
      navigator.clipboard.writeText(doctorId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      {/* Navbar */}
      <nav style={{ background: '#fff', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h1 style={{ color: '#1a6ef5', fontSize: '22px', fontWeight: 700 }}>MediCANE</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={async () => { await supabase.auth.signOut(); navigate('/') }} style={{ background: '#f0f4ff', border: 'none', color: '#555', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          Welcome, Dr. {doctorName} 👨‍⚕️
        </h2>
        <p style={{ color: '#777', marginBottom: '32px' }}>Provider Dashboard</p>

        {/* Doctor ID Card */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#999', marginBottom: '4px' }}>Your Doctor ID</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1a6ef5', letterSpacing: '3px' }}>{doctorId}</div>
            <div style={{ fontSize: '13px', color: '#777', marginTop: '4px' }}>Share this code with patients so they can send you their records</div>
          </div>
          <button onClick={copyDoctorId} style={{ background: copied ? '#48c774' : '#1a6ef5', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '15px', transition: 'all 0.2s' }}>
            {copied ? '✓ Copied!' : '📋 Copy ID'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', flex: 1, minWidth: '180px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📄</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1a6ef5' }}>{documents.length}</div>
            <div style={{ color: '#777', fontSize: '14px' }}>Shared Documents</div>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', flex: 1, minWidth: '180px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1a6ef5' }}>{patients.length}</div>
            <div style={{ color: '#777', fontSize: '14px' }}>Patients</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {(['documents', 'patients'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === tab ? '#1a6ef5' : '#fff', color: activeTab === tab ? '#fff' : '#555', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>Loading...</div>
            ) : documents.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>No documents shared with you yet.</div>
            ) : (
              documents.map((doc, i) => (
                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: i < documents.length - 1 ? '1px solid #f0f4ff' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '28px' }}>📄</div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{doc.name}</div>
                      <div style={{ fontSize: '13px', color: '#777' }}>{doc.source} · {new Date(doc.created_at).toLocaleDateString()} · {doc.size}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ background: (typeColors[doc.type] || '#888') + '22', color: typeColors[doc.type] || '#888', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>{doc.type}</span>
                    <button onClick={() => handleView(doc.file_path)} style={{ background: '#f0f4ff', border: 'none', color: '#1a6ef5', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>View</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            {patients.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>No patients have shared their records with you yet.</div>
            ) : (
              patients.map((p, i) => (
                <div key={p.patient_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: i < patients.length - 1 ? '1px solid #f0f4ff' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '28px' }}>👤</div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{p.full_name}</div>
                      <div style={{ fontSize: '13px', color: '#777' }}>Age: {p.age} · Blood Type: {p.blood_type} · {p.city}</div>
                    </div>
                  </div>
                  <span style={{ background: '#f0f4ff', color: '#1a6ef5', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>{p.phone}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}