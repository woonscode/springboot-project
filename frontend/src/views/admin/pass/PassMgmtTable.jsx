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
import WrongLocationIcon from '@mui/icons-material/WrongLocation'
import Grid from '@mui/material/Grid'
import Popover from '@mui/material/Popover'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { useAtom } from 'jotai'
import { sessionAtom } from '/src/store'
// Delete Pass
import { deletePass, reportPass } from '/src/services/admin/pass'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt'
import { getAllUser } from 'src/services/admin/employee'
function PassMgmtTable({ passData, openModal, openAddModal, openLocationModal, dataUpdate, sessionStorage }) {
  // ** States

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [userData, setUserData] = useAtom(sessionAtom)
  const [currentPassId, setCurrentPassId] = useState(null)

  // Popper
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event, passId) => {
    setAnchorEl(event.currentTarget)
    setCurrentPassId(passId)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  // Popper2
  const [anchorEl2, setAnchorEl2] = useState(null)

  const handleClick2 = (event, passId) => {
    setAnchorEl2(event.currentTarget)
    setCurrentPassId(passId)
  }

  const handleClose2 = () => {
    setAnchorEl2(null)
  }

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

  const deleteAPass = async e => {
    await deletePass(userData, currentPassId)
    dataUpdate()
    handleClose()
  }
  const reportAPass = async e => {
    await reportPass(userData, currentPassId, chosenLostEmployee)
    dataUpdate()
    handleClose2()
  }

  // Employees
  const [employees, setEmployees] = useState([])
  const [chosenLostEmployee, setChosenLostEmployee] = useState(null)
  const handleChange = (event) => {
    setChosenLostEmployee(event.target.value);
  };
  useEffect(async () => {
    await getAllUser(userData).then(res => {
      const emp = res.map(e => {
        return { name: e.name, id: e.empId,email: e.email }
      })
      setEmployees(emp)
    })
  }, [])
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
              <Grid item lg={10}>
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
              <Grid item lg={1}>
                <Button
                  variant='contained'
                  sx={{ background: '#eca658 !important', maxWidth: '40%' }}
                  onClick={openLocationModal}
                >
                  <AddLocationAltIcon style={{ fill: '#fff' }} />
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
              <TableCell>PassId</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Replacement Fee</TableCell>
              <TableCell>Details</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {passData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .sort(row => row.status)
              .map(row => {
                return (
                  row.destination.toLowerCase().includes(searchQuery.toLowerCase()) && (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.passId}>
                      <TableCell>{row.passId}</TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 50, // percentage also works
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {row.destination}
                      </TableCell>
                      <TableCell>{row.status.toUpperCase()}</TableCell>
                      <TableCell>${parseFloat(row.replacementFee).toFixed(2)}</TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 150, // percentage also works
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {row.admissionDetails}
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        <IconButton
                          aria-describedby={id}
                          size='small'
                          variant='contained'
                          // sx={{color: 'white !important', background: '#ff9 !important'}}
                          onClick={event => openModal(event, row)}
                        >
                          <EditIcon />
                        </IconButton>
                        {row.status !== 'Lost' ? (
                          <>
                            <IconButton
                              size='small'
                              variant='contained'
                              color='warning'
                              onClick={e => handleClick2(e, row.passId)}
                            >
                              <WrongLocationIcon />
                            </IconButton>
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
                                  Report Lost?
                                  <FormControl fullWidth sx={{mt:4}}>
                                    <InputLabel id='demo-simple-select-label'>Employee</InputLabel>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      id='demo-simple-select'
                                      value={chosenLostEmployee}
                                      label='Destination'
                                      onChange={handleChange}
                                    >
                                      {employees.map(emp => (
                                        <MenuItem value={emp.email}>{emp.name}</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  <Button color='warning' sx={{ marginLeft: 1, p: 1.5 }} onClick={e => reportAPass(e)}>
                                    Confirm
                                  </Button>
                                </CardContent>
                              </Card>
                            </Popover>
                          </>
                        ) : null}
                        <IconButton
                          size='small'
                          variant='contained'
                          sx={{ color: '#FC3D39 !important' }}
                          onClick={e => handleClick(e, row.passId)}
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
                              Delete this pass?
                              <Button color='error' sx={{ marginLeft: 1, p: 1.5 }} onClick={e => deleteAPass(e)}>
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
        count={passData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default PassMgmtTable
