// ** React Imports
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadData from '../../../services/loadData'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

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

const LoginPage = () => {

  const url = process.env.REACT_BACKEND_URL || "http://localhost:8080/"
  const [values, setValues] = useState({ password: '', showPassword: false })
  const [ openErrorPopup, setOpenErrorPopup ] = useState(false)
  const [ verifying, setVerifying ] = useState(false)

  const router = useRouter()

  const data = sessionStorage.getItem("data");
  if (data != null) {
    router.push('/staff/myLoans')
  }

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handleClosePopup = () => {
    setOpenErrorPopup(false)
  }

  const handleLogin = async () => {
    setVerifying(true)
    const email = document.getElementById("email").value.trim()
    try {
      let res = await axios.post(`${url}auth/login`, {email: email, password: values.password})
      if (res.status == 200) {
        const data = JSON.stringify({
          jwt: res.data.data.jwt,
          role: res.data.data.role,
          email: email
        })
        sessionStorage.setItem("data", data)
        router.push('/staff/myLoans')
      }
    } catch (e) {
      setVerifying(false)
      setOpenErrorPopup(true)
    }
  }

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
            <Typography variant='body2' align="center">Please log in</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField autoFocus fullWidth id='email' label='Email' sx={{ marginBottom: 4 }} />
            <FormControl fullWidth sx={{ marginBottom: 4 }}>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={handleLogin}
            >
              { verifying ? "Verifying..." : "Login" }
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/auth/register'>
                  <LinkStyled>Create an account</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
      <Dialog
        open={openErrorPopup}
        onClose={handleClosePopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Unable to verify"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please check that the email and password have been correctly keyed in.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} autoFocus>
            Got It
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
