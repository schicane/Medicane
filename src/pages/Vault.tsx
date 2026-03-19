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
  shared_with_doctor: string | null
}

const typeColors: Record<string, string> = {
  Discharge: '#ff6b6b',
  Lab: '#48c774',
  Prescription: '#1a6ef5',
  Imaging: '#9b59b6',
  'Visit Summary': '#f39c12',
  Other: '#888',
}

export default function Vault() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    name: '',
    type: 'Lab',
    source: '',
    shared_with_doctor: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setDocuments(data)
    setLoading(false)
  }

  const handleUpload = async () => {
    if (!file || !form.name || !form.source) {
      setError('Please fill in all fields and select a file')
      return
    }

    setUploading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { error: dbError } = await supabase.from('documents').insert({
      user_id: user.id,
      name: form.name,
      type: form.type,
      source: form.source,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      file_path: filePath,
      shared_with_doctor: form.shared_with_doctor || null,
    })

    if (dbError) setError(dbError.message)
    else {
      setShowUploadModal(false)
      setForm({ name: '', type: 'Lab', source: '', shared_with_doctor: '' })
      setFile(null)
      fetchDocuments()
    }

    setUploading(false)
  }

  const handleView = async (filePath: string) => {
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  const handleDelete = async (id: string, filePath: string) => {
    await supabase.storage.from('documents').remove([filePath])
    await supabase.from('documents').delete().eq('id', id)
    fetchDocuments()
  }

  const filtered = documents.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase()) ||
    d.source.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff' }}>
      {/* Navbar */}
      <nav style={{ background: '#fff', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h1 style={{ color: '#1a6ef5', fontSize: '22px', fontWeight: 700 }}>MediCANE</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid #1a6ef5', color: '#1a6ef5', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Dashboard</button>
          <button onClick={async () => { await supabase.auth.signOut(); navigate('/') }} style={{ background: '#f0f4ff', border: 'none', color: '#555', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '4px' }}>Document Vault</h2>
            <p style={{ color: '#777' }}>All your medical records in one place</p>
          </div>
          <button onClick={() => setShowUploadModal(true)} style={{ background: '#1a6ef5', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '15px' }}>
            + Upload Document
          </button>
        </div>

        {/* Search */}
        <input
          placeholder="🔍  Search records... e.g. 'Lab' or 'Dr. Smith'"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '14px 18px', borderRadius: '10px', border: '1px solid #dde3f0', fontSize: '15px', marginBottom: '24px', background: '#fff' }}
        />

        {/* Document List */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>Loading documents...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>
              {documents.length === 0 ? 'No documents yet. Upload your first one!' : 'No results found.'}
            </div>
          ) : (
            filtered.map((doc, i) => (
              <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: i < filtered.length - 1 ? '1px solid #f0f4ff' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '28px' }}>📄</div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{doc.name}</div>
                    <div style={{ fontSize: '13px', color: '#777' }}>
                      {doc.source} · {new Date(doc.created_at).toLocaleDateString()} · {doc.size}
                      {doc.shared_with_doctor && (
                        <span style={{ marginLeft: '8px', background: '#f0f7ff', color: '#1a6ef5', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>
                          Shared with {doc.shared_with_doctor}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: (typeColors[doc.type] || '#888') + '22', color: typeColors[doc.type] || '#888', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>{doc.type}</span>
                  <button onClick={() => handleView(doc.file_path)} style={{ background: '#f0f4ff', border: 'none', color: '#1a6ef5', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>View</button>
                  <button onClick={() => handleDelete(doc.id, doc.file_path)} style={{ background: '#fff0f0', border: 'none', color: '#ff6b6b', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '480px', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Upload Document</h3>
              <button onClick={() => { setShowUploadModal(false); setError(null); setFile(null) }} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#999' }}>✕</button>
            </div>

            <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Document Name</label>
            <input placeholder="e.g. Blood Panel Results" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dde3f0', marginBottom: '16px', fontSize: '15px' }} />

            <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Document Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dde3f0', marginBottom: '16px', fontSize: '15px' }}>
              {['Lab', 'Discharge', 'Prescription', 'Imaging', 'Visit Summary', 'Other'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Source (Doctor/Hospital)</label>
            <input placeholder="e.g. Dr. Smith or City Hospital" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dde3f0', marginBottom: '16px', fontSize: '15px' }} />

            <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Share with Doctor ID <span style={{ color: '#999', fontWeight: 400 }}>(optional)</span></label>
            <input placeholder="e.g. MED-4X7K" value={form.shared_with_doctor} onChange={(e) => setForm({ ...form, shared_with_doctor: e.target.value.toUpperCase() })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dde3f0', marginBottom: '16px', fontSize: '15px' }} />

            <label style={{ display: 'block', border: '2px dashed #dde3f0', borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px', background: '#f9fbff' }}>
              {file ? (
                <div style={{ color: '#1a6ef5', fontWeight: 600 }}>📄 {file.name}</div>
              ) : (
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                  <div style={{ fontWeight: 600, color: '#1a6ef5' }}>Click to select file</div>
                  <div style={{ fontSize: '13px', color: '#999' }}>PDF, JPG, PNG supported</div>
                </div>
              )}
              <input type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
            </label>

            {error && (
              <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px', color: '#cc0000', fontSize: '14px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <button onClick={handleUpload} disabled={uploading} style={{ width: '100%', background: '#1a6ef5', color: '#fff', border: 'none', padding: '13px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}