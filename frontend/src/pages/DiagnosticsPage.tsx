import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  Fade,
  Grow,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  Clear as ClearIcon,
  BugReport as BugReportIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Http as HttpIcon,
  Info as InfoIcon,
} from '@mui/icons-material'

interface DiagnosticLog {
  timestamp: string
  endpoint: string
  method: string
  request?: any
  response?: any
  duration?: number
  error?: string
}

export default function DiagnosticsPage() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState<DiagnosticLog[]>([])

  useEffect(() => {
    const originalLog = console.log
    const originalError = console.error

    console.log = (...args: any[]) => {
      originalLog(...args)
      if (args[0]?.startsWith?.('[API')) {
        const logData = args[1] as DiagnosticLog
        if (logData) {
          setLogs((prev) => [logData, ...prev].slice(0, 100))
        }
      }
    }

    console.error = (...args: any[]) => {
      originalError(...args)
      if (args[0]?.startsWith?.('[API')) {
        const logData = args[1] as DiagnosticLog
        if (logData) {
          setLogs((prev) => [logData, ...prev].slice(0, 100))
        }
      }
    }

    return () => {
      console.log = originalLog
      console.error = originalError
    }
  }, [])

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Fade in timeout={600}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            gutterBottom
            className="gradient-text"
            sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
          >
            <BugReportIcon sx={{ fontSize: '2rem' }} />
            {t('diagnostics.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('diagnostics.title')}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <HttpIcon color="primary" sx={{ fontSize: '2rem' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  API Logs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {logs.length} log entries
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearLogs}
              disabled={logs.length === 0}
              color="error"
              sx={{
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              Clear Logs
            </Button>
          </Box>
        </Card>
      </Grow>

      {logs.length === 0 ? (
        <Grow in timeout={1000}>
          <Card
            elevation={4}
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
            }}
          >
            <InfoIcon sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('diagnostics.noLogs')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('diagnostics.noLogs')}
            </Typography>
          </Card>
        </Grow>
      ) : (
        <Grow in timeout={1000}>
          <TableContainer
            component={Card}
            elevation={4}
            sx={{
              maxHeight: '70vh',
              '& .MuiTableRow-root': {
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'scale(1.01)',
                },
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                    <ScheduleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {t('diagnostics.timestamp')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                    <HttpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {t('diagnostics.method')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                    {t('diagnostics.endpoint')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                    Duration
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.main', color: 'white' }}>
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log, index) => (
                  <Fade in timeout={200} key={index}>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.method}
                          size="small"
                          color={log.method === 'GET' ? 'primary' : 'secondary'}
                          icon={<HttpIcon />}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {log.endpoint}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {log.error ? (
                          <Chip
                            label={t('diagnostics.error')}
                            color="error"
                            size="small"
                            icon={<ErrorIcon />}
                          />
                        ) : (
                          <Chip
                            label="Success"
                            color="success"
                            size="small"
                            icon={<CheckCircleIcon />}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {log.duration ? (
                          <Chip
                            label={`${log.duration}ms`}
                            size="small"
                            variant="outlined"
                            color={log.duration > 2000 ? 'error' : log.duration > 1000 ? 'warning' : 'success'}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Click to view details">
                          <Box
                            component="pre"
                            sx={{
                              fontSize: '0.75rem',
                              maxWidth: { xs: 200, sm: 300, md: 400 },
                              overflow: 'auto',
                              maxHeight: 100,
                              m: 0,
                              p: 1,
                              bgcolor: 'grey.100',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            {JSON.stringify(
                              {
                                request: log.request,
                                response: log.response,
                                error: log.error,
                              },
                              null,
                              2
                            )}
                          </Box>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grow>
      )}
    </Box>
  )
}
