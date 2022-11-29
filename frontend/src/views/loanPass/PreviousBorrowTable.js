// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

const createData = (corporatePassId, name, contactNumber) => {
  return { corporatePassId, name, contactNumber }
}

const rows = [
  createData(223123, 'Andy', '81723243')
]

const PrevBorrower = () => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Corporate Pass Id</TableCell>
            <TableCell align='right'>Name</TableCell>
            <TableCell align='right'>Contact Number</TableCell>
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
              <TableCell align='right'>{row.name}</TableCell>
              <TableCell align='right'>{row.contactNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PrevBorrower
