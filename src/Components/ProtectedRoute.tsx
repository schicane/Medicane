import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) navigate('/login')
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#1a6ef5', fontSize: '18px', fontWeight: 600 }}>Loading...</div>
    </div>
  )

  return <>{children}</>
}