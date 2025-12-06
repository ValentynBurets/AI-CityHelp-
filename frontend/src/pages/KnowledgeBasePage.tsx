import { useState } from 'react'
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Card,
  CardContent,
  Fade,
  Grow,
  Stack,
  IconButton,
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  LibraryBooks as LibraryBooksIcon,
  Info as InfoIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { knowledgeBaseApi } from '../services/api'

export default function KnowledgeBasePage() {
  const queryClient = useQueryClient()
  const [loadStatus, setLoadStatus] = useState<string | null>(null)

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['knowledgeBase'],
    queryFn: () => knowledgeBaseApi.getAll(),
  })

  const loadMutation = useMutation({
    mutationFn: () => knowledgeBaseApi.load(),
    onSuccess: (data) => {
      setLoadStatus(`Successfully loaded ${data.itemsLoaded} categories`)
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] })
      setTimeout(() => setLoadStatus(null), 5000)
    },
    onError: (error) => {
      setLoadStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setTimeout(() => setLoadStatus(null), 5000)
    },
  })

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Fade in timeout={600}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            gutterBottom
            className="gradient-text"
            sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
          >
            <LibraryBooksIcon sx={{ fontSize: '2rem' }} />
            Knowledge Base
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse and manage municipal service categories
          </Typography>
        </Box>
      </Fade>

      <Grow in timeout={800}>
        <Card
          elevation={3}
          sx={{
            mb: 3,
            p: 3,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon color="primary" sx={{ fontSize: '2rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Categories
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={loadMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
              onClick={() => loadMutation.mutate()}
              disabled={loadMutation.isPending}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                },
              }}
            >
              {loadMutation.isPending ? 'Loading...' : 'Reload KB'}
            </Button>
          </Box>
        </Card>
      </Grow>

      {loadStatus && (
        <Fade in>
          <Alert
            severity={loadMutation.isSuccess ? 'success' : 'error'}
            sx={{ mb: 2 }}
            icon={loadMutation.isSuccess ? <CheckCircleIcon /> : <InfoIcon />}
          >
            {loadStatus}
          </Alert>
        </Fade>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}

      {error && (
        <Fade in>
          <Alert severity="error" icon={<InfoIcon />}>
            Error loading knowledge base: {error instanceof Error ? error.message : 'Unknown error'}
          </Alert>
        </Fade>
      )}

      {categories && categories.length === 0 && (
        <Fade in>
          <Alert severity="warning" icon={<InfoIcon />}>
            No categories found. Please load the knowledge base first.
          </Alert>
        </Fade>
      )}

      {categories && categories.length > 0 && (
        <Grow in timeout={1000}>
          <Card elevation={4}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: '12px 12px 0 0' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon />
                {categories.length} Categories Available
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {categories.map((category, index) => (
                <Fade in timeout={(index + 1) * 100} key={category.id}>
                  <Box>
                    <ListItem
                      sx={{
                        py: 3,
                        px: 3,
                        transition: 'all 0.3s',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          transform: 'translateX(8px)',
                        },
                      }}
                      className="hover-lift"
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                            >
                              {category.title}
                            </Typography>
                            <Chip
                              label={category.id}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1, lineHeight: 1.6 }}
                          >
                            {category.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < categories.length - 1 && <Divider />}
                  </Box>
                </Fade>
              ))}
            </List>
            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: '0 0 12px 12px',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total: {categories.length} categories loaded
              </Typography>
            </Box>
          </Card>
        </Grow>
      )}
    </Box>
  )
}
