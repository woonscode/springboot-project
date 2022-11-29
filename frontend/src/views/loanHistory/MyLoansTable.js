// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Chip from '@mui/material/Chip'

import MyLoansData from '/src/services/staff/MyLoansData'
import axios from 'axios';
import Moment from 'moment'

const columns = [
  { id: 'destination', label: 'Place of Interest', minWidth: 170 },
  { id: 'loanDate', label: 'Loan Date', minWidth: 170 },
  { id: 'status', label: 'Status', minWidth: 170 }
]

const MyLoansTable = () => {
  const url = process.env.REACT_BACKEND_URL || "http://localhost:8080/"
  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [ rows, setRows ] = useState([])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const getAllLoans = async () => {
    let loans = []
    try {
      const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
      const email = JSON.parse(sessionStorage.getItem("data")).email
      const config = { headers: { Authorization: bearer_token } }
      let res = await axios.get(`${url}user/loan/combined/${email}`, config)
      
      if (res.status == 200) {
        const allLoans = res.data.data
        for (var index in allLoans.completed) {
          const completedLoan = allLoans.completed[index]
          if (completedLoan.passes != null) {
            loans.push({
              destination: completedLoan.passes[0].destination,
              date: Moment(completedLoan.loanDate,"YYYY-MM-DD"),
              status: "completed"
            })
          }
        }
        for (var index in allLoans.upcoming) {
          const upcomingLoan = allLoans.upcoming[index]
          if (upcomingLoan.passes != null) {
            loans.push({
              destination: upcomingLoan.passes[0].destination,
              date: Moment(upcomingLoan.loanDate,"YYYY-MM-DD"),
              status: "upcoming"
            })
          }
        }

        for (var index in allLoans.waitlist) {
          console.log(allLoans.waitlist[index])
          const waitlistLoan = allLoans.waitlist[index]
          if (waitlistLoan) {
            loans.push({
              destination: waitlistLoan.destination,
              date: Moment(waitlistLoan.date,"YYYY-MM-DD"),
              status: "waitlist"
            })
          }
        }

        for (var index in allLoans.overdue) {
          const overdueLoan = allLoans.overdue[index]
          if (overdueLoan.passes != null) {
            loans.push({
              destination: overdueLoan.passes[0].destination,
              date: Moment(overdueLoan.loanDate,"YYYY-MM-DD"),
              status: "due"
            })
          }
        }

        loans.sort(function(a,b){ return a.date - b.date})
        setRows(loans)

      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getAllLoans()
  },[])

  const statusObj = {
      upcoming: { color: 'warning' }, //info
      completed: { color: 'success' },
      due: { color: 'error' },
      waitlist: { color: 'secondary'}
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {

            }
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={key}>
                  <TableCell>{row.destination}</TableCell>
                  <TableCell>{Moment(row.date).format("Do MMMM YYYY")}</TableCell>
                  <TableCell>
                    <Chip
                    label={row.status}
                    color={statusObj[row.status].color}
                    sx={{
                      height: 24,
                      width: 100,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                 </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default MyLoansTable
