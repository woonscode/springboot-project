// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'

// ** Demo Components Imports
import EmployeeMgmtTable from 'src/views/admin/employee/EmployeeMgmtTable'
import React from 'react'
import { getAllUser } from '/src/services/admin/employee'

// ** Import Modals
import AddModal from 'src/views/admin/employee/AddModal'
import ImportModal from 'src/views/admin/employee/ImportModal'
import EditModal from 'src/views/admin/employee/EditModal'
import RoleModal from 'src/views/admin/employee/RoleModal'

function EmployeeManagement() {
  const [employeeData, setData] = React.useState([])
  const [modalData, setModalData] = React.useState([])
  const [updating, setUpdating] = React.useState(false)
  const updateTable = () => {
    setUpdating(true)
    setTimeout(() => {
      setUpdating(false)
    }, 3000)
  }
  // Add Modal
  // const [openAdd, setOpenAdd] = React.useState(false)
  // const openModalAdd = () => {
  //   setOpenAdd(true)
  // }
  // Edit Modal
  const [openEdit, setOpenEdit] = React.useState(false)
  const openModalEdit = (event, modalData) => {
    setOpenEdit(true)
    setModalData(modalData)
  }
  // Import Modal
  const [openImport, setOpenImport] = React.useState(false)
  const openModalImport = (event, modalData) => {
    setOpenImport(true)
    setModalData(modalData)
  }
  // Roles Modal
  const [openRole, setOpenRole] = React.useState(false)
  const openModalRole = (event, modalData) => {
    setOpenRole(true)
    setModalData(modalData)
  }
  // Close Modals
  const handleClose = ()  => {
    setOpenEdit(false)
    setOpenImport(false)
    setOpenRole(false)
  }


  React.useEffect(async () => {
    if (sessionStorage) {
      const data = JSON.parse(sessionStorage.getItem('data'));
      const response = await getAllUser(data);
      setData(response)
    }
  }, [updating])
  return (
    <>
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Employee Management</Typography>
        <Typography variant='body2'>Manage the employees rights access</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Employee Management' titleTypographyProps={{ variant: 'h6' }} sx={{ pb: 2, pt: 6 }} />
          <EmployeeMgmtTable  
            employeeData={employeeData} 
            dataUpdate={updateTable}
            // openModalAdd={openModalAdd}
            openModalEdit={openModalEdit}
            openModalImport={openModalImport}
            openModalRole={openModalRole}
            handleClose={handleClose}

          />
        </Card>
      </Grid>
    </Grid>
    {/* <Dialog open={openAdd} onClose={handleClose}>
      <AddModal dataUpdate={updateTable} />
    </Dialog> */}
    <Dialog open={openEdit} onClose={handleClose}>
      <EditModal dataUpdate={updateTable} modalData={modalData} closeModal={handleClose}/>
    </Dialog>
    <Dialog open={openImport} onClose={handleClose}>
      <ImportModal dataUpdate={updateTable} closeModal={handleClose}/>
    </Dialog>
    <Dialog open={openRole} onClose={handleClose}>
      <RoleModal dataUpdate={updateTable} modalData={modalData} closeModal={handleClose}/>
    </Dialog>
    </>
  )
}

export default EmployeeManagement
