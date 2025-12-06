import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Stack,
  Fade,
  Zoom,
  Grow,
  Card,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  Fab,
  Snackbar,
  IconButton,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Code as CodeIcon,
  AutoAwesome as AutoAwesomeIcon,
  Article as ArticleIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  ContactMail as ContactMailIcon,
  SmartToy as SmartToyIcon,
  Flag as FlagIcon,
  Warning as WarningIcon,
  Help as HelpIcon,
  Block as BlockIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { classificationApi } from '../services/api'
import type { ClassificationRequest } from '../types'
import ChatAgent from '../components/ChatAgent'
import {
  PASTEL_COLORS,
  GRADIENTS,
  SIZES,
  TRANSITIONS,
  SHADOWS,
  BORDER_RADIUS,
  Z_INDEX,
  ANIMATION_DELAYS,
} from '../constants/theme'

export default function ClassificationPage() {
  const { t } = useTranslation()
  
  const PRIORITY_OPTIONS = [
    { value: 'urgent', label: t('classification.urgent'), icon: <WarningIcon />, color: 'error' as const },
    { value: 'important', label: t('classification.important'), icon: <FlagIcon />, color: 'warning' as const },
    { value: 'not_important', label: t('classification.notImportant'), icon: <CheckCircleOutlineIcon />, color: 'success' as const },
    { value: 'advice', label: t('classification.needAdvice'), icon: <HelpIcon />, color: 'info' as const },
    { value: 'cannot_handle', label: t('classification.cannotHandle'), icon: <BlockIcon />, color: 'error' as const },
  ]
  const [requestText, setRequestText] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [priority, setPriority] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>('request-details')
  const [showAISuggestion, setShowAISuggestion] = useState(false)
  const [formStartTime, setFormStartTime] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const suggestionTimerRef = useRef<NodeJS.Timeout | null>(null)

  const mutation = useMutation({
    mutationFn: (data: ClassificationRequest | FormData) => classificationApi.classify(data),
  })

  useEffect(() => {
    if (showChat) return

    const handleFormInteraction = (e: Event) => {
      const target = e.target as HTMLElement
      const isFormElement = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'BUTTON' ||
        target.closest('input, textarea, button, [role="button"]') !== null

      if (isFormElement && formStartTime === null && !showChat) {
        setFormStartTime(Date.now())
      }
    }

    const events = ['input', 'change', 'focus', 'click']
    events.forEach((event) => {
      document.addEventListener(event, handleFormInteraction, true)
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleFormInteraction, true)
      })
    }
  }, [formStartTime, showChat])

  useEffect(() => {
    if (formStartTime === null || showChat || showAISuggestion) {
      return
    }

    const checkTime = () => {
      const elapsed = Date.now() - formStartTime
      const fiveMinutes = 5 * 60 * 1000 // 5 minutes in milliseconds

      if (elapsed >= fiveMinutes && !showChat && !showAISuggestion) {
        setShowAISuggestion(true)
      }
    }

    suggestionTimerRef.current = setInterval(checkTime, 30000)

    return () => {
      if (suggestionTimerRef.current) {
        clearInterval(suggestionTimerRef.current)
      }
    }
  }, [formStartTime, showChat, showAISuggestion])

  useEffect(() => {
    if (mutation.isSuccess || showChat) {
      setFormStartTime(null)
      setShowAISuggestion(false)
      if (suggestionTimerRef.current) {
        clearInterval(suggestionTimerRef.current)
        suggestionTimerRef.current = null
      }
    }
  }, [mutation.isSuccess, showChat])

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    const validFiles: File[] = []
    const invalidFiles: string[] = []

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} is not an image file`)
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        invalidFiles.push(`${file.name} is larger than 10MB`)
        return
      }
      validFiles.push(file)
    })

    if (invalidFiles.length > 0) {
      alert(invalidFiles.join('\n'))
    }

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles]
      setSelectedFiles(newFiles)
      setImageUrl(null)
      
      validFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFormDataExtracted = (data: {
    requestText?: string
    contactName?: string
    contactPhone?: string
    contactEmail?: string
    priority?: string
  }) => {
    if (data.requestText) {
      setRequestText(data.requestText)
      setExpandedAccordion('request-details')
    }
    if (data.contactName || data.contactPhone || data.contactEmail) {
      if (data.contactName) setContactName(data.contactName)
      if (data.contactPhone) setContactPhone(data.contactPhone)
      if (data.contactEmail) setContactEmail(data.contactEmail)
      setExpandedAccordion('contact-info')
    }
    if (data.priority) {
      setPriority(data.priority)
      setExpandedAccordion('priority')
    }
  }

  const handleClassify = () => {
    if (!requestText.trim()) {
      setExpandedAccordion('request-details')
      return
    }
    
    if (selectedFiles.length > 0) {
      const formData = new FormData()
      formData.append('requestText', requestText.trim())
      selectedFiles.forEach((file, index) => {
        formData.append(`imageFile${index}`, file)
      })
      if (contactName) formData.append('contactName', contactName.trim())
      if (contactPhone) formData.append('contactPhone', contactPhone.trim())
      if (contactEmail) formData.append('contactEmail', contactEmail.trim())
      if (priority) formData.append('priority', priority)
      mutation.mutate(formData)
    } else {
      mutation.mutate({
        requestText: requestText.trim(),
        imageUrl,
        contactName: contactName.trim() || null,
        contactPhone: contactPhone.trim() || null,
        contactEmail: contactEmail.trim() || null,
        priority: priority || null,
      })
    }
  }

  const isFormValid = requestText.trim().length > 0

  return (
    <Box sx={{ maxWidth: SIZES.container.maxWidth, mx: 'auto', position: 'relative', pb: 10 }}>
      {showChat && (
        <ChatAgent
          onFormDataExtracted={handleFormDataExtracted}
          onClose={() => setShowChat(false)}
        />
      )}
      {!showChat && (
        <Fab
          color="primary"
          aria-label="chat with AI"
          onClick={() => {
            setShowChat(true)
            setShowAISuggestion(false)
            setFormStartTime(null)
          }}
          sx={{
            position: 'fixed',
            bottom: SIZES.spacing.fabBottom,
            right: SIZES.spacing.fabRight,
            zIndex: Z_INDEX.fab,
            background: GRADIENTS.primary,
            boxShadow: SHADOWS.large,
            '&:hover': {
              background: GRADIENTS.primaryHover,
              transform: 'scale(1.1) rotate(5deg)',
              boxShadow: SHADOWS.xlarge,
            },
            transition: TRANSITIONS.standard,
          }}
          className="float"
        >
          <SmartToyIcon />
        </Fab>
      )}

      {/* AI Assistant Suggestion Snackbar */}
      <Snackbar
        open={showAISuggestion}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={10000}
        onClose={() => setShowAISuggestion(false)}
        sx={{
          bottom: { xs: 90, sm: 100 },
          zIndex: Z_INDEX.fab + 1,
        }}
      >
        <Alert
          severity="info"
          onClose={() => setShowAISuggestion(false)}
          action={
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setShowChat(true)
                  setShowAISuggestion(false)
                  setFormStartTime(null)
                }}
                sx={{ textTransform: 'none' }}
              >
                {t('chat.suggestion.tryAssistant')}
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setShowAISuggestion(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          }
          sx={{
            width: '100%',
            maxWidth: { xs: '90%', sm: '500px' },
            bgcolor: 'background.paper',
            boxShadow: SHADOWS.large,
            '& .MuiAlert-icon': {
              color: 'primary.main',
            },
          }}
        >
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              <SmartToyIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
              {t('chat.suggestion.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('chat.suggestion.message')}
            </Typography>
          </Box>
        </Alert>
      </Snackbar>

      <Fade in timeout={TRANSITIONS.duration.slower}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            gutterBottom
            className="gradient-text"
            sx={{ fontWeight: 700, mb: 1 }}
          >
            <AutoAwesomeIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '2rem' }} />
            {t('classification.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('classification.subtitle')}
          </Typography>
        </Box>
      </Fade>

      <Grow in timeout={TRANSITIONS.duration.slowest}>
        <Card
          elevation={6}
          sx={{
            mb: 3,
            overflow: 'hidden',
            background: GRADIENTS.card,
            backdropFilter: 'blur(20px)',
            borderRadius: BORDER_RADIUS.small,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={0}>
            {/* Request Details Accordion */}
            <Accordion
              expanded={expandedAccordion === 'request-details'}
              onChange={handleAccordionChange('request-details')}
              sx={{
                '&:before': { display: 'none' },
                boxShadow: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                transition: 'background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                '&.Mui-expanded': {
                  bgcolor: 'rgba(147, 197, 253, 0.08)',
                  transition: 'background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Box
                    sx={{
                      bgcolor: PASTEL_COLORS.blue.expandIcon.background,
                      color: PASTEL_COLORS.blue.expandIcon.icon,
                      borderRadius: BORDER_RADIUS.round,
                      width: SIZES.container.expandIcon,
                      height: SIZES.container.expandIcon,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: `${TRANSITIONS.transform}, background-color ${TRANSITIONS.duration.normal}ms`,
                      transform: expandedAccordion === 'request-details' ? 'rotate(180deg)' : 'rotate(0deg)',
                      willChange: 'transform',
                      '&:hover': {
                        bgcolor: PASTEL_COLORS.blue.expandIcon.backgroundHover,
                      },
                    }}
                  >
                    <ExpandMoreIcon />
                  </Box>
                }
                sx={{
                  px: SIZES.spacing.accordionPadding,
                  py: 2,
                  transition: `background-color ${TRANSITIONS.duration.normal}ms ${TRANSITIONS.easing.smooth}`,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                  <Box
                    sx={{
                      bgcolor: PASTEL_COLORS.blue.background,
                      color: PASTEL_COLORS.blue.icon,
                      borderRadius: BORDER_RADIUS.small,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: SIZES.container.iconBox,
                      height: SIZES.container.iconBox,
                    }}
                  >
                    <ArticleIcon sx={{ fontSize: SIZES.icon.medium }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('classification.requestDetails')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('classification.requestDetailsDesc')}
                    </Typography>
                  </Box>
                  {requestText.trim() && (
                    <Chip
                      label={t('common.success')}
                      color="success"
                      size="small"
                      icon={<CheckCircleIcon />}
                      sx={{ ml: 'auto' }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: 3,
                  pb: 3,
                  '& .MuiAccordionDetails-root': {
                    transition: 'padding 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  },
                }}
              >
                <Fade
                  in={expandedAccordion === 'request-details'}
                  timeout={TRANSITIONS.duration.slow}
                  style={{
                    transitionDelay: expandedAccordion === 'request-details' ? `${ANIMATION_DELAYS.fadeIn}ms` : '0ms',
                  }}
                >
                  <Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      label={t('classification.requestDetails')}
                      placeholder={t('classification.requestTextPlaceholder')}
                      value={requestText}
                      onChange={(e) => setRequestText(e.target.value)}
                      variant="outlined"
                      required
                      error={!isFormValid && requestText.length === 0}
                      helperText={!isFormValid && requestText.length === 0 ? 'This field is required' : ''}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: TRANSITIONS.smooth,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: SHADOWS.input.primary,
                          },
                        },
                      }}
                    />
                  </Box>
                </Fade>
              </AccordionDetails>
            </Accordion>

            {/* Contact Information Accordion */}
            <Accordion
              expanded={expandedAccordion === 'contact-info'}
              onChange={handleAccordionChange('contact-info')}
              sx={{
                '&:before': { display: 'none' },
                boxShadow: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                transition: TRANSITIONS.background,
                '&.Mui-expanded': {
                  bgcolor: PASTEL_COLORS.pink.backgroundExpanded,
                  transition: TRANSITIONS.background,
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Box
                    sx={{
                      bgcolor: PASTEL_COLORS.pink.expandIcon.background,
                      color: PASTEL_COLORS.pink.expandIcon.icon,
                      borderRadius: BORDER_RADIUS.round,
                      width: SIZES.container.expandIcon,
                      height: SIZES.container.expandIcon,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: `${TRANSITIONS.transform}, background-color ${TRANSITIONS.duration.normal}ms`,
                      transform: expandedAccordion === 'contact-info' ? 'rotate(180deg)' : 'rotate(0deg)',
                      willChange: 'transform',
                      '&:hover': {
                        bgcolor: PASTEL_COLORS.pink.expandIcon.backgroundHover,
                      },
                    }}
                  >
                    <ExpandMoreIcon />
                  </Box>
                }
                sx={{
                  px: SIZES.spacing.accordionPadding,
                  py: 2,
                  transition: `background-color ${TRANSITIONS.duration.normal}ms ${TRANSITIONS.easing.smooth}`,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                  <Box
                    sx={{
                      bgcolor: PASTEL_COLORS.pink.background,
                      color: PASTEL_COLORS.pink.icon,
                      borderRadius: BORDER_RADIUS.small,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: SIZES.container.iconBox,
                      height: SIZES.container.iconBox,
                    }}
                  >
                    <ContactMailIcon sx={{ fontSize: SIZES.icon.medium }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('classification.contactInfo')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('classification.contactInfoDesc')}
                    </Typography>
                  </Box>
                  {(contactName || contactPhone || contactEmail) && (
                    <Chip
                      label={t('common.success')}
                      color="success"
                      size="small"
                      icon={<CheckCircleIcon />}
                      sx={{ ml: 'auto' }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: 3,
                  pb: 3,
                }}
              >
                <Fade
                  in={expandedAccordion === 'contact-info'}
                  timeout={TRANSITIONS.duration.slow}
                  style={{
                    transitionDelay: expandedAccordion === 'contact-info' ? `${ANIMATION_DELAYS.fadeIn}ms` : '0ms',
                  }}
                >
                  <Box>
                    <Stack spacing={2} sx={{ maxWidth: 500 }}>
                    <TextField
                      label={t('classification.name')}
                      placeholder={t('classification.namePlaceholder')}
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: SHADOWS.input.secondary,
                        },
                        },
                      }}
                    />
                    <TextField
                      label={t('classification.phone')}
                      placeholder={t('classification.phonePlaceholder')}
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      type="tel"
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: SHADOWS.input.secondary,
                        },
                        },
                      }}
                    />
                    <TextField
                      label={t('classification.email')}
                      placeholder={t('classification.emailPlaceholder')}
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      type="email"
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: SHADOWS.input.secondary,
                        },
                        },
                      }}
                    />
                    </Stack>
                  </Box>
                </Fade>
              </AccordionDetails>
            </Accordion>

            {/* Priority Level Accordion */}
            <Accordion
              expanded={expandedAccordion === 'priority'}
              onChange={handleAccordionChange('priority')}
              sx={{
                '&:before': { display: 'none' },
                boxShadow: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                transition: TRANSITIONS.background,
                '&.Mui-expanded': {
                  bgcolor: PASTEL_COLORS.yellow.backgroundExpanded,
                  transition: TRANSITIONS.background,
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Box
                    sx={{
                      bgcolor: PASTEL_COLORS.yellow.expandIcon.background,
                      color: PASTEL_COLORS.yellow.expandIcon.icon,
                      borderRadius: BORDER_RADIUS.round,
                      width: SIZES.container.expandIcon,
                      height: SIZES.container.expandIcon,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: `${TRANSITIONS.transform}, background-color ${TRANSITIONS.duration.normal}ms`,
                      transform: expandedAccordion === 'priority' ? 'rotate(180deg)' : 'rotate(0deg)',
                      willChange: 'transform',
                      '&:hover': {
                        bgcolor: PASTEL_COLORS.yellow.expandIcon.backgroundHover,
                      },
                    }}
                  >
                    <ExpandMoreIcon />
                  </Box>
                }
                sx={{
                  px: SIZES.spacing.accordionPadding,
                  py: 2,
                  transition: `background-color ${TRANSITIONS.duration.normal}ms ${TRANSITIONS.easing.smooth}`,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                  <Box
                    sx={{
                      bgcolor: PASTEL_COLORS.yellow.background,
                      color: PASTEL_COLORS.yellow.icon,
                      borderRadius: BORDER_RADIUS.small,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: SIZES.container.iconBox,
                      height: SIZES.container.iconBox,
                    }}
                  >
                    <FlagIcon sx={{ fontSize: SIZES.icon.medium }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('classification.priority')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('classification.priorityDesc')}
                    </Typography>
                  </Box>
                  {priority && (
                    <Chip
                      label={PRIORITY_OPTIONS.find((p) => p.value === priority)?.label || priority}
                      color={PRIORITY_OPTIONS.find((p) => p.value === priority)?.color || 'default'}
                      size="small"
                      sx={{ ml: 'auto' }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: 3,
                  pb: 3,
                }}
              >
                <Fade
                  in={expandedAccordion === 'priority'}
                  timeout={TRANSITIONS.duration.slow}
                  style={{
                    transitionDelay: expandedAccordion === 'priority' ? `${ANIMATION_DELAYS.fadeIn}ms` : '0ms',
                  }}
                >
                  <Box>
                    <ToggleButtonGroup
                    value={priority}
                    exclusive
                    onChange={(_, value) => setPriority(value)}
                    aria-label="priority level"
                    fullWidth
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      '& .MuiToggleButton-root': {
                        flex: '1 1 0%',
                        minWidth: 0,
                        py: 1.5,
                        px: 2,
                        border: '2px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.02)',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                        },
                        '&.Mui-selected': {
                          borderWidth: 2,
                          transform: 'scale(1.05)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                        },
                      },
                    }}
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <ToggleButton
                        key={option.value}
                        value={option.value}
                        aria-label={option.label}
                        sx={{
                          '&.Mui-selected': {
                            bgcolor: `${option.color}.main`,
                            color: 'white',
                            '&:hover': {
                              bgcolor: `${option.color}.dark`,
                            },
                          },
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          {option.icon}
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {option.label}
                          </Typography>
                        </Stack>
                      </ToggleButton>
                    ))}
                    </ToggleButtonGroup>
                  </Box>
                </Fade>
              </AccordionDetails>
            </Accordion>

            {/* Image Upload Accordion */}
            <Accordion
              expanded={expandedAccordion === 'image'}
              onChange={handleAccordionChange('image')}
              sx={{
                '&:before': { display: 'none' },
                boxShadow: 'none',
                transition: TRANSITIONS.background,
                '&.Mui-expanded': {
                  bgcolor: PASTEL_COLORS.green.backgroundExpanded,
                  transition: TRANSITIONS.background,
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Box
                    sx={{
                      bgcolor: PASTEL_COLORS.green.expandIcon.background,
                      color: PASTEL_COLORS.green.expandIcon.icon,
                      borderRadius: BORDER_RADIUS.round,
                      width: SIZES.container.expandIcon,
                      height: SIZES.container.expandIcon,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: `${TRANSITIONS.transform}, background-color ${TRANSITIONS.duration.normal}ms`,
                      transform: expandedAccordion === 'image' ? 'rotate(180deg)' : 'rotate(0deg)',
                      willChange: 'transform',
                      '&:hover': {
                        bgcolor: PASTEL_COLORS.green.expandIcon.backgroundHover,
                      },
                    }}
                  >
                    <ExpandMoreIcon />
                  </Box>
                }
                sx={{
                  px: SIZES.spacing.accordionPadding,
                  py: 2,
                  transition: `background-color ${TRANSITIONS.duration.normal}ms ${TRANSITIONS.easing.smooth}`,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                  <Box
                    sx={{
                      bgcolor: PASTEL_COLORS.green.background,
                      color: PASTEL_COLORS.green.icon,
                      borderRadius: BORDER_RADIUS.small,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: SIZES.container.iconBox,
                      height: SIZES.container.iconBox,
                    }}
                  >
                    <AddPhotoAlternateIcon sx={{ fontSize: SIZES.icon.medium }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('classification.imageUpload')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('classification.imageUploadDesc')}
                    </Typography>
                  </Box>
                  {(selectedFiles.length > 0 || imageUrl) && (
                    <Chip
                      label={selectedFiles.length > 0 ? `${selectedFiles.length} ${selectedFiles.length > 1 ? t('classification.images') : t('classification.image')}` : t('classification.added')}
                      color="success"
                      size="small"
                      icon={<CheckCircleIcon />}
                      sx={{ ml: 'auto' }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: 3,
                  pb: 3,
                }}
              >
                <Fade
                  in={expandedAccordion === 'image'}
                  timeout={TRANSITIONS.duration.slow}
                  style={{
                    transitionDelay: expandedAccordion === 'image' ? `${ANIMATION_DELAYS.fadeIn}ms` : '0ms',
                  }}
                >
                  <Box>
                    <Stack spacing={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CloudUploadIcon color="primary" />
                        {t('classification.uploadFromPC')}
                      </Typography>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        id="image-upload-input"
                      />
                      <label htmlFor="image-upload-input">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                          sx={{
                            mb: 2,
                            borderWidth: 2,
                            py: 1.5,
                            px: 3,
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            '&:hover': {
                              borderWidth: 2,
                              transform: 'translateY(-2px) scale(1.02)',
                              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
                            },
                          }}
                        >
                          {t('classification.chooseFiles')}
                        </Button>
                      </label>
                      {selectedFiles.length > 0 && (
                        <Fade in>
                          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                  xs: 'repeat(1, 1fr)',
                                  sm: 'repeat(2, 1fr)',
                                  md: 'repeat(3, 1fr)',
                                  lg: 'repeat(4, 1fr)',
                                },
                                gap: 2,
                                mt: 2,
                                width: '100%',
                              }}
                            >
                              {imagePreviews.map((preview, index) => (
                                <Zoom in key={index} style={{ transitionDelay: `${index * 50}ms` }}>
                                  <Box
                                    sx={{
                                      position: 'relative',
                                      borderRadius: 2,
                                      overflow: 'hidden',
                                      border: '2px solid',
                                      borderColor: 'primary.main',
                                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                                      transition: 'all 0.3s',
                                      '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                                      },
                                    }}
                                  >
                                    <img
                                      src={preview}
                                      alt={`Preview ${index + 1}`}
                                      style={{
                                        width: '100%',
                                        height: '200px',
                                        display: 'block',
                                        objectFit: 'cover',
                                      }}
                                    />
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                                        borderRadius: '50%',
                                        width: 32,
                                        height: 32,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                          bgcolor: 'rgba(211, 47, 47, 0.8)',
                                          transform: 'scale(1.1)',
                                        },
                                      }}
                                      onClick={() => handleRemoveFile(index)}
                                    >
                                      <Typography
                                        sx={{
                                          color: 'white',
                                          fontSize: '1.2rem',
                                          fontWeight: 'bold',
                                          lineHeight: 1,
                                        }}
                                      >
                                        ×
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        p: 0.5,
                                        fontSize: '0.75rem',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {selectedFiles[index]?.name}
                                    </Box>
                                  </Box>
                                </Zoom>
                              ))}
                            </Box>
                          </Box>
                        </Fade>
                      )}
                    </Box>

                    <Divider>
                      <Chip label={t('common.or')} size="small" />
                    </Divider>

                    <Box>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ImageIcon color="primary" />
                        {t('classification.useImageUrl')}
                      </Typography>
                      <TextField
                        fullWidth
                        label={t('classification.useImageUrl')}
                        placeholder={t('classification.imageUrlPlaceholder')}
                        value={imageUrl || ''}
                        onChange={(e) => {
                          setImageUrl(e.target.value || null)
                          if (e.target.value) {
                            setSelectedFiles([])
                            setImagePreviews([])
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ''
                            }
                          }
                        }}
                        InputProps={{
                          startAdornment: <ImageIcon sx={{ mr: 1, color: 'action.active' }} />,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
                            },
                          },
                        }}
                      />
                    </Box>
                    </Stack>
                  </Box>
                </Fade>
              </AccordionDetails>
            </Accordion>
          </Stack>

          {/* Submit Button */}
          <Box
            sx={{
              p: 3,
              bgcolor: 'grey.50',
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Button
              variant="contained"
              onClick={handleClassify}
              disabled={!isFormValid || mutation.isPending}
              size="large"
              fullWidth
              startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                background: isFormValid
                  ? 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
                  : 'grey.300',
                boxShadow: isFormValid
                  ? '0 8px 24px rgba(99, 102, 241, 0.4)'
                  : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: isFormValid
                    ? 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)'
                    : 'grey.300',
                  transform: isFormValid ? 'translateY(-4px) scale(1.02)' : 'none',
                  boxShadow: isFormValid
                    ? '0 12px 32px rgba(99, 102, 241, 0.5)'
                    : 'none',
                },
                '&:disabled': {
                  background: 'grey.300',
                  color: 'grey.500',
                },
              }}
            >
              {mutation.isPending ? 'Classifying...' : 'Classify Request'}
            </Button>
            {mutation.isPending && (
              <LinearProgress
                sx={{
                  mt: 2,
                  borderRadius: 1,
                  height: 6,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 1,
                    background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)',
                  },
                }}
              />
            )}
          </Box>
        </Card>
      </Grow>

      {mutation.isError && (
        <Fade in>
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            icon={<InfoIcon />}
          >
            Error: {mutation.error instanceof Error ? mutation.error.message : 'Unknown error'}
          </Alert>
        </Fade>
      )}

      {mutation.isSuccess && mutation.data && (
        <Zoom in timeout={TRANSITIONS.duration.slower}>
          <Card
            elevation={8}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              background: GRADIENTS.resultCard,
              borderRadius: 4,
              border: '2px solid',
              borderColor: 'primary.main',
            }}
            className="hover-lift"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: '2.5rem' }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Classification Result
              </Typography>
            </Box>

            <Stack spacing={3}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  background: GRADIENTS.resultCard,
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Category
                </Typography>
                <Chip
                  label={mutation.data.category}
                  color="primary"
                  sx={{
                    fontSize: '1.2rem',
                    py: 2.5,
                    px: 2,
                    height: 'auto',
                    fontWeight: 700,
                  }}
                  icon={<CheckCircleIcon />}
                />
              </Card>

              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  background: GRADIENTS.resultCard,
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Confidence Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={mutation.data.confidence * 100}
                    sx={{
                      flexGrow: 1,
                      height: 12,
                      borderRadius: 6,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                        background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)',
                      },
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 700, minWidth: 70 }}>
                    {(mutation.data.confidence * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Card>

              <Accordion sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                    <InfoIcon />
                    Retrieved Context ({mutation.data.contextUsed.length} items)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1}>
                    {mutation.data.contextUsed.map((context, index) => (
                      <Fade in timeout={(index + 1) * 100} key={index}>
                        <Chip
                          label={context}
                          variant="outlined"
                          sx={{
                            justifyContent: 'flex-start',
                            py: 2,
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'translateX(8px)',
                              bgcolor: 'action.hover',
                            },
                          }}
                        />
                      </Fade>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                    <CodeIcon />
                    Raw Model Response
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    component="pre"
                    sx={{
                      p: 2,
                      bgcolor: 'grey.100',
                      borderRadius: 2,
                      overflow: 'auto',
                      fontSize: '0.875rem',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {mutation.data.rawModelResponse}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Card>
        </Zoom>
      )}
    </Box>
  )
}
