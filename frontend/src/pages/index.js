// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '35rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {

  const router = useRouter()

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(3, 9, 7)} !important` }}>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box 
              component="img" 
              src="/images/logo.png"
              sx={{
                height: 150,
                width: 250,
              }}
            />
          </Box>
          <Box sx={{ mb: 8 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }} align="center">
              Corporate Pass Application System
            </Typography>
          </Box>
          <Button
            fullWidth
            size='large'
            variant='contained'
            sx={{ marginBottom: 3 }}
            onClick={() => router.push('/auth/register')}
          >
            Register
          </Button>
          <Button
            fullWidth
            size='large'
            variant='contained'
            sx={{ marginBottom: 7 }}
            onClick={() => router.push('/auth/login')}
          >
            Login
          </Button>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
