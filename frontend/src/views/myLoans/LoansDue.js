// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia';

const LoansDue = () => {
  return (
    <Card sx={{ position: 'relative' }}>
      <CardHeader
        title="Loans Due"/>
        {/* to change to dynamic image */}
        <CardMedia
        component="img"
        height="194"
        image="/images/misc/Duck_tours.jpeg"
        alt="Upcoming loan"
      />
      {/* to change to dynamic content */}
      <CardContent >
          <Typography variant='body2'>Singapore DUCLtours</Typography>
          <Typography variant='body2' sx={{ mb: '15px' }}>Return Date: 10th October 2022</Typography>
        <Button fullWidth variant='contained'>
          View Loan Details
        </Button>



      </CardContent>
    </Card>
  )
}

export default LoansDue
