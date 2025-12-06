import { useState, useRef } from 'react'
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

const PRIORITY_OPTIONS = [
  { value: 'urgent', label: 'Urgent', icon: <WarningIcon />, color: 'error' as const },
  { value: 'important', label: 'Important', icon: <FlagIcon />, color: 'warning' as const },
  { value: 'not_important', label: 'Not Important', icon: <CheckCircleOutlineIcon />, color: 'success' as const },
  { value: 'advice', label: 'Need Advice', icon: <HelpIcon />, color: 'info' as const },
  { value: 'cannot_handle', label: "Can't Handle", icon: <BlockIcon />, color: 'error' as const },
]

export default function ClassificationPage() {
  const [requestText, setRequestText] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [priority, setPriority] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>('request-details')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: (data: ClassificationRequest | FormData) => classificationApi.classify(data),
  })

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
      setImageUrl(null)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
    
    if (selectedFile) {
      const formData = new FormData()
      formData.append('requestText', requestText.trim())
      formData.append('imageFile', selectedFile)
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
          onClick={() => setShowChat(true)}
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

      <Fade in timeout={TRANSITIONS.duration.slower}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            gutterBottom
            className="gradient-text"
            sx={{ fontWeight: 700, mb: 1 }}
          >
            <AutoAwesomeIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '2rem' }} />
            Classify Citizen Request
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fill out the form below or chat with our AI assistant to prepare your request
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
                      Request Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Describe the issue or problem you're experiencing
                    </Typography>
                  </Box>
                  {requestText.trim() && (
                    <Chip
                      label="Filled"
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
                      label="Request Text"
                      placeholder="Enter the citizen's request (e.g., 'Пошкоджений люк біля будинку')"
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
                      Contact Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      How we can reach you after resolving your request
                    </Typography>
                  </Box>
                  {(contactName || contactPhone || contactEmail) && (
                    <Chip
                      label="Filled"
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
                    <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      placeholder="John Doe"
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
                      fullWidth
                      label="Phone Number"
                      placeholder="+380 12 345 6789"
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
                      fullWidth
                      label="Email Address"
                      placeholder="john.doe@example.com"
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
                      Priority Level
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      How urgent is this request?
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
                      flexWrap: 'wrap',
                      gap: 1.5,
                      '& .MuiToggleButton-root': {
                        flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 auto' },
                        minWidth: { xs: '100%', sm: 'auto' },
                        py: 2,
                        px: 3,
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
                      Image Upload (Optional)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add a photo to help us understand the issue better
                    </Typography>
                  </Box>
                  {(selectedFile || imageUrl) && (
                    <Chip
                      label="Added"
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
                    <Box>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CloudUploadIcon color="primary" />
                        Upload from PC
                      </Typography>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
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
                          Choose File
                        </Button>
                      </label>
                      {selectedFile && (
                        <Fade in>
                          <Box sx={{ mt: 2 }}>
                            <Chip
                              label={selectedFile.name}
                              onDelete={handleRemoveFile}
                              color="primary"
                              variant="outlined"
                              sx={{ mb: 2 }}
                            />
                            {imagePreview && (
                              <Zoom in>
                                <Box
                                  sx={{
                                    mt: 2,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    border: '3px solid',
                                    borderColor: 'primary.main',
                                    display: 'inline-block',
                                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                                  }}
                                >
                                  <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: '300px',
                                      display: 'block',
                                    }}
                                  />
                                </Box>
                              </Zoom>
                            )}
                          </Box>
                        </Fade>
                      )}
                    </Box>

                    <Divider>
                      <Chip label="OR" size="small" />
                    </Divider>

                    <Box>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ImageIcon color="primary" />
                        Use Image URL
                      </Typography>
                      <TextField
                        fullWidth
                        label="Image URL"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl || ''}
                        onChange={(e) => {
                          setImageUrl(e.target.value || null)
                          if (e.target.value) {
                            setSelectedFile(null)
                            setImagePreview(null)
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
