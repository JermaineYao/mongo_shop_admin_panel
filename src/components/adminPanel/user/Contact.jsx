import { useState } from 'react'
// ui
import LoadingCover from '@comp/ui/LoadingCover'
// mui
import TextField from '@mui/material/TextField'
// utils
import { isValidPhoneNumber } from '@/utils/utils'
// hook
import { useError } from '@/hook/useError'
// api
import { updateUserContactApi } from '@/api/user'
// redux
import { useDispatch } from 'react-redux'
import { setMsg, toggleMsg } from '@/store/slice/msgSlice'

export default function Contact(props) {
  const { userInfo, isEditable, updateState } = props
  const dispatch = useDispatch()
  const handleError = useError()

  // 聯繫方式 - 編輯
  const [contactBackup, setContactBackup] = useState('')
  const [editContact, setEditContact] = useState(false)

  const [phoneErr, setPhoneErr] = useState('')

  function editUserContact() {
    setEditContact(true)

    const backup = {
      address: userInfo.address,
      phoneNumber: userInfo.phoneNumber
    }

    const backStr = JSON.stringify(backup)

    setContactBackup(() => backStr)
  }

  function cancleEdit() {
    setEditContact(false)
    const backup = JSON.parse(contactBackup)
    const { address, phoneNumber } = backup

    if (updateState) {
      updateState('address', address)
      updateState('phoneNumber', phoneNumber)
    }

    setPhoneErr('')
  }

  function addressOnBlur(e) {
    const address = e.target.value.trim()
    if (typeof address === 'string' && address.length > 0 && updateState) {
      updateState('address', address)
    } else {
      updateState('address', null)
    }
  }

  function phoneNumberOnBlur(e) {
    const phoneNumber = e.target.value.trim()
    const check = isValidPhoneNumber(phoneNumber)

    if (!check) {
      setPhoneErr('手機號碼格式 09xx-xxx-xxx')
      return
    }

    if (updateState) updateState('phoneNumber', phoneNumber)

    setPhoneErr('')
  }

  // 更改聯絡方式
  const [contactLoading, setContactLoading] = useState(false)
  function updateUserContact() {
    if (contactLoading) return

    const phoneNumber = userInfo.phoneNumber
    const check = isValidPhoneNumber(phoneNumber)

    if (!check) {
      setPhoneErr('手機號碼格式 09xx-xxx-xxx')
      return
    }

    const current = {
      address: userInfo.address,
      phoneNumber: userInfo.phoneNumber
    }

    console.log('current', current)

    const currentStr = JSON.stringify(current)

    if (currentStr === contactBackup) {
      setEditContact(false)
      setContactBackup(() => '')
      return
    }

    setContactLoading(true)

    const id = userInfo.userId
    const query = {
      userId: id,
      address: userInfo.address,
      phoneNumber: userInfo.phoneNumber
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
        if (err) {
          const backup = JSON.parse(contactBackup)
          const { address, phoneNumber } = backup

          if (updateState) {
            updateState('address', address)
            updateState('phoneNumber', phoneNumber)
          }
        }
        handleError(err)
      })
      .finally(() => {
        setContactLoading(false)
      })
  }

  return (
    <section className="account-contact-container loading-container account-wrap">
      <LoadingCover open={contactLoading} />

      <div className="caption-wrap">
        <span className="caption">聯繫方式</span>

        {isEditable && (
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
        )}
      </div>

      {editContact ? (
        <article className="account-pwd-wrap">
          <div className="account-contact-item">
            <TextField
              key={userInfo.phoneNumber || ''}
              defaultValue={userInfo.phoneNumber || ''}
              label="手機號碼"
              variant="standard"
              error={Boolean(phoneErr)}
              helperText={phoneErr || ' '}
              onBlur={(e) => phoneNumberOnBlur(e)}
            />
          </div>

          <div className="account-contact-item">
            <TextField
              key={userInfo.address || ''}
              defaultValue={userInfo.address || ''}
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
              {userInfo.phoneNumber && userInfo.phoneNumber?.length > 0
                ? userInfo.phoneNumber
                : '尚未填寫'}
            </span>
          </div>

          <div className="account-contact-item">
            <span className="title">聯絡地址</span>
            <span className="content">
              {userInfo.address && userInfo.address?.length > 0
                ? userInfo.address
                : '尚未填寫'}
            </span>
          </div>
        </article>
      )}
    </section>
  )
}
