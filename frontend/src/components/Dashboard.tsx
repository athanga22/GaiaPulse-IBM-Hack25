import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { Header } from './Header'
import { MoodCircle } from './MoodCircle'
import { PulseHistoryChart } from './PulseHistoryChart'
import { StatCard } from './StatCard'
import { ChatSidebar } from './ChatSidebar'
import { useCurrentMood } from '../hooks/useCurrentMood'
import { usePulseHistory } from '../hooks/usePulseHistory'
import { Thermometer, Droplets, TreePine, Wind } from 'lucide-react'

export function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { data: currentMood, isLoading: moodLoading, refetch: refetchMood } = useCurrentMood()
  const { data: pulseHistory, isLoading: historyLoading } = usePulseHistory()

  // Debug logging
  console.log('Dashboard mood data:', { currentMood, moodLoading })

  // Dynamic floating particles effect based on mood
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div')
      const mood = currentMood?.mood || 'neutral'
      
      // Debug logging
      console.log('Creating particle for mood:', mood)
      
      // Set particle properties based on mood
      if (mood === 'critical') {
        // Sparks for critical - fast, bright, red/orange
        particle.className = 'particle particle-spark'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.animationDelay = Math.random() * 2 + 's'
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's'
        particle.style.background = `rgba(${Math.random() > 0.5 ? '239, 68, 68' : '245, 101, 101'}, 1.0)`
        particle.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.8)'
        particle.style.width = '6px'
        particle.style.height = '6px'
      } else if (mood === 'stressed') {
        // Smaller, more ominous particles for stressed
        particle.className = 'particle particle-stressed'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.animationDelay = Math.random() * 1 + 's'
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's'
        particle.style.background = 'rgba(245, 158, 11, 0.6)'
        particle.style.boxShadow = '0 0 8px rgba(245, 158, 11, 0.4)'
        particle.style.width = '4px'
        particle.style.height = '4px'
      } else {
        // Gentle, blue particles for healing/neutral
        particle.className = 'particle particle-gentle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.animationDelay = Math.random() * 20 + 's'
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's'
        particle.style.background = 'rgba(99, 102, 241, 0.7)'
        particle.style.boxShadow = '0 0 8px rgba(99, 102, 241, 0.5)'
        particle.style.width = '7px'
        particle.style.height = '7px'
      }
      
      const container = document.querySelector('.floating-particles')
      if (container) {
        container.appendChild(particle)
        console.log('Particle added to container')
      } else {
        console.error('Floating particles container not found!')
      }
      
      // Remove particle after animation
      const duration = mood === 'critical' ? 5000 : mood === 'stressed' ? 20000 : 25000
      setTimeout(() => {
        particle.remove()
      }, duration)
    }

    // Adjust spawn rate based on mood
    const mood = currentMood?.mood || 'neutral'
    const spawnRate = mood === 'critical' ? 50 : mood === 'stressed' ? 200 : 150 // More frequent for visibility
    
    console.log('Setting up particles with spawn rate:', spawnRate, 'ms for mood:', mood)
    
    const interval = setInterval(createParticle, spawnRate)
    return () => clearInterval(interval)
  }, [currentMood])

  return (
    <div style={{ 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic floating particles background */}
      <div className="floating-particles" />
      
      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Header />
        
        <main style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '2rem 1.5rem',
          position: 'relative'
        }}>


          {/* Chat Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              zIndex: 30,
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '50%',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: 'none',
              cursor: 'pointer',
              width: '4rem',
              height: '4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.3)'
            }}
          >
            <MessageCircle style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
          </button>

          {/* Hero Section */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '4rem',
            padding: '2rem 0'
          }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#f8fafc',
              marginBottom: '1rem',
              textShadow: '0 4px 8px rgba(0,0,0,0.4)'
            }}>
              Earth's Vital Signs
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#94a3b8',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Real-time environmental monitoring with AI-powered insights
            </p>
          </div>

          {/* Main Content Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* Left Column - Mood Circle & History */}
            <div style={{ gridColumn: 'span 2' }}>
              {/* Mood Circle Section */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '500px',
                marginBottom: '3rem'
              }}>
                <MoodCircle mood={currentMood} isLoading={moodLoading} />
              </div>

              {/* Pulse History */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <PulseHistoryChart data={pulseHistory} isLoading={historyLoading} />
              </div>
            </div>

            {/* Right Column - Quick Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#f8fafc', 
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                Environmental Metrics
              </h2>
              
              <StatCard
                title="Global Temperature"
                value="1.2°C"
                icon={Thermometer}
                trend="up"
                trendValue="+0.1°C"
                color="critical"
              />

              <StatCard
                title="CO₂ Levels"
                value="420 ppm"
                icon={Wind}
                trend="up"
                trendValue="+2.5 ppm"
                color="stressed"
              />

              <StatCard
                title="Forest Cover"
                value="31.2%"
                icon={TreePine}
                trend="down"
                trendValue="-0.1%"
                color="critical"
              />

              <StatCard
                title="Ocean Health"
                value="72%"
                icon={Droplets}
                trend="up"
                trendValue="+1.2%"
                color="healing"
              />

              {/* Additional Info */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  color: '#f8fafc'
                }}>
                  About GaiaPulse
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#94a3b8', 
                  lineHeight: '1.6' 
                }}>
                  GaiaPulse translates complex environmental data into Earth's emotional state, 
                  making climate science accessible and engaging. Our AI-powered system monitors 
                  global indicators to provide real-time insights into planetary health.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer style={{ 
            marginTop: '4rem', 
            paddingTop: '2rem', 
            borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
            textAlign: 'center', 
            color: '#94a3b8' 
          }}>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              Built with ❤️ for Earth | Powered by IBM watsonx.ai
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Real-time environmental monitoring and AI-powered insights
            </p>
          </footer>
        </main>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}
