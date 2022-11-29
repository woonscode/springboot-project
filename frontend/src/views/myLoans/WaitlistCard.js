import * as React from 'react';
import Moment from 'moment';

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions';

const WaitlistCard = (props) => {

  const data = JSON.parse(props.data)
  const formatDate = Moment(data.date).format('Do MMM YYYY')

  const handleWithdraw = () => {
    const loanData = props.data
    props.withdraw(loanData)
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          { formatDate }
        </Typography>
        <Typography variant="h5" component="div">
          { data.destination }
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" sx={{ paddingLeft:'0 !important' }} onClick={handleWithdraw}>Withdraw</Button>
      </CardActions>
    </Card>
  )
}

export default WaitlistCard
