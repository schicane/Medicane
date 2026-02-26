import { useNavigate } from 'react-router-dom'

const documents = [
  { name: 'ER Discharge Summary', date: 'Feb 10, 2025', type: 'Discharge', source: 'City Hospital', size: '1.2 MB' },
  { name: 'Blood Panel Results', date: 'Jan 28, 2025', type: 'Lab', source: 'LabCorp', size: '0.8 MB' },
  { name: 'Amoxicillin Prescription', date: 'Jan 15, 2025', type: 'Prescription', source: 'Dr. Smith', size: '0.3 MB' },
  { name: 'Chest X-Ray Report', date: 'Dec 5, 2024', type: 'Imaging', source: 'City Radiology', size: '4.5 MB' },
  { name: 'Annual Visit Summary', date: 'Nov 20, 2024', type: 'Visit Summary', source: 'Dr. Jones', size: '0.6 MB' },
]

const typeColors: Record<string, string> = {
  Discharge: '#ff6b6b',
  Lab: '#48c774',
  Prescription: '#1a6ef5',
  Imaging: '#9b59b6',
  'Visit Summary': '#f39c12',
}

export default function Vault() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      <nav style={{ background: '#fff', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h1 style={{ color: '#1a6ef5', fontSize: '22px', fontWeight: 700 }}>MediCANE</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid #1a6ef5', color: '#1a6ef5', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Dashboard</button>
          <button onClick={() => navigate('/')} style={{ background: '#f0f4ff', border: 'none', color: '#555', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '4px' }}>Document Vault</h2>
            <p style={{ color: '#777' }}>All your medical records in one place</p>
          </div>
          <button style={{ background: '#1a6ef5', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>
            + Upload Document
          </button>
        </div>

        <input placeholder="🔍  Search records... e.g. 'Show my A1C results'" style={{ width: '100%', padding: '14px 18px', borderRadius: '10px', border: '1px solid #dde3f0', fontSize: '15px', marginBottom: '24px', background: '#fff' }} />

        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          {documents.map((doc, i) => (
            <div key={doc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: i < documents.length - 1 ? '1px solid #f0f4ff' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '28px' }}>📄</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{doc.name}</div>
                  <div style={{ fontSize: '13px', color: '#777' }}>{doc.source} · {doc.date} · {doc.size}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ background: typeColors[doc.type] + '22', color: typeColors[doc.type], padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>{doc.type}</span>
                <button style={{ background: '#f0f4ff', border: 'none', color: '#1a6ef5', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}