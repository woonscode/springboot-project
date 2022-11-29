import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

// ** Icons Imports
import MessageOutline from 'mdi-material-ui/MessageOutline'
import Grid3x3Icon from '@mui/icons-material/Grid3x3'
import PlaceIcon from '@mui/icons-material/Place'
import ApprovalIcon from '@mui/icons-material/Approval'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

// Create Loan
import { createLoan } from 'src/services/admin/loan'
import { getDestn } from 'src/services/admin/pass'
import { getAllUser } from 'src/services/admin/employee'
import { useAtom } from 'jotai'
import { sessionAtom } from '/src/store'

const AddModal = ({ dataUpdate, closeModal }) => {
  // ** States
  const [userData, setUserData] = useAtom(sessionAtom)
  const today = new Date()
  let tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const [dList, setDList] = useState([])
  const [employees, setEmployees] = useState([])
  useEffect(async () => {
    await getDestn(userData).then(res => {
      const dest = res.map(d => d.destination)
      setDList(dest)
    })
    await getAllUser(userData).then(res => {
      const emp = res.map(e => {
        return { label: e.name, id: e.empId }
      })
      setEmployees(emp)
      
    })
  }, [])

  const [borrowerId, setBorrowerId] = useState('')
  const [count, setCount] = useState(null)
  const [destination, setDestination] = useState('')
  const [loanDate, setLoanDate] = useState(dayjs(tomorrow))
  const [loading, setLoading] = useState(false)
  const handleInputs = () => {
    return borrowerId && count && destination && loanDate ? false : true
  }
  
  const handleChange = event => {
    setDestination(event.target.value)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const data = {
      borrowerId: borrowerId,
      count: count,
      destination: destination,
      loanDate: loanDate.toISOString().slice(0, 10)
    }
    await createLoan(userData, data)
    dataUpdate()
    setTimeout(() => {
      setLoading(false)
      closeModal()
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
                <Autocomplete
                  disablePortal
                  fullWidth
                  
                  onChange={(event, newValue) => {
                    if(newValue){
                    setBorrowerId(newValue.id)}else{
                        setBorrowerId('')
                    }
                  }}
                  options={employees}
                  // sx={{ width: 300 }}
                  renderInput={params => <TextField {...params} fullWidth label='Borrower ID'/>}
                />

              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>Destination</InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={destination}
                    label='Destination'
                    onChange={handleChange}
                  >
                    {dList.map(d => (
                      <MenuItem value={d}>{d}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  sx={{ width: 200 }}
                  minDate={tomorrow}
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
