import { useState, useReducer, useEffect } from 'react'
// router
import { useLocation } from 'react-router-dom'
// ui
import LoadingCover from '@comp/ui/LoadingCover'
// mui
import TextField from '@mui/material/TextField'
// utils
import { isValidPwd } from '@/utils/utils'
// hook
import { useError } from '@/hook/useError'
// api
import { queryMyAccountApi, changePwdApi } from '@/api/user'
// reducer
import { initPwd, pwdReducer } from '@/reducer/pwd'
// redux
import { useSelector, useDispatch } from 'react-redux'
import { setMsg, toggleMsg } from '@/store/slice/msgSlice'
import { setUser, setUserInfo } from '@/store/slice/userSlice'
// component
import PageTitle from '@comp/adminPanel/PageTitle'
import Info from '@comp/adminPanel/user/Info'
import Contact from '@comp/adminPanel/user/Contact'

export default function MyAccount() {
  const title = useLocation().state.name

  const dispatch = useDispatch()
  const user = useSelector((store) => store.user)

  const handleError = useError()

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    if (!user.userId) queryAccount({ signal })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userId])

  // 取得帳號資料
  const [accountLoading, setAccountLoading] = useState(false)

  function queryAccount({ signal }) {
    if (accountLoading) return
    setAccountLoading(true)

    queryMyAccountApi({ signal })
      .then((res) => {
        if (res.status === 200) {
          const resData = res.data.data

          dispatch(setUser(resData))
        }
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        setAccountLoading(false)
      })
  }

  // 更新 state
  function updateState(fieldName, value) {
    dispatch(setUserInfo({ field: fieldName, value }))
  }

  // 更改密碼
  const pwdRule = '至少 8位元、至少包含一個大寫、小寫英文字母、數字、特殊字元'
  const notTheSame = '密碼確認不一致'
  const [pwdLoading, setPwdLoading] = useState(false)
  const [editPwd, setEditPwd] = useState(false)
  const [pwd, pwdDispatch] = useReducer(pwdReducer, initPwd)

  function checkPwdInputs() {
    const allFilled =
      pwd.pwdCurrent.length > 0 && pwd.pwd.length > 0 && pwd.confirmPwd.length > 0

    const allChecked =
      pwd.pwdCurrentErr.length === 0 &&
      pwd.pwdErr.length === 0 &&
      pwd.confirmErr.length === 0

    return allFilled && allChecked ? true : false
  }

  function cancelEditPwd() {
    pwdDispatch({ type: 'clear' })
    setEditPwd(false)
  }

  function enableEditPwd() {
    setEditPwd(true)
  }

  // 原密碼
  function pwdCurrentOnBlur(e) {
    const pwdCurrent = e.target.value.trim()
    const check = isValidPwd(pwdCurrent)

    if (!check) {
      pwdDispatch({ type: 'update', field: 'pwdCurrentErr', payload: pwdRule })

      return
    }

    pwdDispatch({ type: 'update', field: 'pwdCurrentErr', payload: '' })
    pwdDispatch({ type: 'update', field: 'pwdCurrent', payload: pwdCurrent })
  }

  // 新密碼
  function pwdOnBlur(e) {
    const newPwd = e.target.value.trim()
    const check = isValidPwd(newPwd)

    if (!check) {
      pwdDispatch({ type: 'update', field: 'pwdErr', payload: pwdRule })

      return
    }

    if (pwd.confirmPwd.length > 0 && newPwd !== pwd.confirmPwd) {
      pwdDispatch({ type: 'update', field: 'confirmErr', payload: notTheSame })

      return
    }

    if (pwd.confirmPwd.length > 0 && newPwd === pwd.confirmPwd) {
      pwdDispatch({ type: 'update', field: 'confirmErr', payload: '' })
    }

    pwdDispatch({ type: 'update', field: 'pwdErr', payload: '' })
    pwdDispatch({ type: 'update', field: 'pwd', payload: newPwd })
  }

  // 確認新密碼
  function confirmOnBlur(e) {
    const confirm = e.target.value.trim()
    const check = isValidPwd(confirm)

    if (!check) {
      pwdDispatch({ type: 'update', field: 'confirmErr', payload: pwdRule })

      return
    }

    if (confirm !== pwd.pwd) {
      pwdDispatch({ type: 'update', field: 'confirmErr', payload: notTheSame })

      return
    }

    pwdDispatch({ type: 'update', field: 'confirmErr', payload: '' })
    pwdDispatch({ type: 'update', field: 'confirmPwd', payload: confirm })
  }

  function changePwd() {
    const check = checkPwdInputs()
    if (!check) return
    if (pwdLoading) return

    setPwdLoading(true)

    const query = {
      pwdCurrent: pwd.pwdCurrent,
      newPWD: pwd.pwd
    }

    changePwdApi(query)
      .then((res) => {
        cancelEditPwd()
        const msg = res.data.msg

        dispatch(toggleMsg({ open: true }))
        dispatch(
          setMsg({
            msg,
            severity: 'success'
          })
        )
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        setPwdLoading(false)
      })
  }

  return (
    <div className="page-view">
      <PageTitle title={title}></PageTitle>

      <main id="account" className="extend loading-container scroll-wrap-y">
        <LoadingCover open={accountLoading} />

        <section className="account-container">
          {/*----- account, email, role, active, photo -----*/}
          <Info
            userInfo={{
              account: user.account,
              email: user.email,
              role: user.role,
              active: user.active,
              photo: user.photo,
              userId: user.userId
            }}
            isEditable={true}
            updateState={updateState}
          ></Info>

          {/*----- address, phoneNumber -----*/}
          <Contact
            userInfo={{
              address: user.address,
              phoneNumber: user.phoneNumber,
              userId: user.userId
            }}
            isEditable={true}
            updateState={updateState}
          ></Contact>

          {/*----- pwd -----*/}
          <section className="account-pwd-container loading-container account-wrap">
            <LoadingCover open={pwdLoading} />

            <div className="caption-wrap">
              <span className="caption">變更密碼</span>

              <div className="action-wrap">
                {!editPwd ? (
                  <div className="btn" onClick={enableEditPwd}>
                    <span>修改</span>
                  </div>
                ) : (
                  <div className="btn" onClick={changePwd}>
                    <span>儲存</span>
                  </div>
                )}

                {!editPwd ? null : (
                  <div className="btn" onClick={cancelEditPwd}>
                    <span>取消</span>
                  </div>
                )}
              </div>
            </div>

            {editPwd ? (
              <article className="account-pwd-wrap">
                <div className="account-pwd-item">
                  <TextField
                    type="password"
                    key={pwd.pwdCurrent || ''}
                    defaultValue={pwd.pwdCurrent || ''}
                    label="原密碼"
                    variant="standard"
                    error={Boolean(pwd.pwdCurrentErr)}
                    helperText={pwd.pwdCurrentErr || ' '}
                    onBlur={(e) => pwdCurrentOnBlur(e)}
                  />
                </div>

                <div className="account-pwd-item">
                  <TextField
                    type="password"
                    key={pwd.pwd || ''}
                    defaultValue={pwd.pwd || ''}
                    label="新密碼"
                    variant="standard"
                    error={Boolean(pwd.pwdErr)}
                    helperText={pwd.pwdErr || ' '}
                    onBlur={(e) => pwdOnBlur(e)}
                  />
                </div>

                <div className="account-pwd-item">
                  <TextField
                    type="password"
                    key={pwd.confirmPwd || ''}
                    defaultValue={pwd.confirmPwd || ''}
                    label="確認新密碼"
                    variant="standard"
                    error={Boolean(pwd.confirmErr)}
                    helperText={pwd.confirmErr || ' '}
                    onBlur={(e) => confirmOnBlur(e)}
                  />
                </div>
              </article>
            ) : (
              <article className="account-pwd-wrap">
                <div className="account-pwd-item">
                  <span className="title">密碼</span>
                  <span className="item-content">．．．．．．．．</span>
                </div>
              </article>
            )}
          </section>
        </section>
      </main>
    </div>
  )
}
