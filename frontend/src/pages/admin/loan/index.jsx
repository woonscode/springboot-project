// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import React from 'react'
import Dialog from '@mui/material/Dialog'

// ** Loan Components Imports
import LoanMgmtTable from 'src/views/admin/loan/LoanMgmtTable'
import EditModal from 'src/views/admin/loan/EditModal'
import AddModal from 'src/views/admin/loan/AddModal'

// ** Services
import { getAllLoans } from '/src/services/admin/loan'
import {useAtom} from 'jotai'
import {sessionAtom} from '/src/store'
const LoanManagement = () => {
  const [userData, setUserData] = useAtom(sessionAtom)
  const [loanData, setData] = React.useState([])
  const [modalData, setModalData] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [openAdd, setOpenAdd] = React.useState(false)
  const [updating, setUpdating] = React.useState(false)

  const openModal = (event, modalData) => {
    setOpen(true)
    setModalData(modalData)
  }

  const updateTable = () => {
    setUpdating(true)
    setTimeout(() => {
      setUpdating(false)
    }, 3000)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const openModalAdd = () => {
    setOpenAdd(true)
  }

  const handleCloseAdd = () => {
    setOpenAdd(false)
  }

  React.useEffect(async () => {
    const response = await getAllLoans(userData)
    setData(response)
    
  }, [updating])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>Loan Management</Typography>
          <Typography variant='body2'>Manage the loans of corporate passes</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Loaned Passes' titleTypographyProps={{ variant: 'h6' }} sx={{ pb: 2, pt: 6 }} />
            <LoanMgmtTable
              loanData={loanData}
              openModal={openModal}
              openAddModal={openModalAdd}
              dataUpdate={updateTable}
            />
          </Card>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <EditModal modalData={modalData} dataUpdate={updateTable} />
      </Dialog>
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <AddModal dataUpdate={updateTable} closeModal={handleCloseAdd}/>
      </Dialog>
    </>
  )
}

export default LoanManagement
