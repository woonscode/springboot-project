import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
// ** Icons Imports
import MessageOutline from 'mdi-material-ui/MessageOutline'
import Grid3x3Icon from '@mui/icons-material/Grid3x3'
import PlaceIcon from '@mui/icons-material/Place'
import ApprovalIcon from '@mui/icons-material/Approval'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

// Create Pass
import { createPass, getDestn } from 'src/services/admin/pass'
import { useAtom } from 'jotai'
import { sessionAtom } from '/src/store'

const AddModal = ({ dataUpdate, closeModal }) => {
  const [userData, setUserData] = useAtom(sessionAtom)
  const [passId, setPassId] = useState('')
  const [destination, setDestination] = useState('')
  const [status, setStatus] = useState('Active')
  const [fee, setFee] = useState(null)
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [dList, setDList] = useState([])
  useEffect(async () => {
    await getDestn(userData).then(res => {
      const dest = res.map(d => d.destination)
      setDList(dest)
    })
  }, [])
  const handleInputs = () => {
    return passId && destination && status && fee && details ? false : true
  }

  const handleChange = (event) => {
    setDestination(event.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const data = {
      passId: passId,
      destination: destination,
      status: status,
      replacementFee: fee ? parseFloat(fee) : 0.0,
      admissionDetails: details
    }
    await createPass(userData, data)
    dataUpdate()
    setTimeout(() => {
      setLoading(false)
      closeModal()
    }, 1000)
  }

  return (
    <Card sx={{ padding: 1 }}>
      <CardHeader title='Add New Pass' titleTypographyProps={{ variant: 'h6' }} sx={{ marginBottom: 4 }} />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Pass ID'
                placeholder='01AT999h88'
                value={passId}
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
                type='text'
                label='Status'
                disabled
                placeholder='In Application'
                value={status}
                onChange={e => setStatus(e.target.value)}
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
                type='number'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
              <LoadingButton type='submit' variant='contained' size='large' loading={loading} disabled={handleInputs()}>
                Submit
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddModal
