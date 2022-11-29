import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';

// ** Icons Imports
import MessageOutline from 'mdi-material-ui/MessageOutline'
import Grid3x3Icon from '@mui/icons-material/Grid3x3'
import PlaceIcon from '@mui/icons-material/Place'
import ApprovalIcon from '@mui/icons-material/Approval'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

// Create Loan
import { createLoan } from 'src/services/admin/loan'

import { useAtom } from 'jotai'
import { sessionAtom } from '/src/store'

const AddModal = ({ dataUpdate }) => {
  // ** States
  const [userData, setUserData] = useAtom(sessionAtom)
  const [destn, setDestn] = useState([])
  const [borrowerId, setBorrowerId] = useState('')
  const [count, setCount] = useState(null)
  const [loanDate, setLoanDate] = useState(dayjs(new Date()))
  const [loading, setLoading] = useState(false)

  const handleInputs = () => {
    return borrowerId && count && destination && loanDate ? false : true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const data = {
      borrowerId: borrowerId,
      count: count,
      destination: destination,
      loanDate: loanDate
    }
    await createLoan(userStore, data)
    dataUpdate()
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ padding: 1 }}>
        <CardHeader title='Add New Pass' titleTypographyProps={{ variant: 'h6' }} sx={{ marginBottom: 4 }} />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Borrower ID'
                  placeholder='01AT999h88'
                  value={borrowerId}
                  onChange={e => setBorrowerId(e.target.value)}
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
                  type='number'
                  label='Number of Passes'
                  placeholder='1'
                  value={count}
                  onChange={e => setCount(e.target.value)}
                  helperText='You are only allowed up to 2 passes.'
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
                <DesktopDatePicker
                  label='Loan Date'
                  inputFormat='DD/MM/YYYY'
                  disablePast
                  value={loanDate}
                  onChange={setLoanDate}
                  renderInput={params => <TextField {...params} />}
                  sx={{width:200}}
                />
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

export default AddModal
