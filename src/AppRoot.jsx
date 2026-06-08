import { useState, useEffect } from 'react'
import { useAuth } from './auth/AuthContext'
import AuthFlow from './auth/AuthFlow'
import Somyle from './Somyle'

function SplashScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A3D20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <span style={{
        fontSize: 52,
        fontWeight: 800,
        color: '#ffffff',
        letterSpacing: -2,
      }}>
        somyle
      </span>
    </div>
  )
}

export default function AppRoot() {
  const { user, loading } = useAuth()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2000)
    return () => clearTimeout(t)
  }, [])

  if (showSplash || loading) return <SplashScreen />
  if (!user) return <AuthFlow />
  return <Somyle />
}