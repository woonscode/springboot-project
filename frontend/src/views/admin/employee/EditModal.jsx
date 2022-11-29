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
import { editEmployee } from 'src/services/admin/employee'

const EditModal = ({ modalData, dataUpdate, closeModal }) => {
  // ** States
  let userStore
  if (sessionStorage) {
    userStore = JSON.parse(sessionStorage.getItem('data'))
  }

  const [name, setName] = useState(modalData.name)
  const [username, setUsername] = useState(modalData.username)
  const [phone, setPhone] = useState(modalData.phoneNo)
  const [loading, setLoading] = useState(false)

  const handleInputs = () => {
    return username == modalData.username && name == modalData.name && phone == modalData.phoneNo ? true : false
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const data = {
      empId: modalData.empId,
      email: modalData.email,
      username: username,
      phoneNo: phone,
      name: name,
    }
    await editEmployee(userStore, data)
    dataUpdate()
    setTimeout(() => {
      setLoading(false)
      closeModal()
    }, 1000)
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ padding: 1 }}>
        <CardHeader title='Edit Employee Details' titleTypographyProps={{ variant: 'h6' }} sx={{ marginBottom: 4 }} />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='ID'
                  placeholder='Auto-Generated'
                  disabled
                  value={modalData.empId}
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
                  label='Name'
                  placeholder='Bob Smith'
                  value={name}
                  onChange={e => {
                    setName(e.target.value)
                  }}
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
                  label='Username'
                  placeholder='Bob Smith'
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value)
                  }}
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
                  type='email'
                  label='Email'
                  placeholder='singaporesports@ssp.com'
                  value={modalData.email}
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
                  type='phone'
                  label='Phone'
                  placeholder='91106872'
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value)
                  }}
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
