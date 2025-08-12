import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Clock, Wifi, Database } from 'lucide-react'

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Update last update time every 20 seconds (matching our data refresh)
  useEffect(() => {
    const updateTimer = setInterval(() => {
      setLastUpdate(new Date())
    }, 20000)

    return () => clearInterval(updateTimer)
  }, [])

  return (
    <motion.header
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1.5rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
          }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>G</span>
          </div>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#f8fafc',
              margin: 0,
              textShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}>
              GaiaPulse
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                width: '0.5rem',
                height: '0.5rem',
                background: '#10b981',
                borderRadius: '50%',
                display: 'inline-block'
              }} />
              Live Monitoring
            </p>
          </div>
        </div>

        {/* System Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Current Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock style={{ width: '1rem', height: '1rem', color: '#94a3b8' }} />
            <span style={{
              fontSize: '0.875rem',
              color: '#f8fafc',
              fontWeight: '500',
              fontFamily: 'JetBrains Mono, monospace'
            }}>
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </span>
          </div>

          {/* Last Update */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database style={{ width: '1rem', height: '1rem', color: '#94a3b8' }} />
            <span style={{
              fontSize: '0.875rem',
              color: '#94a3b8'
            }}>
              Updated {lastUpdate.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>

          {/* Connection Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wifi style={{ width: '1rem', height: '1rem', color: '#10b981' }} />
            <span style={{
              fontSize: '0.875rem',
              color: '#10b981',
              fontWeight: '500'
            }}>
              Connected
            </span>
          </div>

          {/* Data Sources */}
          <div style={{
            padding: '0.5rem 1rem',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            fontSize: '0.75rem',
            color: '#6366f1',
            fontWeight: '500',
            fontFamily: 'JetBrains Mono, monospace'
          }}>
            NASA • NOAA • EPA
          </div>
        </div>
      </div>
    </motion.header>
  )
}
