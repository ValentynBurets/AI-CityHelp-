import { Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CategoryIcon from '@mui/icons-material/Category'
import AssessmentIcon from '@mui/icons-material/Assessment'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from './components/Logo'
import LanguageToggle from './components/LanguageToggle'
import ClassificationPage from './pages/ClassificationPage'
import KnowledgeBasePage from './pages/KnowledgeBasePage'
import DiagnosticsPage from './pages/DiagnosticsPage'
import { GRADIENTS, SHADOWS, TYPOGRAPHY } from './constants/theme'

function App() {
  const { t } = useTranslation()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const getTabValue = () => {
    if (location.pathname === '/kb') return 1
    if (location.pathname === '/diagnostics') return 2
    return 0
  }

  const navItems = [
    { label: t('app.classification'), path: '/', icon: <AutoAwesomeIcon /> },
    { label: t('app.knowledgeBase'), path: '/kb', icon: <CategoryIcon /> },
    { label: t('app.diagnostics'), path: '/diagnostics', icon: <AssessmentIcon /> },
  ]

  const drawerContent = (
      <Box sx={{ width: 250, pt: 2 }}>
      <Typography variant="h6" sx={{ px: 2, mb: 2, fontWeight: TYPOGRAPHY.fontWeight.bold }}>
        {t('app.title')}
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => setDrawerOpen(false)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        sx={{
          background: GRADIENTS.primary,
          boxShadow: SHADOWS.medium,
          borderRadius: 0,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: TYPOGRAPHY.fontWeight.bold,
              mr: isMobile ? 0 : 4,
            }}
          >
            {t('app.title')}
          </Typography>
          {!isMobile && (
            <Tabs
              value={getTabValue()}
              textColor="inherit"
              indicatorColor="secondary"
              sx={{ flexGrow: 1 }}
            >
              {navItems.map((item) => (
                <Tab
                  key={item.path}
                  label={item.label}
                  component={Link}
                  to={item.path}
                  value={navItems.indexOf(item)}
                  icon={item.icon}
                  iconPosition="start"
                  sx={{ minHeight: 64 }}
                />
              ))}
            </Tabs>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <LanguageToggle />
            <Logo />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: '1400px',
          mx: 'auto',
          width: '100%',
        }}
        className="fade-in"
      >
        <Routes>
          <Route path="/" element={<ClassificationPage />} />
          <Route path="/kb" element={<KnowledgeBasePage />} />
          <Route path="/diagnostics" element={<DiagnosticsPage />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App


