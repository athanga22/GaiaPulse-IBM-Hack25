import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { CurrentMood } from '../lib/api'

interface MoodCircleProps {
  mood: CurrentMood | null
  isLoading: boolean
}

export function MoodCircle({ mood, isLoading }: MoodCircleProps) {
  const [displayMood, setDisplayMood] = useState<CurrentMood | null>(null)
  const [displayScore, setDisplayScore] = useState(0)

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

  const getMoodDescription = (moodType: string) => {
    switch (moodType) {
      case 'healing':
        return 'Environmental recovery detected'
      case 'stressed':
        return 'Environmental stress indicators'
      case 'critical':
        return 'Critical environmental conditions'
      default:
        return 'Stable environmental conditions'
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Main Mood Circle */}
      <motion.div
        style={{
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          margin: '0 auto 2rem',
          position: 'relative',
          background: `conic-gradient(from 0deg, ${getMoodColor(currentMood.mood)} 0deg, ${getMoodColor(currentMood.mood)} ${displayScore * 3.6}deg, rgba(255, 255, 255, 0.05) ${displayScore * 3.6}deg, rgba(255, 255, 255, 0.05) 360deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 80px ${getMoodColor(currentMood.mood)}30`,
          border: '3px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)'
        }}
        animate={{
          scale: [1, 1.02, 1],
          boxShadow: [
            `0 0 80px ${getMoodColor(currentMood.mood)}30`,
            `0 0 120px ${getMoodColor(currentMood.mood)}50`,
            `0 0 80px ${getMoodColor(currentMood.mood)}30`
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
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
          {/* Earth Animation Container */}
          <div style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            marginBottom: '1rem'
          }}>
            {/* Outer Glow Ring */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                right: '-10px',
                bottom: '-10px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${getMoodColor(currentMood.mood)}20, transparent 70%)`,
                border: `2px solid ${getMoodColor(currentMood.mood)}30`
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            {/* Main Earth Sphere */}
            <motion.div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${getMoodColor(currentMood.mood)}, ${getMoodColor(currentMood.mood)}80 60%, ${getMoodColor(currentMood.mood)}40)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `
                  inset 0 0 20px rgba(0,0,0,0.3),
                  0 0 30px ${getMoodColor(currentMood.mood)}40,
                  inset 0 0 30px rgba(255,255,255,0.1)
                `,
                position: 'relative',
                overflow: 'hidden'
              }}
              animate={{
                rotateY: [0, 360],
                rotateX: [0, 15, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{
                rotateY: { duration: 25, repeat: Infinity, ease: 'linear' },
                rotateX: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }}
            >
              {/* Atmospheric Layer */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '-5px',
                  left: '-5px',
                  right: '-5px',
                  bottom: '-5px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, transparent 60%, ${getMoodColor(currentMood.mood)}10 80%, transparent)`,
                  border: `1px solid ${getMoodColor(currentMood.mood)}20`
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />

              {/* Grid Lines - Longitude */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: `
                  linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.15) 49%, rgba(255,255,255,0.15) 51%, transparent 51%),
                  linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.08) 24%, rgba(255,255,255,0.08) 26%, transparent 26%),
                  linear-gradient(90deg, transparent 74%, rgba(255,255,255,0.08) 74%, rgba(255,255,255,0.08) 76%, transparent 76%)
                `,
                borderRadius: '50%'
              }} />

              {/* Grid Lines - Latitude */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: `
                  linear-gradient(0deg, transparent 49%, rgba(255,255,255,0.15) 49%, rgba(255,255,255,0.15) 51%, transparent 51%),
                  linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.08) 24%, rgba(255,255,255,0.08) 26%, transparent 26%),
                  linear-gradient(0deg, transparent 74%, rgba(255,255,255,0.08) 74%, rgba(255,255,255,0.08) 76%, transparent 76%)
                `,
                borderRadius: '50%'
              }} />

              {/* Data Points */}
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
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                {/* Sensor Points */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 0 6px rgba(255, 255, 255, 0.6)',
                      top: `${20 + (i * 10) % 60}%`,
                      left: `${15 + (i * 15) % 70}%`
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </motion.div>

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
          
          <motion.div
            style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#f8fafc',
              marginBottom: '0.5rem',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}
            key={displayScore}
            initial={{ scale: 1.1, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {displayScore}%
          </motion.div>
          
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: getMoodColor(currentMood.mood),
            textShadow: `0 0 20px ${getMoodColor(currentMood.mood)}`,
            marginBottom: '0.25rem'
          }}>
            {getMoodText(currentMood.mood)}
          </div>
          
          <div style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            fontWeight: '500',
            textAlign: 'center',
            maxWidth: '160px'
          }}>
            {getMoodDescription(currentMood.mood)}
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
