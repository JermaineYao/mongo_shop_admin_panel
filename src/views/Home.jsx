import { useState, useEffect } from 'react'
// redux
import { useDispatch } from 'react-redux'
import { resetUser } from '../store/slice/userSlice'
// component
import Logo from '../components/Logo'
import SignIn from '../components/home/SignIn'
import ForgotPwd from '../components/home/ForgotPwd'

export default function Home() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(resetUser())
  }, [dispatch])

  const [forgotPwd, setForgotPwd] = useState(false)

  function toForgotPwd() {
    setForgotPwd(true)
  }

  function toSignIn() {
    setForgotPwd(false)
  }

  return (
    <div id="home" className="page">
      <div className="home-container">
        <Logo large={true}></Logo>

        <div className={`page-show ${!forgotPwd ? 'active' : ''}`}>
          <SignIn toForgotPwd={toForgotPwd}></SignIn>
        </div>

        <div className={`page-show ${forgotPwd ? 'active' : ''}`}>
          <ForgotPwd toSignIn={toSignIn}></ForgotPwd>
        </div>
      </div>
    </div>
  )
}
