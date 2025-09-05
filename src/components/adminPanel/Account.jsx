import { useState, useReducer, useEffect } from 'react'
// ui
import LoadingCover from '../ui/LoadingCover'
// mui
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
// utils
import { isValidPhoneNumber, isValidPwd } from '../../utils/utils'
// hook
import { useError } from '../../hook/useError'
// api
import {
  queryMyAccountApi,
  uploadUserPhotoApi,
  deleteUserPhotoApi,
  toggleUserActiveApi,
  updateUserContactApi,
  changePwdApi
} from '@/api/user'
// reducer
import { initPwd, pwdReducer } from '@/reducer/pwd'
// redux
import { useSelector, useDispatch } from 'react-redux'
import { setMsg, toggleMsg } from '../../store/slice/msgSlice'
import { setUser, setUserInfo } from '../../store/slice/userSlice'
// icon
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import BackupIcon from '@mui/icons-material/Backup'

export default function Account() {
  const dispatch = useDispatch()
  const user = useSelector((store) => store.user)

  const handleError = useError()

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    if (!user.userId) queryAccount({ signal })

    return () => controller.abort()
  }, [user.userId])

  /*========= api 請求 =========*/
  const [accountLoading, setAccountLoading] = useState(false)

  // 取得帳號資料
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

  // 上傳照片
  const [imgLoading, setImgLoading] = useState(false)

  const fileTypes = ['jpg', 'png', 'jpeg', 'gif']
  function setPhoto(e) {
    const fileChosen = e.target

    if (fileChosen && fileChosen.files && fileChosen.files.length > 0) {
      const file = fileChosen.files[0]
      const fileType = file.type.split('/')[1]

      if (!fileTypes.includes(fileType)) {
        return
      }

      uploadUserPhoto(file)
    }
  }

  function uploadUserPhoto(file) {
    if (!file) return

    const id = user.userId
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', id)

    setImgLoading(true)

    uploadUserPhotoApi(formData)
      .then((res) => {
        if (res.status === 200) {
          const photo = res.data.data.photo

          dispatch(setUserInfo({ field: 'photo', value: photo }))
        }
      })
      .finally(() => {
        setImgLoading(false)
      })
  }

  function triggerUpload() {
    const upload = document.getElementById('user-photo-upload')
    upload.click()
  }

  // 刪除照片
  function deleteUserPhoto() {
    const id = user.userId
    setImgLoading(true)

    deleteUserPhotoApi(id)
      .then((res) => {
        if (res.status === 200) {
          const photo = res.data.data.photo
          dispatch(setUserInfo({ field: 'photo', value: photo }))
        }
      })
      .finally(() => {
        setImgLoading(false)
      })
  }

  // 是否啟用
  async function toggleUserActive(enable) {
    const id = user.userId
    const query = {
      userId: id,
      enable
    }

    toggleUserActiveApi(query)
      .then((res) => {
        if (res.status === 200) {
          const msg = res.data.msg

          dispatch(setUserInfo({ field: 'active', value: enable }))

          dispatch(toggleMsg({ open: true }))
          dispatch(
            setMsg({
              msg,
              severity: 'success'
            })
          )
        }
      })
      .catch((err) => {
        handleError(err)
      })
  }

  function toggleAccountActive(e) {
    const enable = e.target.checked

    toggleUserActive(enable)
  }

  // 聯繫方式 - 編輯
  const [contactBackup, setContactBackup] = useState('')
  const [editContact, setEditContact] = useState(false)

  const [phoneErr, setPhoneErr] = useState('')

  function editUserContact() {
    setEditContact(true)

    const backup = {
      address: user.address,
      phoneNumber: user.phoneNumber
    }

    const backStr = JSON.stringify(backup)

    setContactBackup(() => backStr)
  }

  function cancleEdit() {
    setEditContact(false)
    const backup = JSON.parse(contactBackup)
    const { address, phoneNumber } = backup

    dispatch(setUserInfo({ field: 'address', value: address }))
    dispatch(setUserInfo({ field: 'phoneNumber', value: phoneNumber }))
    setPhoneErr('')
  }

  function addressOnBlur(e) {
    const address = e.target.value.trim()
    if (typeof address === 'string' && address.length > 0) {
      dispatch(setUserInfo({ field: 'address', value: address }))
    } else {
      dispatch(setUserInfo({ field: 'address', value: null }))
    }
  }

  function phoneNumberOnBlur(e) {
    const phoneNumber = e.target.value.trim()
    const check = isValidPhoneNumber(phoneNumber)

    if (!check) {
      setPhoneErr('手機號碼格式 09xx-xxx-xxx')
      return
    }

    dispatch(setUserInfo({ field: 'phoneNumber', value: phoneNumber }))
    setPhoneErr('')
  }

  // 更改聯絡方式
  const [contactLoading, setContactLoading] = useState(false)
  function updateUserContact() {
    if (contactLoading) return

    const phoneNumber = user.phoneNumber
    const check = isValidPhoneNumber(phoneNumber)

    if (!check) {
      setPhoneErr('手機號碼格式 09xx-xxx-xxx')
      return
    }

    const current = {
      address: user.address,
      phoneNumber: user.phoneNumber
    }

    const currentStr = JSON.stringify(current)

    if (currentStr === contactBackup) {
      setEditContact(false)
      setContactBackup(() => '')
      return
    }

    setContactLoading(true)

    const id = user.userId
    const query = {
      userId: id,
      address: user.address,
      phoneNumber: user.phoneNumber
    }

    updateUserContactApi(query)
      .then((res) => {
        if (res.status === 200) {
          setEditContact(false)
          setContactBackup(() => '')
          const msg = res.data.msg

          dispatch(toggleMsg({ open: true }))
          dispatch(
            setMsg({
              msg,
              severity: 'success'
            })
          )
        }
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        setContactLoading(false)
      })
  }

  // 更改密碼
  const pwdRule = '至少 8位元、至少包含一個大寫、小寫英文字母、數字、特殊字元'
  const [pwdLoading, setPwdLoading] = useState(false)
  const [editPwd, setEditPwd] = useState(false)
  const [pwd, pwdDispatch] = useReducer(pwdReducer, initPwd)

  function checkPwdInputs() {
    const allFilled =
      pwd.pwdCurrent.length > 0 && pwd.pwd.length > 0 && pwd.confirmPwd.length > 0

    console.log('allFilled', allFilled)

    const allChecked =
      pwd.pwdCurrentErr.length === 0 &&
      pwd.pwdErr.length === 0 &&
      pwd.confirmErr.length === 0

    console.log('allChecked', allChecked)
    return allFilled && allChecked ? true : false
  }

  function cancelEditPwd() {
    pwdDispatch({ type: 'clear' })
    setEditPwd(false)
  }

  function enableEditPwd() {
    setEditPwd(true)
  }

  function pwdCurrentOnBlur(e) {
    const pwdCurrent = e.target.value.trim()
    const check = isValidPwd(pwdCurrent)

    if (!check) {
      pwdDispatch({ type: 'err-current', payload: pwdRule })

      return
    }

    pwdDispatch({ type: 'err-current', payload: '' })
    pwdDispatch({ type: 'current', payload: pwdCurrent })
  }

  function pwdOnBlur(e) {
    const newPwd = e.target.value.trim()
    const check = isValidPwd(pwd)

    if (!check) {
      pwdDispatch({ type: 'err-new', payload: pwdRule })

      return
    }

    if (pwd.confirm.length > 0 && newPwd !== pwd.confirm) {
      pwdDispatch({ type: 'err-confirm', payload: '密碼確認不一致' })

      return
    }

    if (pwd.confirm.length > 0 && newPwd === pwd.confirm) {
      pwdDispatch({ type: 'err-confirm', payload: '' })
    }

    pwdDispatch({ type: 'err-new', payload: '' })
    pwdDispatch({ type: 'new', payload: newPwd })
  }

  function confirmOnBlur(e) {
    const confirm = e.target.value.trim()
    const check = isValidPwd(confirm)

    if (!check) {
      pwdDispatch({ type: 'err-confirm', payload: pwdRule })

      return
    }

    if (confirm !== pwd.pwd) {
      pwdDispatch({ type: 'err-confirm', payload: '密碼確認不一致' })

      return
    }

    pwdDispatch({ type: 'err-confirm', payload: '' })
    pwdDispatch({ type: 'confirm', payload: confirm })
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
    <main id="account" className="extend loading-container scroll-wrap-y">
      <LoadingCover open={accountLoading} />

      <section className="account-container">
        <section className="account-base-container account-wrap">
          <article className="account-item">
            <div className="photo-container">
              {user.photo.url ? (
                <div
                  role="button"
                  className="photo circle"
                  style={{
                    background: `url(${user.photo.url}) center/cover no-repeat`
                  }}
                  onClick={triggerUpload}
                  aria-label="更換頭像"
                ></div>
              ) : (
                <div
                  className="empty circle"
                  onClick={triggerUpload}
                  aria-label="上傳頭像"
                >
                  <BackupIcon
                    sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '50px' }}
                  />
                </div>
              )}

              {user.photo.url && (
                <div className="delete" onClick={deleteUserPhoto} aria-label="刪除頭像">
                  <CancelRoundedIcon
                    sx={{ color: 'rgba(18, 0, 59, 0.7);', fontSize: '30px' }}
                  />
                </div>
              )}

              <LoadingCover open={imgLoading} />

              <input
                id="user-photo-upload"
                type="file"
                onChange={(e) => setPhoto(e)}
                hidden
              />
            </div>
          </article>

          <article className="account-base-wrap account-item">
            <div className="account-name-role-email">
              <div className="account-name-role">
                <span className="account-name">
                  {user?.account ? user.account : 'Account'}
                </span>
                <div className={user.role === 'admin' ? 'role admin' : 'role user'}>
                  <span>{user?.role === 'admin' ? '系統管理員' : '一般用戶'}</span>
                </div>
              </div>

              <div className="account-email">
                <span> {user?.email ? user.email : 'Email'}</span>
              </div>
            </div>

            <div className="account-active-container">
              <span
                className={user.active ? 'account-active ' : 'account-active not-active'}
              >
                停用
              </span>
              <Switch
                checked={user.active}
                onChange={toggleAccountActive}
                color="default"
              />
              <span
                className={user.active ? 'account-active is-active' : 'account-active '}
              >
                啟用
              </span>
            </div>
          </article>
        </section>

        <section className="account-contact-container loading-container account-wrap">
          <LoadingCover open={contactLoading} />

          <div className="caption-wrap">
            <span className="caption">聯繫方式</span>

            <div className="action-wrap">
              {!editContact ? (
                <div className="btn" onClick={editUserContact}>
                  <span>修改</span>
                </div>
              ) : (
                <div className="btn" onClick={updateUserContact}>
                  <span>儲存</span>
                </div>
              )}

              {!editContact ? null : (
                <div className="btn" onClick={cancleEdit}>
                  <span>取消</span>
                </div>
              )}
            </div>
          </div>

          {editContact ? (
            <article className="account-pwd-wrap">
              <div className="account-contact-item">
                <TextField
                  key={user.phoneNumber || ''}
                  defaultValue={user.phoneNumber || ''}
                  label="手機號碼"
                  variant="standard"
                  error={Boolean(phoneErr)}
                  helperText={phoneErr || ' '}
                  onBlur={(e) => phoneNumberOnBlur(e)}
                />
              </div>

              <div className="account-contact-item">
                <TextField
                  key={user.address || ''}
                  defaultValue={user.address || ''}
                  label="聯絡地址"
                  variant="standard"
                  onBlur={(e) => addressOnBlur(e)}
                />
              </div>
            </article>
          ) : (
            <article className="account-pwd-wrap">
              <div className="account-contact-item">
                <span className="title">手機號碼</span>
                <span className="content">
                  {user.phoneNumber && user.phoneNumber?.length > 0
                    ? user.phoneNumber
                    : '尚未填寫'}
                </span>
              </div>

              <div className="account-contact-item">
                <span className="title">聯絡地址</span>
                <span className="content">
                  {user.address && user.address?.length > 0 ? user.address : '尚未填寫'}
                </span>
              </div>
            </article>
          )}
        </section>

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
                <span className="content">．．．．．．．．</span>
              </div>
            </article>
          )}
        </section>
      </section>
    </main>
  )
}
