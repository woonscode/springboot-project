import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import Switch from '@mui/material/Switch'
// ** Icons Imports
import MessageOutline from 'mdi-material-ui/MessageOutline'
import Grid3x3Icon from '@mui/icons-material/Grid3x3'
import PlaceIcon from '@mui/icons-material/Place'
import ApprovalIcon from '@mui/icons-material/Approval'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

// Create Pass
import { editPass } from 'src/services/admin/pass'

const EditModal = ({ modalData, dataUpdate }) => {
  // ** States
  let userStore
  if (sessionStorage) {
    userStore = JSON.parse(sessionStorage.getItem('data'))
  }
  const [collected, setCollected] = useState(modalData.collected)
  const [returned, setReturned] = useState(modalData.returned)
  const [loading, setLoading] = useState(false)

  const handleInputs = () => {
    return collected == modalData.collected && returned == modalData.returned ? true : false
  }

  const updateCollected = () => {
    setCollected(!collected)
  }

  const updateReturned = () => {
    setReturned(!returned)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const data = {
      loanId: modalData.loanId,
      borrowerId: modalData.borrowerId,
      passIds: modalData.passIds,
      loanDate: modalData.loanDate,
      returnDate: modalData.returnDate,
      bookingDate: modalData.bookingDate,
      collected: String(collected),
      returned: String(returned)
    }
    await editPass(userStore, data)
    dataUpdate()
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ padding: 1 }}>
        <CardHeader title='Edit Pass' titleTypographyProps={{ variant: 'h6' }} sx={{ marginBottom: 4 }} />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Loan ID'
                  placeholder='Auto-Generated'
                  disabled
                  value={modalData.loanId}
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
                  label='Borrower Id'
                  placeholder='Auto-Generated'
                  disabled
                  value={modalData.borrowerId}
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
                  placeholder='In Application'
                  disabled
                  value={modalData.passes[0].destination}
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
                <DesktopDatePicker
                  label='Loan Date'
                  inputFormat='DD/MM/YYYY'
                  disabled
                  value={dayjs(modalData.loanDate)}
                  renderInput={params => <TextField {...params} />}
                  sx={{ width: 200 }}
                />
              </Grid>
              <Grid item xs={12}>
                <DesktopDatePicker
                  label='Return Date'
                  inputFormat='DD/MM/YYYY'
                  disabled
                  value={dayjs(modalData.returnDate)}
                  renderInput={params => <TextField {...params} />}
                  sx={{ width: 200 }}
                />
              </Grid>
              <Grid item xs={12}>
                <DesktopDatePicker
                  label='Booking Date'
                  inputFormat='DD/MM/YYYY'
                  disabled
                  value={dayjs(modalData.bookingDate)}
                  renderInput={params => <TextField {...params} />}
                  sx={{ width: 200 }}
                />
              </Grid>
              <Grid container column sx={{padding:3}}>
                <Grid item xs={5} sx={{marginLeft:3}}>
                  Collected?
                  <Switch checked={collected} onChange={updateCollected} inputProps={{ 'aria-label': 'controlled' }}  label="Collected?" labelPlacement="top"/>
                </Grid>
                <Grid item xs={6}>
                  Returned?
                  <Switch checked={returned} onChange={updateReturned} inputProps={{ 'aria-label': 'controlled' }}  label="Returned?" labelPlacement="top"/>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  type='submit'
                  variant='contained'
                  size='large'
                  loading={loading}
                  disabled={handleInputs()}
                >
                  Submit
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  )
}

export default EditModal
