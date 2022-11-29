// ** Next Import
import Link from 'next/link'
import {useRouter} from 'next/router';
// ** MUI Imports
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Styled Components
const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const StyledLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = props => {
  // ** Props
  const { verticalNavMenuBranding: userVerticalNavMenuBranding } = props
  const router = useRouter()

  // ** Hooks
  const theme = useTheme()
  
  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: 6 }}>
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <Link href='/' passHref>
          <StyledLink>
          <Box
              component="img"
              sx={{
                height: 35,
                width: 35,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              src="/images/favicon.png"
            />
            <HeaderTitle variant='h6' sx={{ ml: 3 }}>
              {themeConfig.templateName} {router.pathname.split('/')[1]}
            </HeaderTitle>
          </StyledLink>
        </Link>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
