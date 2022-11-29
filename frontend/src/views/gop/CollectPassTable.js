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
import Button from '@mui/material/Button'

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Card from '@mui/material/Card'

import CollectPassData from '/src/services/gop/CollectPassData'
import axios from 'axios'

const columns = [
  { id: 'email', label: 'Email ID', minWidth: 170 },
  { id: 'loanDate', label: 'Loan Date', minWidth: 170 },
  { id: 'destination', label: 'Pass Location', minWidth: 170 },
  { id: 'button', minWidth: 170 }
]

function createData(email, loanDate, destination, passes, loanId) {
  return { 
      emailId: email,
      date: loanDate,
      placeOfInterest: destination,
      passInfo: passes,
      loanId: loanId
  }
}

const CollectPassTable = ({confiOpen}) => {
  const url = process.env.REACT_BACKEND_URL || "http://localhost:8080/"
  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("");
  const [ rows, setRows ] = useState([])
  const [ allRows, setAllRows ] = useState([])

  const getAllLoans = async () => {
    let loans = []
    try {
        const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
        const config = { headers: { Authorization: bearer_token } }
        let res = await axios.get(`${url}user/loan/all`, config)

        if (res.status == 200) {
            const loanData = res.data.data
            for (var index in loanData) {
                const loan = loanData[index]
                if (!loan.collected) {
                    let passIds = []
                    for (var index in loan.passes) {
                        const passDetails = loan.passes[index]
                        passIds.push(passDetails.passId)
                    }
                    loans.push(createData(loan.borrowerId, loan.loanDate, loan.passes[0].destination, passIds, loan.loanId))
                }
            }
        }
        setRows(loans)
        setAllRows(loans)
    } catch (e) {
        
    }
  }

  useEffect(() => {
    getAllLoans()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleSearchChange = (e) => {
      setSearchQuery(e.target.value.trim())
  }

  useEffect(() => {
    let filteredLoans = allRows
    
    if (searchQuery.length != 0) {
      filteredLoans = filteredLoans.filter(
        loan => loan.emailId.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setRows(filteredLoans)
      } else {
        setRows(allRows)
      }
  }, [searchQuery])

  const handleCollectPass = (e) => {
    confiOpen(e.target.value)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Card sx={{ padding: 3 }}>
          <div
          style={{
            display: "flex",
            alignSelf: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <form>
              <TextField
                  sx={{ width: '100%'}}
                  id="search-bar"
                  className="text"
                  onChange={handleSearchChange}
                  label="Search Employee Email"
                  variant="outlined"
                  placeholder="Search..."
                  size="small"
              />
          </form>
        </div>
      </Card>
      <TableContainer sx={{ maxHeight: 650 }}>
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={key}>
                  <TableCell>{row.emailId}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.placeOfInterest}</TableCell>
                  <TableCell sx={{color: 'white'}}>
                    <Button
                      size='small'
                      variant='contained'
                      sx={{color: 'white !important'}}
                      onClick={handleCollectPass}
                      value={JSON.stringify(row)}
                    >
                      Collected
                    </Button>
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

export default CollectPassTable
