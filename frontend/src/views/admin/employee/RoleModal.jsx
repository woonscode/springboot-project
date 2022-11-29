import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import Switch from '@mui/material/Switch'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

// Create Pass
import { updateRoles } from 'src/services/admin/employee'
const fixedRoles = ['admin', 'user', 'gop']
const RoleModal = ({ modalData, dataUpdate, closeModal }) => {
  // ** States
  // Jotai Session Storage
  let userStore
  if (sessionStorage) {
    userStore = JSON.parse(sessionStorage.getItem('data'))
  }

  const [roles, setRoles] = useState(modalData.roleArray)
  const [loading, setLoading] = useState(false)
  const handleChange = event => {
    const {
      target: { value }
    } = event
    setRoles(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const data = { user: modalData.email, roles: roles }
    const response = await updateRoles(userStore, data)
    if(response == "Role updated"){
      // Update Session Store New Role
      userStore.role = roles
      sessionStorage.setItem('data', JSON.stringify(userStore))
    }
    dataUpdate();
    setTimeout(() => {
      setLoading(false)
      closeModal()
    }, 1000)
  }

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ padding: 1 }}>
        <CardHeader title='Edit Pass' titleTypographyProps={{ variant: 'h6' }} sx={{ marginBottom: 4 }} />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id='demo-multiple-chip-label'>Chip</InputLabel>
                <Select
                  labelId='demo-multiple-chip-label'
                  id='demo-multiple-chip'
                  multiple
                  fullWidth
                  value={roles}
                  onChange={handleChange}
                  input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
                  renderValue={selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map(value => (
                        <Chip key={value} label={value.toUpperCase()} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {fixedRoles.map(name => (
                    <MenuItem key={name} value={name}>
                      {name.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <LoadingButton type='submit' variant='contained' size='large' loading={loading}>
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

export default RoleModal
