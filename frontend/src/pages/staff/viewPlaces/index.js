// ** React Imports
import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import PlacesCard from 'src/views/loanPass/placesCard'
import Typography from '@mui/material/Typography'

const ViewPlaces = () => {
  const url = process.env.REACT_BACKEND_URL || "http://localhost:8080/"
  const [ cards, setCards ] = useState([])

  // Get all destinations
  const getCardData = async () => {
    try {
        const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
        const config = {
        headers: {
                Authorization: bearer_token
            }
        }
        let res = await axios.get(`${url}user/getAllDestinations`, config)

        if (res.status == 200) {
            const destinations = res.data.data
            const cards = Object.keys(destinations).map((key) => destinations[key])
            setCards(cards)
        }
    } catch (e) {
        
    }
  }

  useEffect(() => {
    getCardData()
  },[])

  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>Loan A Pass</Typography>
          <Typography variant='body2'>Search for a destination and click on 'View Details' to make a loan.</Typography>
        </Grid>
        {
          cards.map((card, key) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <PlacesCard data={card}/>
              </Grid>
            )
          })
        }
      </Grid>
    </div> 
  )
}

export default ViewPlaces
