// router
import { Outlet } from 'react-router-dom'
// component
import NavBar from '../../components/adminPanel/NavBar'

export default function AdminPanel() {
  return (
    <div id="admin-panel">
      <NavBar></NavBar>

      <Outlet></Outlet>
    </div>
  )
}
