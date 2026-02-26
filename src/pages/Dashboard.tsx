import { useNavigate } from 'react-router-dom'

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

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      <nav style={{ background: '#fff', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h1 style={{ color: '#1a6ef5', fontSize: '22px', fontWeight: 700 }}>MediCANE</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/vault')} style={{ background: 'transparent', border: '1px solid #1a6ef5', color: '#1a6ef5', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Document Vault</button>
          <button onClick={() => navigate('/')} style={{ background: '#f0f4ff', border: 'none', color: '#555', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Welcome back, Alex 👋</h2>
        <p style={{ color: '#777', marginBottom: '32px' }}>Here's your health summary</p>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: '#fff', borderRadius: '12px', padding: '24px', minWidth: '180px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', flex: 1 }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#1a6ef5' }}>{s.value}</div>
              <div style={{ color: '#777', fontSize: '14px' }}>{s.label}</div>
            </div>
          ))}
        </div>

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
    </div>
  )
}