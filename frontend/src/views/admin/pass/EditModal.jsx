import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import LoadingButton  from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import MessageOutline from 'mdi-material-ui/MessageOutline'
import Grid3x3Icon from '@mui/icons-material/Grid3x3'
import PlaceIcon from '@mui/icons-material/Place'
import ApprovalIcon from '@mui/icons-material/Approval'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

// Create Pass
import { editPass } from 'src/services/admin/pass'

const EditModal = ({modalData, dataUpdate, closeModal}) => {
const userStore = JSON.parse(sessionStorage.getItem('data'))
  const [passId, setPassId] = useState(modalData.passId || "")
  const [destination, setDestination] = useState(modalData.destination || "")
  const [fee, setFee] = useState(modalData.replacementFee || "")
  const [details, setDetails] = useState(modalData.admissionDetails || "")
  const [loading, setLoading] = useState(false)

  const handleInputs = () => {
    return (passId == modalData.passId) && (destination == modalData.destination) && (fee == modalData.replacementFee) && (details == modalData.admissionDetails) ? true : false
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    const data = {
      passId: passId,
      destination: destination,
      status: modalData.status,
      replacementFee: fee ? parseFloat(fee) : 0.0,
      admissionDetails: details
    }
    await editPass(userStore, data);
    dataUpdate();
    setTimeout(() => {
      setLoading(false);
      closeModal();
    }, 1000);
  }
  return (
    <Card sx={{ padding: 1 }}>
      <CardHeader title='Edit Pass' titleTypographyProps={{ variant: 'h6' }} sx={{ marginBottom: 4 }} />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Pass ID'
                placeholder='01AT999h88'
                value={passId}
                disabled
                onChange={e => setPassId(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Grid3x3Icon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Destination'
                placeholder='Singapore Zoo'
                value={destination}
                onChange={e => setDestination(e.target.value)}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PlaceIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Status'
                placeholder={modalData.status}
                disabled
                value={modalData.status}
                // onChange={e => setStatus(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <ApprovalIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='number'
                label='Replacement Fee'
                placeholder='50.00'
                value={fee}
                onChange={e => setFee(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AttachMoneyIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label='Admission Details'
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder='Details regarding the Admission Pass...'
                sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <MessageOutline />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton  type='submit' variant='contained' size='large' loading={loading} disabled={handleInputs()}>
                Submit
              </LoadingButton >
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default EditModal
