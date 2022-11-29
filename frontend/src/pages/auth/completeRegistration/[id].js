// ** React Imports
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

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
import { FormHelperText } from '@mui/material';

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import axios from 'axios'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '35rem' }
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13)
  }
}))

function ErrorPage(props) {
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1'>404</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            Invalid Registration Link!
          </Typography>
          <Typography variant='body2'>The link that you have accessed is invalid. Please return to the registration page to get a new link.</Typography>
        </BoxWrapper>
        <Img height='487' alt='error-illustration' src='/images/pages/401.png' />
        <Link passHref href='/auth/register'>
          <Button component='a' variant='contained' sx={{ px: 5.5 }}>
            Back to Registration
          </Button>
        </Link>
      </Box>
      <FooterIllustrations />
    </Box>
  )
}

const LoginPage = () => {
  const url = process.env.REACT_BACKEND_URL || "http://localhost:8080/"

  // Page rendering variables
  const [ firstLoad, setFirstLoad ] = useState(true)
  const [ loading, setLoading ] = useState(true)
  const [ validInvite, setValidInvite ] = useState(true)
  const [ email, setEmail ] = useState("")
  const [ values, setValues ] = useState({ password: '', showPassword: false })
  const [ creating, setCreateStatus ] = useState(false)
  const [ openPopup, setOpenPopup ] = useState(false)

  // Form validation variables
  const [ nameError, setNameError ] = useState(false)
  const [ usernameError, setUsernameError ] = useState(false)
  const [ contactError, setContactError ] = useState(false)
  const [ pwError, setPwError ] = useState(false)

  // Registration notification
  const [ openErrorPopup, setOpenErrorPopup ] = useState(false)

  // Hook
  const router = useRouter()
  const { id } = router.query
  
  // Ensure that check is completed before rendering page
  const checkInvite = async () => {
    try {
      let res = await axios.get(`${url}auth/retrieveEmail/${id}`)
      setEmail(res.data.data)
    } catch (e) {
      setValidInvite(false)
      
    } finally {
      setLoading(false)
    }
  }
  
  if (router.isReady && firstLoad) {
    setFirstLoad(false)
    checkInvite()
  }

  // Enable hidden password
  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  // Validate inputs when submit button is clicked
  const validateInputs = e => {
    const nameReady = false
    const contactReady = false
    const passwordReady = false
    const name = document.getElementById("name").value.trim()
    const contact = document.getElementById("contact").value.trim()
    if (name.length < 6) { nameReady = false; setNameError(true); } else { nameReady = true; setNameError(false); }
    if (contact.length != 8) { contactReady = false; setContactError(true); } else { contactReady = true; setContactError(false); }
    if (values.password.length < 6) { passwordReady = false; setPwError(true); } else { passwordReady = true; setPwError(false); }
    if (nameReady && contactReady && passwordReady) { setCreateStatus(true); createUser(name, contact) } 
  }

  // Axios call to create user and check status once inputs are validated
  const createUser = async (name, contact) => {
    try {
      let res = await axios.post(`${url}auth/signup`,
        {
          email: email.trim(),
          name: name,
          userName: email.trim().split("@")[0],
          phoneNo: contact,
          passwordEnc: values.password
        }
      )
      setCreateStatus(false)
      if (res.status == 200) { 
        setOpenPopup(true)
      } else {
        setOpenErrorPopup(true)
        setErrorMessage("Username or Email already exists, please try a different input.")
      }
    } catch (e) {
      
    }
  } 
  
  // Final close of popup and redirect to login page
  const handleClosePopup = () => {
    setOpenPopup(false)
    router.push('/auth/login')
  }

  const handleCloseErrorPopup = () => {
    setOpenErrorPopup(false)
  }

  if (!loading && validInvite) {
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
              <Typography variant='body2' align="center">Complete your registration</Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
              <TextField autoFocus fullWidth id='email' label="Email" sx={{ marginBottom: 4 }} disabled={true} defaultValue={email}/>
              <TextField autoFocus fullWidth id='name' label='Full Name' sx={{ marginBottom: 4 }} error={ nameError ? true : false} helperText={ nameError ? "Minimum 6 characters" : "" }/>
              <TextField fullWidth id='contact' label='Contact Number' sx={{ marginBottom: 4 }} error={ contactError ? true : false} helperText={ contactError ? "Input valid contact" : "" }/>
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
                  error={!!pwError} 
                />
                {!!pwError && (
                  <FormHelperText error id="username-error">
                    Minimum 6 characters
                  </FormHelperText>
                )}
              </FormControl>
              <Button
                fullWidth
                size='large'
                variant='contained'
                sx={{ marginBottom: 7 }}
                onClick={ creating ? null : validateInputs}
              >
                { creating ? "Creating..." : "Register" }
              </Button>
            </form>
          </CardContent>
        </Card>
        <FooterIllustrationsV1 />
        <Dialog
              open={openPopup}
              onClose={handleClosePopup}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Successfully Created"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Thank you for creating an account! You will be redirected to the login page.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePopup} autoFocus>
                  Got It
                </Button>
              </DialogActions>
            </Dialog>
          <Dialog
            open={openErrorPopup}
            onClose={handleCloseErrorPopup}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Please try again"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Username or Email already exists, please try a different input.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseErrorPopup} autoFocus>
                Got It
              </Button>
            </DialogActions>
          </Dialog>
      </Box>
    )
  } else if (!loading) {
    return <ErrorPage />
  }
  return(<Box className='content-center'></Box>)
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
