import { useState, useReducer, useEffect } from 'react'
// mui
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
// ui
import LoadingCover from '../ui/LoadingCover'
// utils
import { isValidPhoneNumber } from '../../utils/utils'
// hook
import { useError } from '../../hook/useError'
// api
import {
  queryMyAccountApi,
  queryAccountApi,
  uploadUserPhotoApi,
  deleteUserPhotoApi,
  toggleUserActiveApi,
  updateUserContactApi
} from '@/api/user'
// reducer
import { initAccount, accountReducer } from '@/reducer/account'
// redux
import { useDispatch } from 'react-redux'
import { setMsg, toggleMsg } from '../../store/slice/msgSlice'

// icon
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import BackupIcon from '@mui/icons-material/Backup'

export default function Account(props) {
  const userId = props.userId || null
  const dispatch = useDispatch()
  const handleError = useError()

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    queryAccount({ userId, signal })

    return () => controller.abort()
  }, [userId])

  /*========= api 請求 =========*/
  const [account, accountDispatch] = useReducer(accountReducer, initAccount)
  const [accountLoading, setAccountLoading] = useState(false)

  // 取得帳號資料
  function queryAccount({ userId, signal }) {
    if (accountLoading) return
    setAccountLoading(true)

    const result = userId
      ? queryAccountApi({ userId, signal })
      : queryMyAccountApi({ signal })

    result
      .then((res) => {
        if (res.status === 200) {
          const resData = res.data.data

          const data = {}
          for (const key in initAccount) {
            data[key] = resData[key]
          }

          accountDispatch({ type: 'init', payload: { ...data } })
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

    const id = userId ? userId : account.userId

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', id)

    setImgLoading(true)

    uploadUserPhotoApi(formData)
      .then((res) => {
        if (res.status === 200) {
          const photo = res.data.data.photo
          accountDispatch({ type: 'photo', payload: { photo } })
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
    const id = userId ? userId : account.userId
    setImgLoading(true)

    deleteUserPhotoApi(id)
      .then((res) => {
        if (res.status === 200) {
          const photo = res.data.data.photo
          accountDispatch({ type: 'photo', payload: { photo } })
        }
      })
      .finally(() => {
        setImgLoading(false)
      })
  }

  // 是否啟用
  async function toggleUserActive(enable) {
    const id = userId ? userId : account.userId
    const query = {
      userId: id,
      enable
    }

    toggleUserActiveApi(query)
      .then((res) => {
        if (res.status === 200) {
          const msg = res.data.msg

          accountDispatch({
            type: 'active',
            payload: { active: enable }
          })

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

  async function toggleAccountActive(e) {
    const enable = e.target.checked

    await toggleUserActive(enable)
  }

  // 聯繫方式 - 編輯
  const [contactBackup, setContactBackup] = useState('')
  const [editContact, setEditContact] = useState(false)

  const [phoneErr, setPhoneErr] = useState('')

  function editUserContact() {
    setEditContact(true)

    const backup = {
      address: account.address,
      phoneNumber: account.phoneNumber
    }

    const backStr = JSON.stringify(backup)

    setContactBackup(() => backStr)
  }

  function cancleEdit() {
    setEditContact(false)
    const backup = JSON.parse(contactBackup)
    const { address, phoneNumber } = backup

    accountDispatch({ type: 'address', payload: { address } })
    accountDispatch({ type: 'phoneNumber', payload: { phoneNumber } })
    setPhoneErr('')
  }

  function addressOnBlur(e) {
    const address = e.target.value
    if (typeof address === 'string' && address.trim().length > 0) {
      accountDispatch({ type: 'address', payload: { address } })
    } else {
      accountDispatch({ type: 'address', payload: { address: null } })
    }
  }

  function phoneNumberOnBlur(e) {
    const phoneNumber = e.target.value
    const check = isValidPhoneNumber(phoneNumber)

    if (!check) {
      setPhoneErr('手機號碼格式 09xx-xxx-xxx')
      return
    }

    accountDispatch({ type: 'phone', payload: { phoneNumber } })
    setPhoneErr('')
  }

  // 更改聯絡方式
  const [contactLoading, setContactLoading] = useState(false)
  function updateUserContact() {
    if (contactLoading) return

    const phoneNumber = account.phoneNumber
    const check = isValidPhoneNumber(phoneNumber)

    if (!check) {
      setPhoneErr('手機號碼格式 09xx-xxx-xxx')
      return
    }

    const current = {
      address: account.address,
      phoneNumber: account.phoneNumber
    }

    const currentStr = JSON.stringify(current)

    if (currentStr === contactBackup) {
      setEditContact(false)
      setContactBackup(() => '')
      return
    }

    setContactLoading(true)

    const id = userId ? userId : account.userId
    const query = {
      userId: id,
      address: account.address,
      phoneNumber: account.phoneNumber
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

  return (
    <main id="account" className="extend loading-container scroll-wrap-y">
      <LoadingCover open={accountLoading} />

      <section className="account-container">
        <section className="account-base-container account-wrap">
          <article className="account-item">
            <div className="photo-container">
              {account.photo.url ? (
                <div
                  role="button"
                  className="photo circle"
                  style={{
                    background: `url(${account.photo.url}) center/cover no-repeat`
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

              {account.photo.url && (
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
                  {account?.account ? account.account : 'Account'}
                </span>
                <div className={account.role === 'admin' ? 'role admin' : 'role user'}>
                  <span>{account?.role === 'admin' ? '系統管理員' : '一般用戶'}</span>
                </div>
              </div>

              <div className="account-email">
                <span> {account?.email ? account.email : 'Email'}</span>
              </div>
            </div>

            <div className="account-active-container">
              <span
                className={
                  account.active ? 'account-active ' : 'account-active not-actived'
                }
              >
                停用
              </span>
              <Switch
                checked={account.active}
                onChange={toggleAccountActive}
                color="default"
              />
              <span
                className={
                  account.active ? 'account-active is-actived' : 'account-active '
                }
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
                <div onClick={editUserContact} className="btn">
                  <span>修改</span>
                </div>
              ) : (
                <div className="btn" onClick={updateUserContact}>
                  <span>儲存</span>
                </div>
              )}

              {!editContact ? null : (
                <div onClick={cancleEdit} className="btn">
                  <span>取消</span>
                </div>
              )}
            </div>
          </div>

          {editContact ? (
            <article className="account-contact-wrap">
              <div className="account-contact-item">
                <TextField
                  key={account.phoneNumber || ''}
                  defaultValue={account.phoneNumber || ''}
                  label="手機號碼"
                  variant="standard"
                  error={Boolean(phoneErr)}
                  helperText={phoneErr || ' '}
                  onBlur={(e) => phoneNumberOnBlur(e)}
                />
              </div>

              <div className="account-contact-item">
                <TextField
                  key={account.address || ''}
                  defaultValue={account.address || ''}
                  label="聯絡地址"
                  variant="standard"
                  onBlur={(e) => addressOnBlur(e)}
                />
              </div>
            </article>
          ) : (
            <article className="account-contact-wrap">
              <div className="account-contact-item">
                <span className="title">手機號碼</span>
                <span className="content">
                  {account.phoneNumber && account.phoneNumber?.length > 0
                    ? account.phoneNumber
                    : '尚未填寫'}
                </span>
              </div>

              <div className="account-contact-item">
                <span className="title">聯絡地址</span>
                <span className="content">
                  {account.phoneNumber && account.phoneNumber?.length > 0
                    ? account.address
                    : '尚未填寫'}
                </span>
              </div>
            </article>
          )}
        </section>

        {!userId ? <section></section> : null}
      </section>
    </main>
  )
}
