import { useState, useEffect } from 'react'
import { useAuth } from './auth/AuthContext'
import AuthFlow from './auth/AuthFlow'
import Somyle from './Somyle'
import somyleLogo from './assets/somyle-logo.jpg'

function SplashScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#024027',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <style>{`
  @keyframes splash {
    0%   { transform: scale(0.5); opacity: 0; }
    60%  { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1);   opacity: 1; }
  }
  .splash-logo {
    animation: splash 0.8s ease-out forwards;
  }
`}</style>
<img
  src={somyleLogo}
  alt="somyle"
  className="splash-logo"
  style={{ width: 220 }}
/>
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