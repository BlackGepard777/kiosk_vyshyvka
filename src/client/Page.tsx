
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router'
import './Page.css'


function Page({children}: {children?: React.ReactNode}) {
  return (
    <>
      <main>
        {children}
      </main>
    </>
  )
}

export default Page