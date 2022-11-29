// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import LightBulbOutline from 'mdi-material-ui/LightbulbOutline'
import  CogOutline  from 'mdi-material-ui/CogOutline'
import CalendarMonthIcon from 'mdi-material-ui/CalendarMonth'
import DoneIcon from '@mui/icons-material/Done'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import LogoutIcon from '@mui/icons-material/Logout';


const navigation = () => {
  return [
    {
      sectionTitle: 'Loan'
    },
    {
      title: 'My Loans',
      icon: HomeOutline,
      path: '/staff/myLoans'
    },
    {
      title: 'Loan History',
      icon: ManageSearchIcon,
      path: '/staff/loanHistory'
    },
    {
      title: 'Loan A Pass',
      icon: CalendarMonthIcon,
      path: '/staff/viewPlaces'
    },
    {
      sectionTitle: 'Pass Management'
    },
    {
      title: 'Collection',
      icon: DoneIcon,
      path: '/gop/collect'
    },
    {
      title: 'Return',
      icon: DoneAllIcon,
      path: '/gop/return'
    },
    {
      sectionTitle: 'Administration'
    },
    {
      title: 'Pass Management',
      icon: CreditCardIcon,
      path: '/admin/pass'
    },
    {
      title: 'Loan Management',
      icon: ReceiptLongIcon,
      path: '/admin/loan'
    },
    {
      title: 'Employee Management',
      icon: GroupIcon,
      path: '/admin/employee'
    },
    {
      title: 'Statistics',
      icon: BarChartIcon,
      path: '/admin/statistics'
    },
    {
      title: 'Template Management',
      icon: DescriptionIcon,
      path: '/admin/templates'
    },
    {
      sectionTitle: 'Support'
    },
    {
      title: 'Log Out',
      icon: LogoutIcon
    }
  ]
}

export default navigation
