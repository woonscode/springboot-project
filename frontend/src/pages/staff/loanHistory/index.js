// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Card from '@mui/material/Card'
import MyLoansTable from 'src/views/loanHistory/MyLoansTable'
import * as React from 'react';
import Typography from '@mui/material/Typography'

const LoanHistory = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
            Loan History
        </Typography>
        <Typography variant='body2'>To manage your waitlisted and upcoming loans, visit the 'My Loans' page.</Typography>
      </Grid>
        <Grid item xs={12}>
          <Card>
              <MyLoansTable />
          </Card>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default LoanHistory
