// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2, fontSize:"14px" }}>
        {`© ${new Date().getFullYear()}, Created by `}
        <Box component='span' sx={{ color: 'error.main' }}>
          🏅
        </Box>
        <Link>
          SMU OOP Team 2
        </Link>
      </Typography>
      
    </Box>
  )
}

export default FooterContent
