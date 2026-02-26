import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      <nav style={{ background: '#fff', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h1 style={{ color: '#1a6ef5', fontSize: '24px', fontWeight: 700 }}>MediCANE</h1>
        <button onClick={() => navigate('/login')} style={{ background: '#1a6ef5', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          Get Started
        </button>
      </nav>

      <div style={{ textAlign: 'center', padding: '100px 20px 60px' }}>
        <h2 style={{ fontSize: '48px', fontWeight: 800, color: '#1a1a2e', marginBottom: '16px' }}>
          Your Medical Records, <span style={{ color: '#1a6ef5' }}>One Place</span>
        </h2>
        <p style={{ fontSize: '18px', color: '#555', maxWidth: '560px', margin: '0 auto 36px' }}>
          MediCANE consolidates your health history into a secure, AI-powered hub — accessible anywhere, shareable with any provider.
        </p>
        <button onClick={() => navigate('/login')} style={{ background: '#1a6ef5', color: '#fff', border: 'none', padding: '14px 36px', borderRadius: '10px', fontSize: '16px', cursor: 'pointer', fontWeight: 700 }}>
          Get Started Free
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', padding: '0 40px 80px' }}>
        {[
          { icon: '🗂️', title: 'Document Vault', desc: 'Upload and store all your medical PDFs securely in one place.' },
          { icon: '🤖', title: 'AI Extraction', desc: 'AI reads your records and pulls out meds, diagnoses, and allergies.' },
          { icon: '🔍', title: 'Smart Search', desc: 'Search across all your records instantly with natural language.' },
          { icon: '🔗', title: 'Easy Sharing', desc: 'Share a time-limited medical packet with any provider via QR or link.' },
        ].map((f) => (
          <div key={f.title} style={{ background: '#fff', borderRadius: '12px', padding: '28px', width: '220px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{f.icon}</div>
            <h3 style={{ color: '#1a1a2e', marginBottom: '8px' }}>{f.title}</h3>
            <p style={{ color: '#777', fontSize: '14px' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}