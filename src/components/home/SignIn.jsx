import { useState } from 'react'
// router
import { useNavigate } from 'react-router-dom'
// mui
import { CircularProgress } from '@mui/material'
// ui
import InputLabelDynamic from '../ui/InputLabelDynamic'
// hook
import { useError } from '../../hook/useError'
// api
import { loginApi } from '../../api/user'

export default function SignIn(props) {
  const { toForgotPwd } = props
  const nav = useNavigate()
  const handleError = useError()

  // 帳號
  const [account, setAccount] = useState('')
  const [accountAlterMsg, setAccountAlterMsg] = useState('')

  function accountOnBlur(e) {
    const v = e.target.value.trim()
    v.length > 0 ? setAccountAlterMsg('') : setAccountAlterMsg('帳號必填')
  }

  // 密碼
  const [pwd, setPwd] = useState('')
  const [pwdAlterMsg, setPwdAlterMsg] = useState('')

  function pwdOnBlur(e) {
    const v = e.target.value.trim()
    v.length > 0 ? setPwdAlterMsg('') : setPwdAlterMsg('密碼必填')
  }

  // 登入
  const [loading, setLoading] = useState(false)

  function login() {
    if (loading) return

    if (account.length === 0) setAccountAlterMsg('帳號必填')
    if (pwd.length === 0) setPwdAlterMsg('密碼必填')
    if (account.length === 0 || pwd.length === 0) return

    const query = {
      account,
      pwd
    }

    setLoading(true)

    loginApi(query)
      .then((res) => {
        console.log(res)
        if (res.status === 200) nav('/dashboard')
      })
      .catch((err) => {
        setLoading(false)
        handleError(err)
      })
      .finally(() => {
        setLoading(false)
      })
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
        <div className="btn" onClick={login}>
          {loading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            <span>登入</span>
          )}
        </div>
        <span className="home-toggle" onClick={() => toForgotPwd()}>
          忘記密碼?
        </span>
      </div>
    </div>
  )
}
