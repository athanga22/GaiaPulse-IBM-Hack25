import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, Sparkles } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { sendChatMessage, type ChatResponse } from '../lib/api'

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  response?: ChatResponse
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm GaiaPulse AI, your environmental intelligence assistant. I can help you understand Earth's vital signs, climate trends, and environmental insights. What would you like to know about our planet's health?",
      isUser: false,
      timestamp: new Date(),
      response: {
        response: "Hello! I'm GaiaPulse AI, your environmental intelligence assistant. I can help you understand Earth's vital signs, climate trends, and environmental insights. What would you like to know about our planet's health?",
        confidence: 0.95,
        sources: ["GaiaPulse Environmental Database"],
        suggestions: ["Tell me about current climate trends", "What's Earth's current mood?", "How are our oceans doing?", "What can I do to help?"],
        timestamp: new Date().toISOString()
      }
    }
  ])
  const [inputValue, setInputValue] = useState('')

  const chatMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data, variables) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: variables,
        isUser: true,
        timestamp: new Date()
      }
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
        response: data
      }
      
      setMessages(prev => [...prev, newMessage, aiResponse])
      setInputValue('')
    },
    onError: (error) => {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  })

  const handleSendMessage = () => {
    if (inputValue.trim() && !chatMutation.isPending) {
      chatMutation.mutate(inputValue.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              zIndex: 40
            }}
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '500px',
              height: '100vh',
              background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.98), rgba(30, 30, 50, 0.95))',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(99, 102, 241, 0.2)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '2rem',
              borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
                }}>
                  <Bot style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    color: '#f8fafc',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    GaiaPulse AI
                    <Sparkles style={{ width: '1rem', height: '1rem', color: '#6366f1' }} />
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#94a3b8',
                    margin: 0
                  }}>
                    Environmental Intelligence Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <X style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    justifyContent: message.isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '85%',
                    padding: '1rem 1.25rem',
                    borderRadius: '1.25rem',
                    background: message.isUser 
                      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                      : 'rgba(255, 255, 255, 0.08)',
                    border: message.isUser 
                      ? 'none'
                      : '1px solid rgba(99, 102, 241, 0.2)',
                    color: message.isUser ? 'white' : '#f8fafc',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    boxShadow: message.isUser 
                      ? '0 8px 32px rgba(99, 102, 241, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}>
                    {message.text}
                    
                    {/* Suggestions for AI responses */}
                    {!message.isUser && message.response?.suggestions && (
                      <div style={{ marginTop: '1rem' }}>
                        <p style={{ 
                          fontSize: '0.8rem', 
                          color: message.isUser ? 'rgba(255, 255, 255, 0.8)' : '#94a3b8',
                          marginBottom: '0.75rem',
                          fontWeight: '600'
                        }}>
                          💡 Quick questions:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {message.response.suggestions.slice(0, 3).map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => setInputValue(suggestion)}
                              style={{
                                background: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                borderRadius: '0.75rem',
                                padding: '0.5rem 0.75rem',
                                fontSize: '0.8rem',
                                color: message.isUser ? 'white' : '#cbd5e1',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'left',
                                fontWeight: '500'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'
                                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'
                                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'
                              }}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {chatMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start'
                  }}
                >
                  <div style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '1.25rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    color: '#94a3b8',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <div style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        background: '#6366f1',
                        borderRadius: '50%',
                        animation: 'pulse 1.5s infinite'
                      }} />
                      <div style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        background: '#6366f1',
                        borderRadius: '50%',
                        animation: 'pulse 1.5s infinite 0.2s'
                      }} />
                      <div style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        background: '#6366f1',
                        borderRadius: '50%',
                        animation: 'pulse 1.5s infinite 0.4s'
                      }} />
                    </div>
                    <span>Analyzing environmental data...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(99, 102, 241, 0.2)',
              background: 'rgba(10, 10, 10, 0.5)'
            }}>
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-end'
              }}>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Earth's environmental status, climate trends, or planetary health..."
                  disabled={chatMutation.isPending}
                  style={{
                    flex: 1,
                    minHeight: '3rem',
                    maxHeight: '8rem',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '1rem',
                    color: '#f8fafc',
                    fontSize: '0.95rem',
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1'
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || chatMutation.isPending}
                  style={{
                    padding: '1rem',
                    background: inputValue.trim() && !chatMutation.isPending
                      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '1rem',
                    color: inputValue.trim() && !chatMutation.isPending ? 'white' : '#94a3b8',
                    cursor: inputValue.trim() && !chatMutation.isPending ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: inputValue.trim() && !chatMutation.isPending 
                      ? '0 8px 32px rgba(99, 102, 241, 0.3)'
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (inputValue.trim() && !chatMutation.isPending) {
                      e.currentTarget.style.transform = 'scale(1.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <Send style={{ width: '1.25rem', height: '1.25rem' }} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
