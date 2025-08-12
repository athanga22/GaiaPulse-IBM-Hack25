import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { PulseHistory } from '../lib/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface PulseHistoryChartProps {
  data: PulseHistory | null
  isLoading: boolean
}

export function PulseHistoryChart({ data, isLoading }: PulseHistoryChartProps) {
  const [displayData, setDisplayData] = useState<any>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Smooth transition for chart data
  useEffect(() => {
    if (data && data.data && data.data.length > 0) {
      setIsTransitioning(true)
      
      // Create new chart data
      const newChartData = {
        labels: data.data.map(point => {
          const date = new Date(point.timestamp)
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }),
        datasets: [
          {
            label: 'Earth Pulse',
            data: data.data.map(point => point.value),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          }
        ]
      }

      // Smooth transition with delay
      setTimeout(() => {
        setDisplayData(newChartData)
        setIsTransitioning(false)
      }, 300)
    } else if (!displayData) {
      // Initial static data
      setDisplayData({
        labels: [
          'Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7'
        ],
        datasets: [
          {
            label: 'Earth Pulse',
            data: [65, 68, 72, 70, 75, 78, 82],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          }
        ]
      })
    }
  }, [data, displayData])

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Earth Pulse History (7 Days)',
        color: '#f8fafc',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#6366f1',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Pulse: ${context.parsed.y}°C`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8'
        },
        beginAtZero: false
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '500px', 
      position: 'relative',
      minHeight: '500px'
    }}>
      {displayData && (
        <motion.div
          key={JSON.stringify(displayData.datasets[0].data)}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Line data={displayData} options={options} />
        </motion.div>
      )}
      
      <motion.div 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          fontSize: '0.75rem', 
          color: '#94a3b8',
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '4px 8px',
          borderRadius: '4px'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {data?.period || '7d'} • {data?.aggregation || 'hourly'}
      </motion.div>

      {/* Subtle update indicator */}
      {isTransitioning && (
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            color: '#6366f1',
            zIndex: 10
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          Updating...
        </motion.div>
      )}
    </div>
  )
}
