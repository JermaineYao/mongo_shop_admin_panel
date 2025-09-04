import { useEffect } from 'react'

// router
import { useNavigate } from 'react-router-dom'

// redux
import { useSelector } from 'react-redux'

export default function Products() {
  const user = useSelector((store) => store.user)
  const nav = useNavigate()

  console.log(user)
  useEffect(() => {
    if (!user.active) nav('/admin_panel/my_account')
  }, [user.active])

  return <div className="page-view">products</div>
}
