// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Chip from '@mui/material/Chip'

const createData = (corporatePassId, loanDate, returnDate, status, numPasses) => {
  return { corporatePassId, loanDate, returnDate, numPasses, status }
}

const rows = [
  createData(223123, '18 Oct 2022', '19 Oct 2022', 'pending', '2')
]

const PassDetails = () => {
  const statusObj = {
    pending: { color: 'warning' }, //info
    completed: { color: 'success' },
    due: { color: 'error' }
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Corporate Pass Id</TableCell>
            <TableCell align='right'>Loan Date</TableCell>
            <TableCell align='right'>Return Date</TableCell>
            <TableCell align='right'>Status</TableCell>
            <TableCell align='right'>Number of Passes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow
              key={row.name}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell component='th' scope='row'>
                {row.corporatePassId}
              </TableCell>
              <TableCell align='right'>{row.loanDate}</TableCell>
              <TableCell align='right'>{row.returnDate}</TableCell>
              <TableCell align='right'>
                    {/* <Badge badgeContent={row.status} color="primary" sx={{marginLeft: '20px' }}></Badge> */}
                    <Chip
                    label={row.status}
                    color={statusObj[row.status].color}
                    sx={{
                      marginRight: -10,
                      height: 24,
                      width: 100,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                 </TableCell>
              <TableCell align='right'>{row.numPasses}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PassDetails
