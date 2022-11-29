// ** MUI Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button'
import axios from 'axios'
import Moment from 'moment';

// ** Demo Components Imports
import CollectPassTable from 'src/views/gop/CollectPassTable'
import moment from 'moment'

const Collect = () => {
  const url = process.env.REACT_BACKEND_URL || "http://localhost:8080/"
  const [ confirmation, setConfirmation ] = useState(false)
  const [ collected, setCollected ] = useState(false)
  const [ tooEarly, setTooEarly ] = useState(false)
  const [ data, setData ] = useState({})
  const router = useRouter()

  const validateCollection = (props) => {
    const date = Moment(JSON.parse(props).date)
    const difference = date.diff(moment(), 'days')
    if (date.format('dddd') == "Monday" && difference == 2) {
      handleOpenConfirmation(props)
    } else if (date.format('dddd') == "Sunday" && difference == 1) {
      handleOpenConfirmation(props)
    } else if (difference == 0) {
      handleOpenConfirmation(props)
    } else {
      setTooEarly(true)
    }
  }

  const handleTooEarlyClose = () => {
    setTooEarly(false)
  }

  const handleOpenConfirmation = (props) => {
    setData(JSON.parse(props))
    setConfirmation(true)
  }

  const handleCloseConfirmation = () => {
    setConfirmation(false)
  }

  const handleOpenCollected = async () => {
    // Add api to update pass
    try {
        const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
        const config = { headers: { Authorization: bearer_token } }
        let res = await axios.get(`${url}gop/collectLoanPasses/${ data.loanId }`, config)

        if (res.status == 200) {
          setConfirmation(false)
          setCollected(true)
        }
    } catch (e) {
      
    }
  }

  const handleCloseCollected = () => {
    setCollected(false)
    router.push('/gop/return')
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
            Corporate Pass Collection
        </Typography>
        <Typography variant='body2'>Listed are all passes for upcoming loans. When employees have collected from General Office, update collection.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Loaned Passes' titleTypographyProps={{ variant: 'h6' }} sx={{ pb: 2, pt: 6}} />
          <CollectPassTable confiOpen={validateCollection} />
        </Card>
      </Grid>
      <Dialog
          open={confirmation}
          onClose={handleCloseConfirmation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">
              {"Pass Collection Confirmation"}
          </DialogTitle>
          <DialogContent>
              <DialogContentText id="alert-dialog-description" paddingBottom={2}>
                The following passes will be handed over to { data.emailId } for the { data.placeOfInterest }.
              </DialogContentText>
              <br/>
              <DialogContentText id="alert-dialog-description" paddingBottom={2}>
                PASS IDS
              </DialogContentText>
              { 
              data.passInfo != null && data.passInfo.map((passId, key) => {
                return (
                    <DialogContentText id="alert-dialog-description" key={key}>
                    {passId}
                  </DialogContentText>
                )
              })
              }
          </DialogContent>
          <DialogActions>
              <Button onClick={handleCloseConfirmation}>
                  Cancel
              </Button>
              <Button onClick={handleOpenCollected}>
                  Confirm
              </Button>
          </DialogActions>
      </Dialog>
      <Dialog
          open={collected}
          onClose={handleCloseCollected}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">
              {"Pass Status Updated"}
          </DialogTitle>
          <DialogContent>
              <DialogContentText id="alert-dialog-description" paddingBottom={2}>
                The following passes have been collected.
              </DialogContentText><br/>
              <DialogContentText id="alert-dialog-description" paddingBottom={2}>
                PASS IDS
              </DialogContentText>
              { 
              data.passInfo != null && data.passInfo.map((passId, key) => {
                return (
                    <DialogContentText id="alert-dialog-description" key={key}>
                    {passId}
                  </DialogContentText>
                )
              })
              }
          </DialogContent>
          <DialogActions>
              <Button onClick={handleCloseCollected}>
                  Got it
              </Button>
          </DialogActions>
      </Dialog>
      <Dialog
          open={tooEarly}
          onClose={handleTooEarlyClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">
              {"Too Early"}
          </DialogTitle>
          <DialogContent>
              <DialogContentText id="alert-dialog-description" paddingBottom={2}>
                The pass can only be collected the weekday before the loan.
              </DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleTooEarlyClose}>
                  Ok
              </Button>
          </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default Collect
