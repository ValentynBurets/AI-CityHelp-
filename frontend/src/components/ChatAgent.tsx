import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Chip,
  Fade,
  Grow,
} from '@mui/material'
import {
  Send as SendIcon,
  SmartToy as SmartToyIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatAgentProps {
  onFormDataExtracted: (data: {
    requestText?: string
    contactName?: string
    contactPhone?: string
    contactEmail?: string
    priority?: string
  }) => void
  onClose: () => void
}

export default function ChatAgent({ onFormDataExtracted, onClose }: ChatAgentProps) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you prepare your municipal service request. Please describe the issue you\'re experiencing, and I\'ll help you fill out the form.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Extract form data if provided
      if (data.extractedData) {
        onFormDataExtracted(data.extractedData)
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Grow in timeout={400}>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: { xs: 'calc(100% - 40px)', sm: 400, md: 500 },
          height: { xs: 'calc(100% - 40px)', sm: 600 },
          maxHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1300,
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
        }}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToyIcon />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t('chat.title')}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          ref={chatContainerRef}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            bgcolor: 'grey.50',
          }}
        >
          {messages.map((message, index) => (
            <Fade in key={index} timeout={300}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {message.role === 'assistant' && (
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                )}
                <Paper
                  elevation={2}
                  sx={{
                    p: 1.5,
                    maxWidth: '75%',
                    bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                </Paper>
                {message.role === 'user' && (
                  <Avatar
                    sx={{
                      bgcolor: 'secondary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
              </Box>
            </Fade>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 32,
                  height: 32,
                }}
              >
                <SmartToyIcon fontSize="small" />
              </Avatar>
              <Paper
                elevation={2}
                sx={{
                  p: 1.5,
                  bgcolor: 'white',
                  borderRadius: 2,
                }}
              >
                <CircularProgress size={16} />
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'white',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={t('chat.placeholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              multiline
              maxRows={3}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&:disabled': {
                  bgcolor: 'grey.300',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Grow>
  )
}

