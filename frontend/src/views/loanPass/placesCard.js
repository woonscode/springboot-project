// ** React Imports
import { useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';

const PlacesCard = (props) => {

  const router = useRouter();
  const data = props.data
  const destination = data["destination"]
  const description = data["description"]
  const imageUrl = (data["imageBase64"] == null || data["imageBase64"].length == 0) ? "https://cdn.britannica.com/55/190455-050-E617F64E/Night-view-Singapore.jpg" :  data["imageBase64"]

  const loanPass = () => {
    const route = '/staff/viewPlaces/loanPass/' + destination
    router.push({
      pathname: route
    }, route)
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <CardHeader title={destination}/>
      <CardMedia
        component="img"
        height="140"
        image={ imageUrl }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          { description.slice(0, 90) }...
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" sx={{ paddingLeft:'0 !important' }} onClick={loanPass} >Loan Pass</Button>
      </CardActions>
    </Card>
  )
}

export default PlacesCard
