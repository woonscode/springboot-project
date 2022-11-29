import * as React from 'react';
import { useState } from 'react'
import { useRouter } from 'next/router'
import Moment from 'moment';

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions';

const UpcomingLoanCard = (props) => {

  const router = useRouter();
  const data = JSON.parse(props.data)
  const formatDate = Moment(data.loanDate).format('Do MMM YYYY')

  const openLoan = () => {
    // Show booking date, collection time, number of passes loaned, destination, admission details, replacement fee
    const route = '/staff/myLoans/viewLoan'
    router.push({
      pathname: route,
      query: { data: props.data }
    }, route)
  }

  return (
    <Card sx={{ position: 'relative', backgroundColor: '#F9FAFC' }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          { formatDate }
        </Typography>
        <Typography variant="h5" component="div">
          { data.passes[0].destination }
        </Typography>
        <Typography color="text.secondary">
          { data.passes.length } passes
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" sx={{ paddingLeft:'0 !important' }} onClick={openLoan}>View Loan</Button>
      </CardActions>
    </Card>
  )
}

export default UpcomingLoanCard
