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
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PaidIcon from '@mui/icons-material/Paid';
// Delete Loan
import { deleteEmployee, clearFine } from '/src/services/admin/employee'

function EmployeeMgmtTable({ employeeData, openModalAdd, openModalEdit, openModalImport, openModalRole, dataUpdate }) {
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
  const [anchorEl2, setAnchorEl2] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const [feeData, setFeeData] = useState(null)
  const handleFees = (event,data) => {
    setAnchorEl2(event.currentTarget)
    setFeeData(data)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClose2 = () => {
    setAnchorEl2(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  const open2 = Boolean(anchorEl2)
  const id2 = open2 ? 'simple-popover' : undefined

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

  const delEmployee = async (e, row) => {
    await deleteEmployee(userData, row.empId)
    dataUpdate();
    handleClose();
  }
  const payFine = async (e, row) => {
    await clearFine(userData, row)
    dataUpdate();
    handleClose2();
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
                <Button variant='contained' color="secondary" sx={{ color: '#fff !important', width: '80%' }} onClick={openModalImport}>
                  Import
                </Button>
              </Grid>
              {/* <Grid item lg={1}>
                <Button variant='contained' sx={{ color: '#fff !important', width: '60%' }} onClick={openModalAdd}>
                  +Add
                </Button>
              </Grid> */}
            </Grid>
          </form>
        </div>
      </Card>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Fine</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                row.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.empId}>
                    <TableCell>{row.empId}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phoneNo}</TableCell>
                    <TableCell sx={{textTransform:'uppercase'}}>{row.roleArray.join(', ')}</TableCell>
                    <TableCell>${parseFloat(row.fine).toFixed(2)}</TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      <IconButton
                        aria-describedby={id}
                        size='small'
                        variant='contained'
                        // sx={{color: 'white !important', background: '#ff9 !important'}}
                        onClick={event => openModalEdit(event, row)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size='small'
                        variant='contained'
                        sx={{ color: '#FC3D39 !important' }}
                        onClick={handleClick}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        size='small'
                        variant='contained'
                        sx={{ color: '#007aff !important' }}
                        onClick={event => openModalRole(event, row)}
                      >
                        <PeopleAltIcon />
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
                            Delete this employee?
                            <Button color='error' sx={{ marginLeft: 1, p: 1.5 }} onClick={e => delEmployee(e, row)}>
                              Confirm
                            </Button>
                          </CardContent>
                        </Card>
                      </Popover>
                      {row.fine ?
                      <IconButton
                        size='small'
                        variant='contained'
                        sx={{ color: '#545 !important' }}
                        onClick={e=>handleFees(e,row)}
                      >
                        <PaidIcon />
                      </IconButton>
                      :null}
                      <Popover
                        id={id2}
                        open={open2}
                        anchorEl={anchorEl2}
                        onClose={handleClose2}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left'
                        }}
                      >
                        <Card>
                          <CardContent>
                            Clear Fine?
                            <Button color='error' sx={{ marginLeft: 1, p: 1.5 }} onClick={e => payFine(e, feeData)}>
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
        count={employeeData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        
      />
    </Paper>
  )
}

export default EmployeeMgmtTable
