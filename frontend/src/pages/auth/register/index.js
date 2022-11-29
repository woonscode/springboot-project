// ** Next Imports
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

// Dialog components
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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

const RegisterPage = () => {
  const router = useRouter()
  
  const [open, setOpen] = useState(false)
  const [openError, setOpenError] = useState(false)
  const [email,setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const url = process.env.REACT_BACKEND_URL || "http://localhost:8080/"

  useEffect(() => {
    // Define async function to query chcekemail
    const checkEmail = async () => {
      try{
        let res = await axios.post(`${url}auth/checkEmail`,
        {empEmail:email}
        )
        setLoading(false)
        setOpen(true)
      }catch (e) {
        
      }
    } 
    if (email.length){
      checkEmail();
    }
  },[email])

  const handleOpen = () => {
    setLoading(true)
    const userEmail = document.getElementById("email").value.trim()
    const emails = ['sportsschool.edu.sg', 'nysi.org.sg', 'gmail.com', 'scis.smu.edu.sg']
    if (userEmail.indexOf("@") != -1 && emails.includes(userEmail.split("@")[1])) {
      setEmail(userEmail);
    } else {
      setEmail("");
      setLoading(false)
      setOpenError(true)
    }
  }

  const handleClose = () => {
    setOpen(false)
    router.push('/auth/login')
  }

  const handleErrorClose = () => {
    setOpenError(false)
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
            <Typography variant='body2' align="center">Kindly enter your employee E-mail address</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField fullWidth type='email' id='email' label='Email' sx={{ marginBottom: 4 }} />
            <Button fullWidth size='large' type='submit' variant='contained' sx={{ marginBottom: 7 }} onClick={loading ? null : handleOpen}>
              {loading ? "Loading..." : "Submit"}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Already have an account?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/auth/login'>
                  <LinkStyled>Sign in instead</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
        {
          open ?
          <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Complete Your Registration"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Please check your inbox for a link to complete your registration.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} autoFocus>
                  Got It
                </Button>
              </DialogActions>
        </Dialog>
        : null
        }
        {
          openError ?
          <Dialog
            open={openError}
            onClose={handleErrorClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Unable To Verify"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Please ensure that an SSP employee email address has been entered.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleErrorClose} autoFocus>
                Got It
              </Button>
            </DialogActions>
          </Dialog>
          : null
        }
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
