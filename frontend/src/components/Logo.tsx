import { Box } from '@mui/material'
import { LocationCity, SupportAgent } from '@mui/icons-material'

export default function Logo() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LocationCity
          sx={{
            fontSize: '2rem',
            color: 'white',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          }}
        />
        <SupportAgent
          sx={{
            fontSize: '1.2rem',
            color: 'white',
            position: 'absolute',
            bottom: -4,
            right: -4,
            bgcolor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            p: 0.5,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          }}
        />
      </Box>
      <Box
        sx={{
          display: { xs: 'none', sm: 'block' },
          color: 'white',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: '0.5px',
        }}
      >
        CityHelp
      </Box>
    </Box>
  )
}

