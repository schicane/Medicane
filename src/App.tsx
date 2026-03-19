import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vault from './pages/Vault'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import Provider from './pages/Provider'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/vault" element={
        <ProtectedRoute>
          <Vault />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/provider" element={
  <ProtectedRoute>
    <Provider />
  </ProtectedRoute>
} />
    </Routes>
  )
}

export default App