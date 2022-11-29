import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import FileUpload from 'react-material-file-upload'
// ** Icons Imports
import MessageOutline from 'mdi-material-ui/MessageOutline'
import LocationOnIcon from '@mui/icons-material/LocationOn'
// Create Pass
import { createDestn } from 'src/services/admin/pass'
import { useAtom } from 'jotai'
import { sessionAtom } from '/src/store'

const AddModal = ({ dataUpdate, closeModal }) => {
  const [userData, setUserData] = useAtom(sessionAtom)

  const [destination, setDestination] = useState('')
  const [details, setDetails] = useState('')
  const [image, setImage] = useState([])
  const [loading, setLoading] = useState(false)

  const handleInputs = () => {
    return destination && details && image.length ? false : true
  }

  const handleChange = event => {
    setDestination(event.target.value)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    let dataURL
    // Encode the file using the FileReader API
    const reader = new FileReader()
    reader.onloadend = async () => {
      dataURL = reader.result
      const data = {
        destination: destination,
        description: details,
        image: dataURL
      }
      await createDestn(userData, data)
      dataUpdate()
      setTimeout(() => {
        setLoading(false)
        closeModal()
      }, 1000)
      // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
    }
    await reader.readAsDataURL(image[0])
  }

  return (
    <Card sx={{ padding: 1 }}>
      <CardHeader title='Add Destination' titleTypographyProps={{ variant: 'h6' }} sx={{ marginBottom: 4 }} />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Destination'
                placeholder='Zoo'
                value={destination}
                onChange={e => setDestination(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LocationOnIcon />
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
                label='Details'
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder='Details regarding the Destination'
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
              <FileUpload value={image} onChange={setImage} accept={['.png', '.jpg', '.jpeg', '.heif']} />
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
