import { useState } from 'react'

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
import FileUpload from 'react-material-file-upload';
// ** Icons Imports
import MessageOutline from 'mdi-material-ui/MessageOutline'
import Grid3x3Icon from '@mui/icons-material/Grid3x3'
import PlaceIcon from '@mui/icons-material/Place'
import ApprovalIcon from '@mui/icons-material/Approval'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
// Create Loan
import { importEmployee } from 'src/services/admin/employee'

const ImportModal = ({ dataUpdate }) => {
  // ** States
  let userStore
  if (sessionStorage) {
    userStore = JSON.parse(sessionStorage.getItem('data'))
  }

  const [csv, setCsv] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    
    await importEmployee(userStore, data)
    dataUpdate()
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ padding: 1 }}>
        <CardHeader title='Import Employee CSV' titleTypographyProps={{ variant: 'h6' }} sx={{ marginBottom: 4 }} />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
              <FileUpload value={csv} onChange={setCsv} accept=".csv"  />
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  type='submit'
                  variant='contained'
                  size='large'
                  loading={loading}
                  disabled={!csv.length}
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

export default ImportModal
