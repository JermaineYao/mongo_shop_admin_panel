import { useState } from 'react'
// // router
import { useNavigate, useParams } from 'react-router-dom'
// // mui
import { CircularProgress } from '@mui/material'
// // ui
import InputLabelDynamic from '../components/ui/InputLabelDynamic'
// utils
import { isValidPwd } from '../utils/utils'
// // hook
import { useError } from '../hook/useError'
// api
import { resetPwdApi } from '../api/user'
// redux
import { useDispatch } from 'react-redux'
import { setMsg, toggleMsg } from '../store/slice/msgSlice'
// component
import Logo from '@comp/Logo'

export default function SetPwdFromLink() {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const handleError = useError()
  const pwdRule = '至少 8位元、至少包含一個大寫、小寫英文字母、數字、特殊字元'

  // 新密碼
  const [newPWD, setNewPwd] = useState('')
  const [alertMsg, setAlertMsg] = useState('')

  function newPwdBlur(e) {
    const v = e.target.value.trim()

    if (v.length === 0) {
      setAlertMsg('新密碼必填')
      return
    }

    const check = isValidPwd(v)
    if (!check) {
      setAlertMsg(pwdRule)
      return
    }

    setAlertMsg('')
  }

  // 設定新密碼
  const [loading, setLoading] = useState(false)
  const { token } = useParams()

  function resetPwd() {
    if (loading) return

    if (newPWD.length === 0) {
      setAlertMsg('新密碼必填')
      return
    }

    const check = isValidPwd(newPWD)
    if (!check) {
      setAlertMsg(pwdRule)
      return
    }

    setLoading(true)

    const query = { newPWD, token }
    resetPwdApi(query)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false)

          dispatch(toggleMsg({ open: true }))
          dispatch(
            setMsg({
              msg: '密碼已修改',
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
    <div id="set-pwd" className="page">
      <div className="set-pwd-container">
        <Logo large={true}></Logo>

        <div className="page-show active">
          <div id="set-pwd-wrap">
            <InputLabelDynamic
              name="新密碼"
              type="password"
              value={newPWD}
              onChange={setNewPwd}
              onBlur={newPwdBlur}
              alertMsg={alertMsg}
            ></InputLabelDynamic>

            <div className="action-container">
              <div className="btn" onClick={resetPwd}>
                {loading ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  <span>設定新密碼</span>
                )}
              </div>
              <span className="home-toggle" onClick={() => nav('/')}>
                回登入頁面
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
