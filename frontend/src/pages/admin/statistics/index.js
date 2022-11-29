// ** MUI Imports
import Grid from '@mui/material/Grid'
import React from 'react'
// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Summary from "src/views/admin/statistics/summary"
import { getPassStatistics } from 'src/services/admin/statistics'

const renderStats = (stats) => {
  if(!stats) return null
return stats.map((item, index) => (
  <>
  <Grid item xs={3} md={3} key={index}>
    <CardStatisticsVerticalComponent color="success" icon={<LocalActivityIcon/>} title={item.destination} subtitle={item.passData[0].passType.toUpperCase()} stats={item.passData[0].numLoans}/>
  </Grid>
  <Grid item xs={3} md={3} key={index}>
    <CardStatisticsVerticalComponent color="error" icon={<BookOnlineIcon/>} title={item.destination} subtitle={item.passData[1].passType.toUpperCase()} stats={item.passData[1].numLoans}/>
  </Grid>
  </>
))
}

const Dashboard = () => {
  const [passStatistics, setPassStatistics] = React.useState(null)
  React.useEffect(async () => {
    if (sessionStorage) {
      const data = JSON.parse(sessionStorage.getItem('data'))
      const response = await getPassStatistics(data)
      setPassStatistics(response)

    }
  }, [])
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        
        <Grid item xs={12} md={12}>
          <Summary stats={passStatistics}/>
        </Grid>

        {/* {renderStats(passStatistics)} */}
        

      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
