import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { ComponentType } from 'react'

interface StatCardProps {
  title: string
  value: string
  icon: ComponentType<{ size?: number; color?: string }>
  trend: 'up' | 'down' | 'stable'
  trendValue: string
  color: 'healing' | 'stressed' | 'critical' | 'neutral'
}

export function StatCard({ title, value, icon: Icon, trend, trendValue, color }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [displayTrendValue, setDisplayTrendValue] = useState(trendValue)

  // Smooth transition for values
  useEffect(() => {
    const animateValue = (targetValue: string, setter: (value: string) => void) => {
      // Extract numeric part and unit
      const match = targetValue.match(/^([+-]?\d*\.?\d*)(.*)$/)
      if (!match) {
        setter(targetValue)
        return
      }

      const [, numericPart, unit] = match
      const targetNumber = parseFloat(numericPart)
      
      if (isNaN(targetNumber)) {
        setter(targetValue)
        return
      }

      // Get current numeric value
      const currentMatch = displayValue.match(/^([+-]?\d*\.?\d*)(.*)$/)
      const currentNumber = currentMatch ? parseFloat(currentMatch[1]) : 0
      const currentUnit = currentMatch ? currentMatch[2] : unit

      const duration = 800 // 0.8 second transition
      const startTime = Date.now()
      const startNumber = currentNumber

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentNumber = startNumber + (targetNumber - startNumber) * easeOutQuart
        
        setter(`${currentNumber.toFixed(1)}${unit}`)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }

    animateValue(value, setDisplayValue)
    animateValue(trendValue, setDisplayTrendValue)
  }, [value, trendValue, displayValue])

  const getColorStyles = (colorType: string) => {
    switch (colorType) {
      case 'healing':
        return {
          textColor: '#10b981',
          borderColor: '#10b981',
          glowColor: '#10b98140',
          bgColor: 'rgba(16, 185, 129, 0.1)'
        }
      case 'stressed':
        return {
          textColor: '#f59e0b',
          borderColor: '#f59e0b',
          glowColor: '#f59e0b40',
          bgColor: 'rgba(245, 158, 11, 0.1)'
        }
      case 'critical':
        return {
          textColor: '#ef4444',
          borderColor: '#ef4444',
          glowColor: '#ef444440',
          bgColor: 'rgba(239, 68, 68, 0.1)'
        }
      default:
        return {
          textColor: '#6366f1',
          borderColor: '#6366f1',
          glowColor: '#6366f140',
          bgColor: 'rgba(99, 102, 241, 0.1)'
        }
    }
  }

  const getTrendColor = (trendType: string) => {
    switch (trendType) {
      case 'up':
        return '#10b981'
      case 'down':
        return '#ef4444'
      default:
        return '#94a3b8'
    }
  }

  const colors = getColorStyles(color)
  const trendColor = getTrendColor(trend)

  return (
    <motion.div
      style={{
        padding: '1.5rem',
        background: colors.bgColor,
        borderRadius: '1rem',
        border: `1px solid ${colors.borderColor}`,
        boxShadow: `0 4px 20px ${colors.glowColor}`,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 8px 32px ${colors.glowColor}`,
        borderColor: colors.textColor
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ 
          fontSize: '0.875rem', 
          fontWeight: '600', 
          color: '#94a3b8',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {title}
        </h3>
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '0.75rem',
          background: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${colors.borderColor}`
        }}>
          <Icon size={20} color={colors.textColor} />
        </div>
      </div>

      <motion.div
        style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#f8fafc',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        key={displayValue}
        initial={{ scale: 1.05, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {displayValue}
      </motion.div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {trend === 'up' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <TrendingUp size={16} color={trendColor} />
          </motion.div>
        )}
        {trend === 'down' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <TrendingDown size={16} color={trendColor} />
          </motion.div>
        )}
        <motion.span
          style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: trendColor
          }}
          key={displayTrendValue}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {displayTrendValue}
        </motion.span>
      </div>
    </motion.div>
  )
}
