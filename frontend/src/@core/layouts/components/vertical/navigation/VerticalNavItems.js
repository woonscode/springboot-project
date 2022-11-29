'use client';
// ** Custom Menu Components
import VerticalNavLink from './VerticalNavLink'
import VerticalNavSectionTitle from './VerticalNavSectionTitle'
import {useAtom} from 'jotai'
import {sessionAtom} from '/src/store'
const resolveNavItemComponent = item => {
  if (item.sectionTitle) return VerticalNavSectionTitle
  
  return VerticalNavLink
}

const VerticalNavItems = props => {
  const [userData, setUserData] = useAtom(sessionAtom)
  // ** Props
  const { verticalNavItems } = props
  let showSection = false
  const userRoles = userData?.role

  const RenderMenuItems = verticalNavItems?.map((item, index) => {

    if(item?.sectionTitle){
      switch(item.sectionTitle){
        case "Administration":
          showSection = userRoles?.includes("admin")
          break
        case "Pass Management":
          showSection = userRoles?.includes("gop")
          break
        default:
          showSection = true
      }
    }
    // if (!userRoles.includes("gop") && item.sectionTitle && item.sectionTitle == 'Pass Management') {
    //   showSection = false
    // } else if (!userRoles.includes("admin") && item.sectionTitle && item.sectionTitle == 'Administration') {
    //   showSection = false
    // } else if (item.sectionTitle && item.sectionTitle == 'Support') {
    //   showSection = true
    // }

    if (showSection) {
      const TagName = resolveNavItemComponent(item)
      return <TagName {...props} key={index} item={item} />
    }
  })

  return <>{RenderMenuItems}</>
}

export default VerticalNavItems
