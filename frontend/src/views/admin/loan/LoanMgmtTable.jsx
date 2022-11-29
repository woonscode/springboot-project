// ** React Imports
import { useState, useEffect } from 'react'

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
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import DeleteIcon from '@mui/icons-material/Delete'
import Grid from '@mui/material/Grid'
import Popover from '@mui/material/Popover'

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Delete Loan
import { deleteLoan } from '/src/services/admin/loan'

function LoanMgmtTable({ loanData, openModal, openAddModal, dataUpdate }) {
  // ** States
  useEffect(async () => {
    if (sessionStorage) {
      const userData = JSON.parse(sessionStorage.getItem('data'))
      setUserData(userData)
    }
  }, [])
  const [userData, setUserData] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  // Popper
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleSearchChange = e => {
    setSearchQuery(e.target.value)
  }

  const delLoan = async (e, { loanId }) => {
    await deleteLoan(userData, loanId)
    dataUpdate();
    handleClose();
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Card sx={{ padding: 3 }}>
        <div
          style={{
            display: 'flex',
            alignSelf: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <form>
            <Grid container justifyContent='space-between'>
              <Grid item lg={11}>
                <TextField
                  sx={{ width: '90%' }}
                  id='search-bar'
                  className='text'
                  onChange={handleSearchChange}
                  label='Search Pass'
                  variant='outlined'
                  placeholder='Search...'
                  size='small'
                />
                <IconButton type='submit' aria-label='search'>
                  <SearchIcon style={{ fill: '#9155FD' }} />
                </IconButton>
              </Grid>
              <Grid item lg={1}>
                <Button variant='contained' sx={{ color: '#fff !important', width: '60%' }} onClick={openAddModal}>
                  +Add
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Card>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell>Loan ID</TableCell>
              <TableCell>Borrower ID</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Loan Date</TableCell>
              <TableCell>Booking Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Collected?</TableCell>
              <TableCell>Returned?</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loanData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                row.borrowerId.toLowerCase().includes(searchQuery.toLowerCase()) && (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.loanId}>
                    <TableCell>{row.loanId}</TableCell>
                    <TableCell>{row.borrowerId}</TableCell>
                    <TableCell>{row?.passes[0]?.destination}</TableCell>
                    <TableCell>{row.loanDate}</TableCell>
                    <TableCell>{row.returnDate}</TableCell>
                    <TableCell>{row.bookingDate}</TableCell>
                    <TableCell>{row.collected ? <CheckCircleIcon color='success' sx={{opacity:0.7}}/> : <CancelIcon color='error' sx={{opacity:0.7}}/>}</TableCell>
                    <TableCell>{row.returned ? <CheckCircleIcon color='success' sx={{opacity:0.7}}/> : <CancelIcon color='error' sx={{opacity:0.7}}/>}</TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      {/* <IconButton
                        aria-describedby={id}
                        size='small'
                        variant='contained'
                        // sx={{color: 'white !important', background: '#ff9 !important'}}
                        onClick={event => openModal(event, row)}
                      >
                        <EditIcon />
                      </IconButton> */}
                      <IconButton
                        size='small'
                        variant='contained'
                        sx={{ color: '#FC3D39 !important' }}
                        onClick={handleClick}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left'
                        }}
                      >
                        <Card>
                          <CardContent>
                            Remove this loan?
                            <Button color='error' sx={{ marginLeft: 1, p: 1.5 }} onClick={e => delLoan(e, row)}>
                              Confirm
                            </Button>
                          </CardContent>
                        </Card>
                      </Popover>
                    </TableCell>
                  </TableRow>
                )
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={loanData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default LoanMgmtTable
