import { useState } from 'react'
// mui
import { CircularProgress } from '@mui/material'
// ui
import InputLabelDynamic from '../ui/InputLabelDynamic'
// utils
import { isValidEmail } from '../../utils/utils'
// hook
import { useError } from '../../hook/useError'
// api
import { forgotPwdApi } from '../../api/user'
// redux
import { useDispatch } from 'react-redux'
import { setMsg, toggleMsg } from '../../store/slice/msgSlice'

export default function ForgotPwd(props) {
  const { toSignIn } = props
  const dispatch = useDispatch()
  const handleError = useError()

  // email
  const [email, setEmail] = useState('')
  const [emailAlertMsg, setEmailAlertMsg] = useState('')

  function emailBlur(e) {
    const v = e.target.value.trim()

    if (v.length > 0) {
      setEmailAlertMsg('')
    }

    if (v.length === 0) {
      setEmailAlertMsg('信箱必填')
      return
    }

    const check = isValidEmail(v)
    if (!check) setEmailAlertMsg('信箱格式錯誤')
  }

  // 發送 email
  const [loading, setLoading] = useState(false)

  function forgotPwd() {
    if (loading) return

    if (email.length === 0) {
      setEmailAlertMsg('信箱必填')
      return
    }

    const check = isValidEmail(email)
    if (!check) {
      setEmailAlertMsg('信箱格式錯誤')
      return
    }

    setLoading(true)

    const query = { email }
    forgotPwdApi(query)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false)

          dispatch(toggleMsg({ open: true }))
          dispatch(
            setMsg({
              msg: '已發送連結至信箱, 請在 10分鐘內點擊連結, 並完成密碼設定',
              severity: 'success'
            })
          )
        }
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
    <div id="forgot-pwd" className="page-transition">
      <InputLabelDynamic
        name="Email"
        value={email}
        onChange={setEmail}
        onBlur={emailBlur}
        alertMsg={emailAlertMsg}
      ></InputLabelDynamic>

      <div className="action-container">
        <div className="btn" onClick={forgotPwd}>
          {loading ? (
            <CircularProgress size={20} sx={{ color: 'white' }} />
          ) : (
            <span>發送信件</span>
          )}
        </div>
        <span className="send-email">將發送設密碼設定連結至信箱</span>

        <span className="home-toggle" onClick={toSignIn}>
          回登入畫面
        </span>
      </div>
    </div>
  )
}
