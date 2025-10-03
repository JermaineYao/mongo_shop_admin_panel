import { useState, useReducer, useEffect } from 'react'
// router
import { useLocation, useNavigate, useParams } from 'react-router-dom'
// ui
import LoadingCover from '@comp/ui/LoadingCover'
// hook
import { useError } from '@/hook/useError'
// api
import { queryAccountApi } from '@/api/user'
// reducer
import { initAccount, accountReducer } from '@/reducer/account'
// icon
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
// component
import PageTitle from '@comp/adminPanel/PageTitle'
import Info from '@comp/adminPanel/user/Info'
import Contact from '@comp/adminPanel/user/Contact'

export default function UserDetail() {
  const title = '帳號資訊'
  const routerState = useLocation().state
  const userId = useParams().id

  const nav = useNavigate()

  const handleError = useError()

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    queryAccount({ signal })

    return () => controller.abort()
  }, [userId])

  // 取得帳號資料
  const [account, accountDispatch] = useReducer(accountReducer, initAccount)
  const [accountLoading, setAccountLoading] = useState(false)

  function queryAccount({ signal }) {
    if (accountLoading) return
    setAccountLoading(true)

    queryAccountApi({ userId, signal })
      .then((res) => {
        if (res.status === 200) {
          const resData = res.data.data

          accountDispatch({ type: 'init', payload: resData })
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
  function updateState(field, value) {
    if (field === 'clear') {
      accountDispatch({ type: 'clear' })
      return
    }

    accountDispatch({ type: 'update', field, payload: value })
  }

  // 回帳號管理
  function returnToUsers() {
    const params = new URLSearchParams(routerState.search)
    nav(`/admin_panel/users?${params.toString()}`)
  }

  return (
    <div className="page-view has-return-btn">
      <PageTitle title={title}></PageTitle>

      <div className="btn return" onClick={returnToUsers}>
        <KeyboardDoubleArrowLeftIcon
          sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '30px' }}
        />
        <span>回帳號管理</span>
      </div>

      <main id="account" className="extend loading-container scroll-wrap-y">
        <LoadingCover open={accountLoading} />

        <section className="account-container">
          {/*----- account, email, role, active, photo -----*/}
          <Info
            userInfo={{
              account: account.account,
              email: account.email,
              role: account.role,
              active: account.active,
              photo: account.photo,
              userId
            }}
            isEditable={false}
            updateState={updateState}
          ></Info>

          {/*----- address, phoneNumber -----*/}
          <Contact
            userInfo={{
              address: account.address,
              phoneNumber: account.phoneNumber,
              userId
            }}
            isEditable={account.role === 'user' ? true : false}
            updateState={updateState}
          ></Contact>
        </section>
      </main>
    </div>
  )
}
