import { useState, useEffect } from 'react'
import { useAuth } from './auth/AuthContext'
import AuthFlow from './auth/AuthFlow'
import Somyle from './Somyle'
import somyleLogo from './assets/somyle-logo.jpg'

function SplashScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#02422a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <img src={somyleLogo} alt="somyle" style={{ width: 220 }} />
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