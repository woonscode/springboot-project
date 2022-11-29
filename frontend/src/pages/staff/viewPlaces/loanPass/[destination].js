  // ** React Imports
  import * as React from 'react'
  import { forwardRef, useState, useEffect } from 'react'
  import { useRouter } from 'next/router'
  
  // ** MUI Imports
  import Grid from '@mui/material/Grid'
  import Divider from '@mui/material/Divider';
  import Select from '@mui/material/Select'
  import Button from '@mui/material/Button'
  import MenuItem from '@mui/material/MenuItem'
  import TextField from '@mui/material/TextField'
  import InputLabel from '@mui/material/InputLabel'
  import FormControl from '@mui/material/FormControl'
  import Typography from '@mui/material/Typography'
  import Modal from '@mui/material/Modal';
  import Box from '@mui/material/Box';
  import FormHelperText from '@mui/material/FormHelperText'
  import ArrowBackIcon from '@mui/icons-material/ArrowBack';
  import Dialog from '@mui/material/Dialog';
  import DialogActions from '@mui/material/DialogActions';
  import DialogContent from '@mui/material/DialogContent';
  import DialogContentText from '@mui/material/DialogContentText';
  import DialogTitle from '@mui/material/DialogTitle';
  import List from '@mui/material/List'
  import ListItem from '@mui/material/ListItem'
  
  // ** Date Imports
  import DatePicker from 'react-datepicker'
  import 'react-datepicker/dist/react-datepicker.css'
  import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
  import axios from 'axios';
  import Moment from 'moment';
  
  const LoanPassForm = () => {
    const url = process.env.REACT_BACKEND_URL || "http://localhost:8080/"
    const router = useRouter()
    const destination = router.query.destination

    const handleBack = () => {
      router.back()
    }

    // Get destination details
    const [ description, setDescription ] = useState("")
    const [ imageUrl, setImageUrl ] = useState("")

    const getDestinationDetails = async () => {
      try {
        const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
        const config = { headers: { Authorization: bearer_token } }
        let res = await axios.get(`${url}user/getAllDestinations`, config)

          if (res.status == 200) {
              const destinations = Object.keys(res.data.data).map((key) => res.data.data[key])
              for (let i = 0; i < destinations.length; i++) {
                if (destinations[i]['destination'] == destination) {
                  setDescription(destinations[i]['description'])
                  const tempUrl = destinations[i]['imageBase64']
                  tempUrl == null || tempUrl.length == 0 ? setImageUrl("https://cdn.britannica.com/55/190455-050-E617F64E/Night-view-Singapore.jpg") : "data:image/png;base64," + setImageUrl(tempUrl)
                }
              }
          }
      } catch (e) {
          
      }
    }

    useEffect(() => {
      getDestinationDetails()
    }, [])

    // Get pass details (For admission details)
    const [ admissionDetails, setAdmissionDetails ] = useState("")
    const [ numPassesForPlace, setNumPassesForPlace ] = useState([])

    const getPlaceData = async () => {
      try {
          const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
          const config = { headers: { Authorization: bearer_token } }
          let res = await axios.get(`${url}user/pass/all`, config)

          if (res.status == 200) {
              const passData = res.data.data[destination]
              setAdmissionDetails(passData[0]["admissionDetails"])

              var numPassesList = []
              for (let i = 1; i <= Math.min(passData.length, 2); i++) {
                numPassesList.push(i)
              }
              setNumPassesForPlace(numPassesList)
          }
      } catch (e) {
          
      }
    }

    useEffect(() => {
      getPlaceData()
    }, [])

    // Get form inputs
    const [ numPasses, setNumPasses ] = useState("")

    const newNumPasses = (e) => {
      setNumPasses(e.target.value)
    }

    const [ date, setDate ] = useState("")

    const CustomInput = forwardRef((props, ref) => {
      return <TextField inputRef={ref} label='Loan Date' fullWidth {...props} />
    });

    // Get pass availability and total passes (For next 2 months)
    const [ availableDates, setAvailableDates ] = useState([])

    const getAvailableDates = async () => {
      let dates = []
      const today = Moment()
      const tomorrow = today.clone().add(1, 'days')
      const startDate = tomorrow.format("DD/MM/YYYY")
      const endDate = tomorrow.clone().add(2, 'months').format("DD/MM/YYYY")

      try {
          const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
          const config = { headers: { Authorization: bearer_token } }
          let res = await axios.get(`${url}user/getAvailable?startDate=${startDate}&endDate=${endDate}&destination=${destination}`, config)

          if (res.status == 200) {
            const allDates = res.data.data
            for (var date in allDates) {
              if (date != 'destination' && date != 'totalPasses' && allDates[date].available.count >= numPasses) {
                dates.push(date)
              }
            }
          }
          setAvailableDates(dates)
      } catch (e) {
          
      }
    }

    useEffect(() => {
      if (numPasses != "") {
        getAvailableDates()
      }
    }, [numPasses])


    // Get loan eligibility
    const [ notEligibleLoan, setLoanEligibility ] = useState(false)

    const checkLoanEligibility = async () => {
      try {
        const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
        const config = { headers: { Authorization: bearer_token } }
        const momentDate = Moment(date)
        const month = momentDate.format('M')
        const username = JSON.parse(sessionStorage.getItem("data")).email.split("@")[0]
        let res = await axios.get(`${url}user/loan/loanEligibility/${username}/${month}`, config)
        setLoanEligibility(!res.data.data)
      } catch (e) {
        
      }
    }

    useEffect(() => {
      if (date != "") {
        checkLoanEligibility()
      }
    }, [date])

    // Validate inputs when submit button clicked
    const [ notFilledError, setNotFilledError ] = useState(false)
    const [ invalidDateError, setInvalidDateError ] = useState(false)

    const validateInput = () => {
      const passReady = false;
      const dateReady = false;
      if (numPasses.length == 0) {
        passReady = false;
      } else {
        passReady = true;
      }
      if (date == null || date.length == 0) {
        dateReady = false;
      } else {
        dateReady = true;
      }
      if (dateReady && passReady) {
        const now = new Date()
        const msBetweenDates = date.getTime() - now.getTime()
        const daysBetweenDates = msBetweenDates / (24 * 60 * 60 * 1000)
        const momentDate = Moment(date)
        const formattedDate = momentDate.format("YYYY-MM-DD")
        if (!(daysBetweenDates < 60)) {
          setInvalidDateError(true)
        } else if (!(availableDates.some(item => item == formattedDate))) {
          setWaitlistPopup(true)
        } else {
          submitLoan()
        }
      } else {
        setNotFilledError(true)
      }
    }

    const handleNotFilledErrorClose = () => {
      setNotFilledError(false)
    }

    const handleInvalidDateErrorClose = () => {
      setInvalidDateError(false)
    }

    // Create loan
    const [ creating, setCreating ] = useState(false)
    
    const submitLoan = async () => {
      setCreating(true)
      try {
        const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
        const config = { headers: { Authorization: bearer_token } }
        const email = JSON.parse(sessionStorage.getItem("data")).email
        const finalDate = Moment(date).format('YYYY-MM-DD')
        let res = await axios.post(`${url}user/loan/create`,
          {
            borrowerId: email,
            destination: destination,
            count: numPasses,
            loanDate: finalDate
          }, config)

        if (res.status == 200 || res == "Loan saved") {
          setSuccess(true)
        }
      } catch (e) {
        setUnsuccessfulError(true)
        
      } finally {
        setCreating(false)
      }
    }
    
    // Success Message
    const [ success, setSuccess ] = useState(false)

    const handleSuccessPopup = () => {
      setSuccess(false)
      router.push('/staff/myLoans')
    }

    // Waitlist
    const [ waitlistPopup, setWaitlistPopup ] = useState(false)
    const [ waitlistConfirm, setWaitlistConfirm ] = useState(false)

    const joinWaitlist = async () => {
      setWaitlistPopup(false)
      try {
        const bearer_token = JSON.parse(sessionStorage.getItem("data")).jwt
        const config = { headers: { Authorization: bearer_token } }
        const email = JSON.parse(sessionStorage.getItem("data")).email
        const finalDate = Moment(date).format('DD/MM/YYYY')
        let res = await axios.post(`${url}user/waitlist`,
          {
            destination: destination,
            email: email,
            date: finalDate
          }, config)

          if (res.status == 200) {
            setWaitlistConfirm(true)
          }
      } catch (e) {
        setGeneralError(true)
      }
    }

    const handleCloseJoinWaitlist = () => {
      setWaitlistPopup(false)
    }
    
    const handleCloseWaitlistConfirm = () => {
      setWaitlistConfirm(false)
      router.push('/staff/myLoans')
    }

    // General Error
    const [ generalError, setGeneralError ] = useState(false)
    
    const handleGeneralErrorClose = () => {
      setGeneralError(false)
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
          <Typography variant='h5'>Loan a pass for { destination }</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} md={6} padding={5}>
          <Grid item xs={12} sx={{ paddingTop:"100 !important"}}>
            <Box 
              component="img"
              src={ imageUrl }
              sx={{ width:"90%" }}
            />
            <Typography variant='h6' paddingTop={5}>About the place</Typography>
            <Typography variant='body2'>{ description }</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} padding={5}>
          <form>
            <Grid item xs={12}>
              <Typography variant='h6'>How many passes do you need?</Typography>
              <Typography variant='body2'>Please note that one pass grants access to {admissionDetails} people.</Typography>
            </Grid>
            <Grid item xs={12} paddingTop={3}>
              <FormControl fullWidth>
                <InputLabel id='numPasses-label'>Number of Passes</InputLabel>
                <Select id='numPasses' label='Number of Passes' value={numPasses} onChange={newNumPasses} >
                    {
                      numPassesForPlace.length != 0 ? numPassesForPlace.map((number, key) => {
                        return <MenuItem value={number} key={key}>{number}</MenuItem>
                      }) : <MenuItem disabled={true}>No Passes Available</MenuItem>
                    }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} paddingTop={3}>
              <Typography variant='h6'>When is your loan for?</Typography>
            </Grid>
            <Grid item xs={12} paddingTop={2}>
              <DatePickerWrapper>
                <DatePicker
                    selected={date}
                    showYearDropdown
                    showMonthDropdown
                    id='loan-date'
                    placeholderText='MM-DD-YYYY'
                    minDate={Moment().add('days', 1).toDate()}
                    maxDate={Moment().add('days', 56).toDate()}
                    customInput={<CustomInput />}
                    onChange={date => setDate(date)}
                    
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={12} paddingTop={5}>
              <Typography variant='h6'>Terms & Conditions</Typography>
              <Typography variant='body2'>By confirming your loan, you are agreeing to adhere to the below Terms & Conditions.</Typography>
            </Grid>
            <Grid item xs={12} sm={12} sx={{ paddingBottom: 4 }} paddingTop={3}>
              <List>
                <ListItem>1. Only employees of Singapore Sports School may loan passes.</ListItem>
                <ListItem>2. Employees can only collect physical passes 1 day in advance from the General Office, from the date of your loan.</ListItem>
                <ListItem>3. Employees must return the physical passes by 9AM the following working day to the General Office.</ListItem>
                <ListItem>4. On weekends when the General Office is closed, please collect the passes on Friday during work hours.</ListItem>
                <ListItem>5. Should there be a borrower of the pass the day of your collection, please contact them to arrange self-pick up of the passes.</ListItem>
                <ListItem>6. Losing the pass would incur a replacement fee, payable to the General Office.</ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button variant='contained' onClick={validateInput}  disabled={ notEligibleLoan ? true : false }>
                { creating ? "Loading..." : "Confirm Loan" }
              </Button>
              {
                notEligibleLoan ? 
                  <FormHelperText>
                    You have exceeded the number of loans permitted per month.
                  </FormHelperText>
                : null
              }
            </Grid>
          </form>
        </Grid>
        <Dialog
          open={notFilledError}
          onClose={handleNotFilledErrorClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Incomplete Submission!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please ensure all fields are filled.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNotFilledErrorClose} autoFocus>
              Got It
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={invalidDateError}
          onClose={handleInvalidDateErrorClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Invalid Date!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              As per T&C, employees are only able to loan passes a maximum of 2 months in advance and a minimum of 1 day in advance. Please pick a different date.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleInvalidDateErrorClose} autoFocus>
              Got It
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={waitlistPopup}
          onClose={handleCloseJoinWaitlist}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Insufficient passes available..."}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Insufficient passes are available. Try reducing the number of passes you need. Optionally, join the waitlist and we will notify you via email if any passes become available!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={joinWaitlist} autoFocus>
              Join Waitlist
            </Button>
            <Button onClick={handleCloseJoinWaitlist} autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={waitlistConfirm}
          onClose={handleCloseWaitlistConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"You've joined the waitlist!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              We will notify you via email if a pass becomes available.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseWaitlistConfirm} autoFocus>
              Got It
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={generalError}
          onClose={handleGeneralErrorClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Something happened!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              An unexpected error occurred, please try again later.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleGeneralErrorClose} autoFocus>
              Got It
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={success}
          onClose={handleSuccessPopup}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Loaned Successfully!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              View details of your loan in 'My Loans'. Have a good time!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSuccessPopup} autoFocus>
              Ok!
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      )
  }
   
export default LoanPassForm