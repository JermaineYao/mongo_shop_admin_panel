// router
import { useLocation } from 'react-router-dom'
// component
import PageTitle from '@comp/adminPanel/PageTitle'
import Account from '@comp/adminPanel/Account'

export default function MyAccount() {
  const title = useLocation().state.name

  return (
    <div className="page-view">
      <PageTitle title={title}></PageTitle>
      <Account></Account>
    </div>
  )
}
