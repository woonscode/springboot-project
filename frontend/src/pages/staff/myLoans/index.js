// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useState, useEffect } from 'react'
import axios from 'axios';
// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { useRouter } from 'next/router'
import Moment from 'moment'

// ** Demo Components Imports
import UpcomingLoanCard from 'src/views/myLoans/UpcomingLoanCard'
import WaitlistCard from 'src/views/myLoans/WaitlistCard'
import * as React from 'react';
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button'

const MyLoans = () => {
  const url = process.env.REACT_BACKEND_URL || "http://localhost:8080/"
  const router = useRouter()
  const [ upcomingLoans, setUpcomingLoans ] = useState([])
  const [ waitlistedLoans, setWaitlistedLoans ] = useState([])
  const [ openWithdraw, setOpenWithdraw ] = useState(false)
  const [ openSuccess, setOpenSuccess ] = useState(false)
  const [ withdrawProps, setWithdrawProps ] = useState("")

  const getCombinedLoans = async () => {
    let upcomingLoanStrings = []
    let waitlistLoanStrings = []
    try {
      const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
      const config = { headers: { Authorization: bearer_token } }
      const email = JSON.parse(sessionStorage.getItem("data")).email
      let res = await axios.get(`${url}user/loan/combined/${email}`, config)

      if (res.status == 200) {
        const upcoming = res.data.data.upcoming
        const waitlist = res.data.data.waitlist

        for (var index in upcoming) {
          const currLoan = JSON.stringify(upcoming[index])
          upcomingLoanStrings.push(currLoan)
        }

        for (var index in waitlist) {
          const currLoan = JSON.stringify(waitlist[index])
          waitlistLoanStrings.push(currLoan)
        }
        
        setUpcomingLoans(upcomingLoanStrings)
        setWaitlistedLoans(waitlistLoanStrings)
      }
    } catch (e) {
      
    }
  }

  useEffect(() => {
    getCombinedLoans()
  }, [])

  const openWithdrawPopup = (props) => {
    setWithdrawProps(props)
    setOpenWithdraw(true)
  }

  const withdrawWaitlist = async () => {
    try {
      const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
      const loanData = JSON.parse(withdrawProps)
      const email = loanData['email']
      const destination = loanData['destination']
      const date = Moment(loanData['date'], "YYYY-MM-DD").format("DD/MM/YYYY")

      const res = await axios.delete(`${url}user/waitlist`, {
        headers: {
          'Authorization': `Bearer ${bearer_token}`
        },
        data: {
          email: email,
          destination: destination,
          date: date
        }
      })

      if (res.status == 200) {
          getCombinedLoans()
          setOpenWithdraw(false)
          setOpenSuccess(true)
      }
    } catch (e) {
      
    }
}

  const handleCloseWithdrawPopup = () => {
    setOpenWithdraw(false)
}

const handleClosePopup = () => {
  setOpenSuccess(false)
  router.push('/staff/myLoans')
}
  
  return (
    <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>Loan Overview</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>Upcoming Loans</Typography>
        </Grid>
        { upcomingLoans == null || upcomingLoans.length == 0 &&
          <Grid item xs={12} marginTop={10} >
            <Typography variant='body' color={'#9C9FA4'}>No upcoming loans</Typography>
          </Grid>
        }
        { upcomingLoans != null && upcomingLoans.length != 0 &&
          upcomingLoans.map((loan, key) => {
            return (
              <Grid item xs={12} md={3} key={key}>
                <UpcomingLoanCard data={loan} />
              </Grid>
            )
          })
        }
        <Grid item xs={12} marginTop={10}>
          <Typography variant='h6'>Waitlisted Loans</Typography>
          <Typography variant='body2'>An email will be sent to you should passes become available.</Typography>
        </Grid>
        { waitlistedLoans == null || waitlistedLoans.length == 0 &&
          <Grid item xs={12} marginTop={10} >
            <Typography variant='body' color={'#9C9FA4'}>No waitlisted loans</Typography>
          </Grid>
        }
        { waitlistedLoans != null && waitlistedLoans.length != 0 &&
          waitlistedLoans.map((loan, key) => {
            return (
              <Grid item xs={12} md={3} key={key}>
                <WaitlistCard data={loan} withdraw={openWithdrawPopup}/>
              </Grid>
            )
          })
        }
        <Dialog
                open={openWithdraw}
                onClose={handleCloseWithdrawPopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Withdrawal"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    Are you sure you want to withdraw from this waitlist?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseWithdrawPopup}>
                    Cancel
                    </Button>
                    <Button onClick={withdrawWaitlist} autoFocus>
                    Withdraw
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openSuccess}
                onClose={handleClosePopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">
                    {"Waitlist Withdrawn!"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClosePopup}>
                        Got it
                    </Button>
                </DialogActions>
            </Dialog>
    </Grid>
  )
}

export default MyLoans
