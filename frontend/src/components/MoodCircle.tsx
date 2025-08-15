import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { CurrentMood } from '../lib/api'

interface MoodCircleProps {
  mood: CurrentMood | null
  isLoading: boolean
}

export function MoodCircle({ mood, isLoading }: MoodCircleProps) {
  const [displayMood, setDisplayMood] = useState<CurrentMood | null>(null)
  const [displayScore, setDisplayScore] = useState(0)

  // Debug logging
  console.log('MoodCircle received:', { mood, isLoading })

  // Smooth transition for mood data
  useEffect(() => {
    if (mood) {
      setDisplayMood(mood)
      // Animate score smoothly - cap at reasonable values
      const targetScore = Math.min(Math.round(mood.score * 100), 100)
      const startScore = displayScore
      const duration = 1000 // 1 second transition
      const startTime = Date.now()

      const animateScore = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentScore = Math.round(startScore + (targetScore - startScore) * easeOutQuart)
        
        setDisplayScore(currentScore)
        
        if (progress < 1) {
          requestAnimationFrame(animateScore)
        }
      }
      
      requestAnimationFrame(animateScore)
    }
  }, [mood, displayScore])

  // Default mood if no data
  const currentMood = displayMood || {
    mood: 'neutral',
    score: 0.5,
    timestamp: new Date().toISOString(),
    predictive_statement: 'Monitoring Earth\'s vital signs...',
    confidence: 0.8,
    factors: ['temperature', 'co2_levels', 'forest_cover'],
    trend: 'stable',
    next_update: new Date(Date.now() + 20000).toISOString()
  }

  const getMoodColor = (moodType: string) => {
    switch (moodType) {
      case 'healing':
        return '#10b981'
      case 'stressed':
        return '#f59e0b'
      case 'critical':
        return '#ef4444'
      default:
        return '#6366f1'
    }
  }

  const getMoodText = (moodType: string) => {
    switch (moodType) {
      case 'healing':
        return 'Healing'
      case 'stressed':
        return 'Stressed'
      case 'critical':
        return 'Critical'
      default:
        return 'Neutral'
    }
  }



  return (
    <div style={{ textAlign: 'center' }}>
      {/* Enhanced Main Mood Circle */}
      <motion.div
        style={{
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          margin: '0 auto 2rem',
          position: 'relative',
          background: `
            conic-gradient(from 0deg, 
              ${getMoodColor(currentMood.mood)} 0deg, 
              ${getMoodColor(currentMood.mood)} ${displayScore * 3.6}deg, 
              rgba(255, 255, 255, 0.08) ${displayScore * 3.6}deg, 
              rgba(255, 255, 255, 0.08) 360deg
            ),
            radial-gradient(circle at center, 
              rgba(255, 255, 255, 0.1) 0%, 
              transparent 70%
            )
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `
            0 0 100px ${getMoodColor(currentMood.mood)}40,
            inset 0 0 50px rgba(255, 255, 255, 0.1),
            0 0 20px rgba(0, 0, 0, 0.3)
          `,
          border: '4px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)'
        }}
        animate={{
          scale: [1, 1.03, 1],
          rotate: [0, 1, -1, 0],
          boxShadow: [
            `0 0 100px ${getMoodColor(currentMood.mood)}40`,
            `0 0 150px ${getMoodColor(currentMood.mood)}60`,
            `0 0 100px ${getMoodColor(currentMood.mood)}40`
          ]
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        {/* Inner Circle */}
        <div style={{
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          position: 'relative'
        }}>
          {/* Professional Earth Animation Container */}
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            marginBottom: '1.5rem'
          }}>
            {/* Multiple Glow Rings for Depth */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                right: '-20px',
                bottom: '-20px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${getMoodColor(currentMood.mood)}15, transparent 60%)`,
                border: `1px solid ${getMoodColor(currentMood.mood)}25`
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            
            <motion.div
              style={{
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                right: '-15px',
                bottom: '-15px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${getMoodColor(currentMood.mood)}10, transparent 70%)`,
                border: `1px solid ${getMoodColor(currentMood.mood)}20`
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1
              }}
            />

            {/* Main Earth Sphere with Advanced Effects */}
            <motion.div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: `
                  radial-gradient(circle at 25% 25%, 
                    ${getMoodColor(currentMood.mood)} 0%, 
                    ${getMoodColor(currentMood.mood)}80 40%, 
                    ${getMoodColor(currentMood.mood)}40 70%, 
                    ${getMoodColor(currentMood.mood)}20 100%
                  ),
                  radial-gradient(circle at 75% 75%, 
                    rgba(255,255,255,0.1) 0%, 
                    transparent 50%
                  )
                `,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `
                  inset 0 0 30px rgba(0,0,0,0.4),
                  0 0 40px ${getMoodColor(currentMood.mood)}50,
                  inset 0 0 40px rgba(255,255,255,0.15),
                  0 0 20px rgba(255,255,255,0.1)
                `,
                position: 'relative',
                overflow: 'hidden',
                border: `2px solid ${getMoodColor(currentMood.mood)}60`
              }}
              animate={{
                rotateY: [0, 360],
                rotateX: [0, 20, 0],
                scale: [1, 1.03, 1]
              }}
              transition={{
                rotateY: { duration: 30, repeat: Infinity, ease: 'linear' },
                rotateX: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
              }}
            >
              {/* Atmospheric Halo Effect */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  right: '-8px',
                  bottom: '-8px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, transparent 50%, ${getMoodColor(currentMood.mood)}15 70%, transparent 90%)`,
                  border: `1px solid ${getMoodColor(currentMood.mood)}30`
                }}
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5
                }}
              />

              {/* Enhanced Grid System */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: `
                  linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.2) 49%, rgba(255,255,255,0.2) 51%, transparent 51%),
                  linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.1) 24%, rgba(255,255,255,0.1) 26%, transparent 26%),
                  linear-gradient(90deg, transparent 74%, rgba(255,255,255,0.1) 74%, rgba(255,255,255,0.1) 76%, transparent 76%),
                  linear-gradient(0deg, transparent 49%, rgba(255,255,255,0.2) 49%, rgba(255,255,255,0.2) 51%, transparent 51%),
                  linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.1) 24%, rgba(255,255,255,0.1) 26%, transparent 26%),
                  linear-gradient(0deg, transparent 74%, rgba(255,255,255,0.1) 74%, rgba(255,255,255,0.1) 76%, transparent 76%)
                `,
                borderRadius: '50%'
              }} />

              {/* Animated Data Points & Pulse Effects */}
              <motion.div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%'
                }}
                animate={{
                  rotate: [0, -360]
                }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                {/* Sensor Points */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: `0 0 8px ${getMoodColor(currentMood.mood)}80`,
                      top: `${15 + (i * 8) % 70}%`,
                      left: `${10 + (i * 12) % 80}%`
                    }}
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.25,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </motion.div>

              {/* Pulse Rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`pulse-${i}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: `2px solid ${getMoodColor(currentMood.mood)}40`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 1.3,
                    ease: 'easeOut'
                  }}
                />
              ))}

              {/* Core Pulse */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${getMoodColor(currentMood.mood)}, ${getMoodColor(currentMood.mood)}80)`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 20px ${getMoodColor(currentMood.mood)}60`
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />

              {/* Center Core */}
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
                boxShadow: `
                  0 0 15px rgba(255,255,255,0.8),
                  inset 0 0 5px rgba(255,255,255,0.3)
                `,
                position: 'relative',
                zIndex: 2
              }} />

              {/* Pulse Rings */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: getMoodColor(currentMood.mood),
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{
                  scale: [1, 20, 1],
                  opacity: [1, 0, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
              />
            </motion.div>

            {/* Orbital Rings */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                right: '-20px',
                bottom: '-20px',
                borderRadius: '50%',
                border: `1px solid ${getMoodColor(currentMood.mood)}20`,
                transform: 'rotateX(60deg)'
              }}
              animate={{
                rotateZ: [0, 360]
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: 'linear'
              }}
            />

            <motion.div
              style={{
                position: 'absolute',
                top: '-30px',
                left: '-30px',
                right: '-30px',
                bottom: '-30px',
                borderRadius: '50%',
                border: `1px dashed ${getMoodColor(currentMood.mood)}15`,
                transform: 'rotateX(45deg)'
              }}
              animate={{
                rotateZ: [360, 0]
              }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </div>
          

          
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#ffffff',
            textShadow: `
              0 2px 8px rgba(0,0,0,0.8),
              0 0 20px rgba(0,0,0,0.6),
              0 0 40px ${getMoodColor(currentMood.mood)}40,
              0 0 60px ${getMoodColor(currentMood.mood)}20
            `,
            marginBottom: '0.25rem',
            filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))'
          }}>
            {getMoodText(currentMood.mood)}
          </div>
          

        </div>
      </motion.div>

      {/* Mood Details */}
      <motion.div
        style={{
          maxWidth: '500px',
          margin: '0 auto',
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.p
          style={{
            fontSize: '1.125rem',
            color: '#f8fafc',
            marginBottom: '1rem',
            lineHeight: '1.6',
            fontWeight: '500'
          }}
          key={currentMood.predictive_statement}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {currentMood.predictive_statement}
        </motion.p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          color: '#94a3b8'
        }}>
          <span>Confidence: {Math.round(currentMood.confidence * 100)}%</span>
          <span>Trend: {currentMood.trend}</span>
        </div>
      </motion.div>
    </div>
  )
}
