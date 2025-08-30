import { useState } from 'react'

import Logo from '@comp/Logo'
import SignIn from '@comp/home/SignIn'
import ForgotPwd from '@comp/home/ForgotPwd'

export default function Home() {
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
