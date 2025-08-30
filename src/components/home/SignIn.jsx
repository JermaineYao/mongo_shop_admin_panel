import { useState } from 'react'

import InputLabelDynamic from '../ui/InputLabelDynamic'

export default function SignIn(props) {
  const { toForgotPwd } = props

  const [account, setAccount] = useState('')
  const [pwd, setPwd] = useState('')

  const [accountAlterMsg, setAccountAlterMsg] = useState('')
  const [pwdAlterMsg, setPwdAlterMsg] = useState('')

  function accountOnBlur(e) {
    const v = e.target.value.trim()
    v.length > 0 ? setAccountAlterMsg('') : setAccountAlterMsg('帳號必填')
  }

  function pwdOnBlur(e) {
    const v = e.target.value.trim()
    v.length > 0 ? setPwdAlterMsg('') : setPwdAlterMsg('密碼必填')
  }

  return (
    <div id="sign-in">
      <InputLabelDynamic
        name="帳號"
        value={account}
        onChange={setAccount}
        onBlur={accountOnBlur}
        alertMsg={accountAlterMsg}
      ></InputLabelDynamic>

      <InputLabelDynamic
        name="密碼"
        type="password"
        value={pwd}
        onChange={setPwd}
        onBlur={pwdOnBlur}
        alertMsg={pwdAlterMsg}
      ></InputLabelDynamic>

      <div className="action-container">
        <div className="btn">
          <span>登入</span>
        </div>
        <span className="home-toggle" onClick={() => toForgotPwd()}>
          忘記密碼?
        </span>
      </div>
    </div>
  )
}
