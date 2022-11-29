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

// ** Demo Components Imports
import ReturnPassTable from 'src/views/gop/ReturnPassTable'

const Return = () => {
  const url = process.env.REACT_BACKEND_URL || "http://localhost:8080/"
  const [ confirmation, setConfirmation ] = useState(false)
  const [ returned, setReturned ] = useState(false)
  const [ data, setData ] = useState({})
  const router = useRouter()

  const handleOpenConfirmation = (props) => {
    setData(JSON.parse(props))
    setConfirmation(true)
  }

  const handleCloseConfirmation = () => {
    setConfirmation(false)
  }

  const handleOpenReturned = async () => {
    // Add api to update pass
    try {
      const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
      const config = { headers: { Authorization: bearer_token } }
      let res = await axios.get(`${url}gop/returnLoanPasses/${ data.loanId }`, config)

      if (res.status == 200) {
        setConfirmation(false)
        setReturned(true)
      }
    } catch (e) {
      
    }
  }

  const handleCloseReturned = () => {
    setReturned(false)
    router.push('/gop/collect')
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
            Corporate Pass Collection
        </Typography>
        <Typography variant='body2'>Listed are all passes that have been loaned out. When employees return the to the General Office, update return.</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Loaned Passes' titleTypographyProps={{ variant: 'h6' }} sx={{ pb: 2, pt: 6}} />
          <ReturnPassTable confiOpen={handleOpenConfirmation} />
        </Card>
      </Grid>
      <Dialog
          open={confirmation}
          onClose={handleCloseConfirmation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">
              {"Pass Return Confirmation"}
          </DialogTitle>
          <DialogContent>
              <DialogContentText id="alert-dialog-description" paddingBottom={2}>
                The following passes for { data.placeOfInterest } has been returned by { data.emailId }.
              </DialogContentText><br/>
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
              <Button onClick={handleOpenReturned}>
                  Confirm
              </Button>
          </DialogActions>
      </Dialog>
      <Dialog
          open={returned}
          onClose={handleCloseReturned}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">
              {"Pass Status Updated"}
          </DialogTitle>
          <DialogContent>
              <DialogContentText id="alert-dialog-description" paddingBottom={2}>
              The following passes have been returned.
              </DialogContentText><br/>
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
              <Button onClick={handleCloseReturned}>
                  Got it
              </Button>
          </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default Return

