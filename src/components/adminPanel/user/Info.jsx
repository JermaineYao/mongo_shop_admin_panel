import { useState, useReducer, useEffect } from 'react'
// ui
import LoadingCover from '@comp/ui/LoadingCover'
// mui
import Switch from '@mui/material/Switch'
// hook
import { useError } from '@/hook/useError'
// api
import { uploadUserPhotoApi, deleteUserPhotoApi, toggleUserActiveApi } from '@/api/user'
// redux
import { useDispatch } from 'react-redux'
import { setMsg, toggleMsg } from '@/store/slice/msgSlice'
// icon
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import BackupIcon from '@mui/icons-material/Backup'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'

export default function Info(props) {
  const { userInfo, isEditable, updateState } = props
  const id = userInfo.userId

  const dispatch = useDispatch()
  const handleError = useError()

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
    if (!isEditable) return
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', id)

    setImgLoading(true)

    uploadUserPhotoApi(formData)
      .then((res) => {
        if (res.status === 200) {
          const photo = res.data.data.photo

          if (updateState) updateState('photo', photo)
        }
      })
      .finally(() => {
        setImgLoading(false)
      })
  }

  function triggerUpload() {
    if (!isEditable) return
    const upload = document.getElementById('user-photo-upload')
    upload.click()
  }

  // 刪除照片
  function deleteUserPhoto() {
    setImgLoading(true)

    deleteUserPhotoApi(id)
      .then((res) => {
        if (res.status === 200) {
          const photo = res.data.data.photo
          if (updateState) updateState('photo', photo)
        }
      })
      .finally(() => {
        setImgLoading(false)
      })
  }

  // 是否啟用
  function toggleUserActive(enable) {
    const query = {
      userId: id,
      enable
    }

    toggleUserActiveApi(query)
      .then((res) => {
        if (res.status === 200) {
          const msg = res.data.msg

          if (updateState) updateState('active', enable)

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

  return (
    <section className="account-base-container account-wrap">
      <article className="account-item">
        {/*----- photo -----*/}
        <div className="photo-container">
          {userInfo.photo.url ? (
            <div
              role="button"
              className="photo circle"
              style={{
                background: `url(${userInfo.photo.url}) center/cover no-repeat`
              }}
              onClick={triggerUpload}
              aria-label="更換頭像"
            ></div>
          ) : (
            <div className="empty circle" onClick={triggerUpload} aria-label="上傳頭像">
              {isEditable ? (
                <BackupIcon sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '50px' }} />
              ) : (
                <EmojiEmotionsIcon
                  sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '50px' }}
                />
              )}
            </div>
          )}

          {userInfo.photo.url && userInfo.role === 'user' && (
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

      {/*----- account, email, role, active -----*/}
      <article className="account-base-wrap account-item">
        <div className="account-name-role-email">
          <div className="account-name-role">
            <span className="account-name">
              {userInfo?.account ? userInfo.account : 'Account'}
            </span>
            <div className={userInfo.role === 'admin' ? 'role admin' : 'role user'}>
              <span>{userInfo?.role === 'admin' ? '系統管理員' : '一般用戶'}</span>
            </div>
          </div>

          <div className="account-email">
            <span> {userInfo?.email ? userInfo.email : 'Email'}</span>
          </div>
        </div>

        <div className="account-active-container">
          <span
            className={userInfo.active ? 'account-active ' : 'account-active not-active'}
          >
            停用
          </span>
          <Switch
            checked={userInfo.active}
            onChange={toggleAccountActive}
            color="default"
            disabled={userInfo.role === 'admin'}
          />
          <span
            className={userInfo.active ? 'account-active is-active' : 'account-active '}
          >
            啟用
          </span>
        </div>
      </article>
    </section>
  )
}
