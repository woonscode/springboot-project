// ** React Imports
import * as React from 'react'
import { forwardRef, useState } from 'react'
import { useRouter } from 'next/router'
import Moment from 'moment';

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AccountSync } from 'mdi-material-ui';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import axios from 'axios';

const ViewLoan = (props) => {

    const url = process.env.REACT_BACKEND_URL || "http://localhost:8080/"
    const router = useRouter()
    const data = JSON.parse(router.query.data)
    const [ openWithdraw, setOpenWithdraw ] = useState(false)
    const [ openSuccess, setOpenSuccess ] = useState(false)

    const handleBack = () => {
        router.back()
    }

    const handleOpenWithdrawPopup = () => {
        setOpenWithdraw(true)
    }

    const handleCloseWithdrawPopup = () => {
        setOpenWithdraw(false)
    }

    const withdrawLoan = async () => {
        try {
            const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
            const loanID = data.loanId
            let res = await axios.delete(`${url}user/loan/${loanID}`, {
                headers: {
                    'Authorization': `Bearer ${bearer_token}`
                }
            })

            if (res.status == 200) {
                setOpenWithdraw(false)
                setOpenSuccess(true)
            }
        } catch (e) {
            
        }
    }

    const handleClosePopup = () => {
        setOpenSuccess(false)
        router.push('/staff/myLoans')
    }


    return (
        <Grid container spacing={6}>
        <Grid item xs={12} >
          <Button variant="text" onClick={handleBack}>
            <ArrowBackIcon/>
            <Typography variant='body'>Go Back</Typography>
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5'>Your Loan Details</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} md={6} padding={5}>
            <Grid item xs={12} paddingBottom={3}>
                <Typography variant='h6'>Your Loan</Typography>
            </Grid>
            <Grid item xs={12} paddingBottom={3}>
                <Typography variant='body' paddingTop={5}>Destination: { data.passes[0].destination }</Typography><br/>
                <Typography variant='body'>Loan Date: { Moment( data.loanDate ).format('DD MMM YYYY') }</Typography><br/>
                <Typography variant='body'>Number of Passes: { data.passes.length }</Typography>
            </Grid>
            <Grid item xs={12} paddingBottom={3}>
                <Typography variant='h6'>Pass Collection Details</Typography>
                <Typography variant='body2'>You have booked {data.passes.length} pass(es) in total. Information on collection for each pass is as follows. Please note that collection from the General Office is only available on weekdays.</Typography>
            </Grid>
            <Grid item xs={12} paddingBottom={7}>
                {
                    data.passCollectionDetails.map((pass, key) => {
                        return (
                            <div>
                                <Typography variant='body' key={key}>Pass ID: { pass.passId }</Typography>
                                <br/>
                                <Typography variant='body'>Collect From: { pass.collectFrom }</Typography>
                                <br/>
                                {
                                    pass.contact != null ? <Typography variant='body'>Contact: { pass.contact }</Typography> : null
                                }
                                <br/><br/>
                            </div>
                        )
                    })
                }
            </Grid>
            <Grid item xs={12} paddingBottom={3}>
                <Button variant='contained' onClick={handleOpenWithdrawPopup} >
                    Withdraw Loan
                </Button>
            </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                <Typography variant='h6'>Terms & Conditions</Typography>
                </Grid>
                <Grid item xs={12} sm={12} sx={{ paddingBottom: 4 }}>
                <List>
                    <ListItem>1. Only employees of Singapore Sports School may loan passes.</ListItem>
                    <ListItem>2. Employees can only collect physical passes 1 day in advance from the General Office, from the date of your loan.</ListItem>
                    <ListItem>3. Employees must return the physical passes by 9AM the following working day to the General Office.</ListItem>
                    <ListItem>4. On weekends when the General Office is closed, please collect the passes on Friday during work hours.</ListItem>
                    <ListItem>5. Should there be a borrower of the pass the day of your collection, please contact them to arrange self-pick up of the passes.</ListItem>
                    <ListItem>6. Losing the pass would incur a replacement fee, payable to the General Office.</ListItem>
                </List>
                </Grid>
            </Grid>
            <Dialog
                open={openWithdraw}
                onClose={handleCloseWithdrawPopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Withdrawal"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                     Are you sure you want to withdraw this loan?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseWithdrawPopup}>
                    Cancel
                    </Button>
                    <Button onClick={withdrawLoan} autoFocus>
                    Withdraw
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openSuccess}
                onClose={handleClosePopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">
                    {"Loan Withdrawn!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                     You will be redirected to your loans page.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopup}>
                        Got it
                    </Button>
                </DialogActions>
            </Dialog>
        
      </Grid>
    )
}

export default ViewLoan