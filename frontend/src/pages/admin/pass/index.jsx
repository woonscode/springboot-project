// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'
import PassMgmtTable from 'src/views/admin/pass/PassMgmtTable'
import React from 'react'
import { getAllPasses } from '/src/services/admin/pass'
import EditModal from 'src/views/admin/pass/EditModal'
import AddModal from 'src/views/admin/pass/AddModal'
import LocationModal from 'src/views/admin/pass/LocationModal'
function PassManagement() {
  const [passData, setData] = React.useState([])
  const [modalData, setModalData] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [openAdd, setOpenAdd] = React.useState(false)
  const [openLocation, setOpenLocation] = React.useState(false)
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

  const openLocationModal = () => {
    setOpenLocation(true)
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
  const handleCloseLocation = () => {
    setOpenLocation(false)
  }
  React.useEffect(async () => {
    if (sessionStorage) {
      const data = JSON.parse(sessionStorage.getItem('data'))
      const response = await getAllPasses(data)
      setData(Object.values(response).flat())
    }
  }, [updating])
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>Pass Management</Typography>
          <Typography variant='body2'>Manage the passes</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Pass Management' titleTypographyProps={{ variant: 'h6' }} sx={{ pb: 2, pt: 6 }} />
            <PassMgmtTable
              passData={passData}
              openModal={openModal}
              openAddModal={openModalAdd}
              openLocationModal={openLocationModal}
              dataUpdate={updateTable}
            />
          </Card>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <EditModal modalData={modalData} dataUpdate={updateTable} closeModal={handleClose}/>
      </Dialog>
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <AddModal dataUpdate={updateTable} closeModal={handleCloseAdd}/>
      </Dialog>
      <Dialog open={openLocation} onClose={handleCloseLocation}>
        <LocationModal dataUpdate={updateTable} closeModal={handleCloseLocation}/>
      </Dialog>
    </>
  )
}

export default PassManagement
