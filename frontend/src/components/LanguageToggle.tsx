import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
]

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    localStorage.setItem('language', langCode)
    handleClose()
  }

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  return (
    <>
      <Tooltip title="Change Language">
        <IconButton
          onClick={handleClick}
          sx={{
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={i18n.language === lang.code}
          >
            <ListItemIcon>
              <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
            </ListItemIcon>
            <ListItemText primary={lang.name} />
            {i18n.language === lang.code && (
              <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

