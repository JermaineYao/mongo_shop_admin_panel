import { useState, useReducer } from 'react'
// ui
import LoadingCover from '../../components/ui/LoadingCover'
// mui
import TextField from '@mui/material/TextField'
// utils
import { isValidAccount, isValidEmail } from '../../utils/utils'
// hook
import { useError } from '../../hook/useError'
// api
import { addAccountApi, checkAccountEmailApi } from '@/api/user'
// reducer
import { initNewAccount, addAccountReducer } from '@/reducer/addAccount'
// redux
import { useDispatch } from 'react-redux'
import { setMsg, toggleMsg } from '../../store/slice/msgSlice'

export default function AddAdminAccount(props) {
  const setOpenModal = props.setOpenModal
  const dispatch = useDispatch()
  const handleError = useError()

  const [openAddLoading, setOpenAddLoading] = useState(false)
  const [account, accountDispatch] = useReducer(addAccountReducer, initNewAccount)

  function inputOnBlur(field, e) {
    const v = e.target.value.trim()

    if (field === 'email') {
      if (v.length === 0) {
        accountDispatch({ type: 'email-err', payload: '信箱必填' })
        return
      }

      const check = isValidEmail(v)
      if (!check) {
        accountDispatch({ type: 'email-err', payload: '信箱格式錯誤' })
        return
      }

      checkAccountEmailApi({ email: v })
        .then((res) => {
          if (res.status === 200) {
            accountDispatch({ type: 'email', payload: v })
            accountDispatch({ type: 'email-err', payload: '' })
          }
        })
        .catch((err) => {
          if (err.response.status === 409)
            accountDispatch({ type: 'email-err', payload: '信箱已被使用' })
        })
    }

    if (field === 'account') {
      if (v.length === 0) {
        accountDispatch({ type: 'account-err', payload: '帳號必填' })
        return
      }

      const check = isValidAccount(v)
      if (!check) {
        accountDispatch({
          type: 'acccount-err',
          payload: '帳號只能是英文字母開頭，後面可接英文或數字'
        })
        return
      }

      checkAccountEmailApi({ account: v })
        .then((res) => {
          if (res.status === 200) {
            accountDispatch({ type: 'account', payload: v })
            accountDispatch({ type: 'account-err', payload: '' })
          }
        })
        .catch((err) => {
          if (err.response.status === 409)
            accountDispatch({ type: 'account-err', payload: '帳號已被使用' })
        })
    }
  }

  function addAccount() {
    if (openAddLoading) return

    if (account.accountErr.length > 0 || account.emailErr.length > 0) return

    setOpenAddLoading(true)

    const query = {
      account: account.account,
      email: account.email
    }

    addAccountApi(query)
      .then((res) => {
        if (res.status === 201) {
          accountDispatch({ type: 'clear' })

          const msg = res.data.msg

          setOpenModal(false)

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
        setOpenAddLoading(false)
      })
  }

  return (
    <article className="add-admin-account  loading-container">
      <div className="add-admin-account-container">
        <LoadingCover open={openAddLoading}></LoadingCover>

        <span className="caption">新增管理者帳號</span>

        <div className="input-wrap">
          <TextField
            key="account-input"
            defaultValue={account.account || ''}
            label="帳號"
            variant="standard"
            error={Boolean(account.accountErr)}
            helperText={account.accountErr || ' '}
            onBlur={(e) => inputOnBlur('account', e)}
          ></TextField>

          <TextField
            key="email-input"
            defaultValue={account.email || ''}
            label="信箱"
            variant="standard"
            error={Boolean(account.emailErr)}
            helperText={account.emailErr || ' '}
            onBlur={(e) => inputOnBlur('email', e)}
          ></TextField>
        </div>

        <div className="action-wrap">
          <div className="btn" onClick={addAccount}>
            <span>新增帳號</span>
          </div>

          <div className="btn" onClick={() => setOpenModal(false)}>
            <span>取消</span>
          </div>
        </div>
      </div>
    </article>
  )
}
