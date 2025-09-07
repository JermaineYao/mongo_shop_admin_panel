import { useState, useEffect, useReducer, useRef } from 'react'
// router
import { useNavigate, useLoaderData, useSearchParams } from 'react-router-dom'
// ui
import LoadingCover from '../../components/ui/LoadingCover'
// mui
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Pagination from '@mui/material/Pagination'
// hook
import { useError } from '../../hook/useError'
// api
import { queryAllAccountsApi, toggleUserActiveApi } from '../../api/user'
// reducer
import { initUsers, usersReducer } from '@/reducer/users'
// redux
import { useDispatch } from 'react-redux'
import { setMsg, toggleMsg } from '../../store/slice/msgSlice'
// icon
import SearchIcon from '@mui/icons-material/Search'
// component
import AddAdminAccount from '@comp/adminPanel/AddAdminAccount'
import PageTitle from '@comp/adminPanel/PageTitle'
import NoData from '@comp/adminPanel/NoData'

export default function Users() {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const title = '帳號管理'

  const myAccount = useLoaderData()
  const controllerRef = useRef(null)
  // const searchParams = useSearchParams()

  // console.log(Object.fromEntries(searchParams.entries()))
  const handleError = useError()

  // 查詢所有帳號
  const [usersLoading, setUsersLoading] = useState(false)
  const [accounts, accountsDispatch] = useReducer(usersReducer, initUsers)

  // url 查詢參數
  const [searchParams, setSearchParams] = useSearchParams()
  const urlSreach = {
    account: searchParams.get('account') || '',
    email: searchParams.get('email') || '',
    role: searchParams.get('role') || 'all',
    active: getActive(searchParams.get('active')),
    currentPage: searchParams.get('currentPage') * 1 || 1
  }

  function getActive(v) {
    if (v === 'false') return false
    if (v === 'true') return true

    return 'all'
  }

  // 預設查詢
  useEffect(() => {
    accountsDispatch({ type: 'search', payload: { search: urlSreach } })
    queryAllAccounts(urlSreach)

    setSearchParams({}, { replace: true })
  }, [])

  // 新增帳號
  const [openModal, setOpenModal] = useState(false)

  function cancelAddingAccount() {
    queryAllAccounts()
    setOpenModal(false)
  }

  function queryAllAccounts(queryOverride) {
    if (usersLoading) return

    // 中止前一次請求
    if (controllerRef.current) controllerRef.current.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    const { signal } = controller

    setUsersLoading(true)
    const query = queryOverride ? queryOverride : { ...accounts.search }

    for (const key in query) {
      if (query[key] === '' || query[key] === 'all' || query[key] === null)
        delete query[key]
    }

    queryAllAccountsApi(query, signal)
      .then((res) => {
        if (res.status === 200) {
          const data = res.data

          const all = data.data.filter((u) => u._id !== myAccount._id)
          accountsDispatch({ type: 'users', payload: { users: all } })

          accountsDispatch({
            type: 'total-page',
            payload: data.totalPages
          })

          accountsDispatch({
            type: 'data-count',
            payload: data.dataCount
          })
        }
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || err?.name === 'CanceledError') return

        handleError(err)
      })
      .finally(() => {
        setUsersLoading(false)
      })
  }

  // 分頁查詢
  function queryAccountByPage(_e, page) {
    accountsDispatch({ type: 'set-page', payload: page })
    const query = { ...accounts.search, currentPage: page }
    queryAllAccounts(query)
  }

  function selectOnBlur(fieldName, e) {
    const v = e.target.value
    const setField = fieldName === 'role' ? { role: v } : { active: v }

    accountsDispatch({
      type: 'search',
      payload: { search: setField }
    })
  }

  function inputOnBlur(fieldName, e) {
    const v = e.target.value
    const setField = fieldName === 'account' ? { account: v } : { email: v }

    accountsDispatch({
      type: 'search',
      payload: { search: setField }
    })
  }

  // 查詢結果表格
  const tableHead = ['帳號', '信箱', '身分', '是否啟用', '查看']

  // 是否啟用
  async function toggleUserActive(enable, id, account) {
    if (usersLoading) return

    setUsersLoading(true)
    const query = {
      userId: id,
      enable
    }

    toggleUserActiveApi(query)
      .then((res) => {
        if (res.status === 200) {
          const msg = res.data.msg

          accountsDispatch({
            type: 'update-user',
            payload: { _id: id, update: { active: enable } }
          })

          dispatch(toggleMsg({ open: true }))
          dispatch(
            setMsg({
              msg: `用戶 ${account} ${msg}`,
              severity: 'success'
            })
          )
        }
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        setUsersLoading(false)
      })
  }

  function toggleAccountActive(e, id, account) {
    const enable = e.target.checked

    toggleUserActive(enable, id, account)
  }

  // 查看帳號資訊
  function checkAccount(id) {
    nav(`/admin_panel/user/${id}`, { state: { search: accounts.search } })
  }

  return (
    <main className="page-view">
      <PageTitle title={title}></PageTitle>

      {openModal ? (
        <AddAdminAccount
          setOpenModal={setOpenModal}
          cancelAddingAccount={cancelAddingAccount}
        ></AddAdminAccount>
      ) : null}

      <div id="users" className={usersLoading ? 'extend' : 'extend scroll-wrap-y'}>
        <section className="users-container ">
          <section className="search-container users-item">
            <div className="search-wrap">
              <TextField
                key="account-input"
                defaultValue={accounts.search.account || ''}
                label="帳號"
                variant="standard"
                onBlur={(e) => inputOnBlur('account', e)}
              />

              <TextField
                key="email-input"
                defaultValue={accounts.search.email || ''}
                label="信箱"
                variant="standard"
                onBlur={(e) => inputOnBlur('email', e)}
              />

              <FormControl variant="standard">
                <InputLabel id="role-role">身分</InputLabel>
                <Select
                  labelId="role-role"
                  value={accounts.search.role ?? 'all'}
                  label="是否啟用"
                  onChange={(e) => selectOnBlur('role', e)}
                >
                  <MenuItem value={'all'}>全部</MenuItem>
                  <MenuItem value={'user'}>一般用戶</MenuItem>
                  <MenuItem value={'admin'}>管理員</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="standard">
                <InputLabel id="role-active">是否啟用</InputLabel>
                <Select
                  labelId="role-active"
                  value={accounts.search.active ?? 'all'}
                  label="是否啟用"
                  onChange={(e) => selectOnBlur('active', e)}
                >
                  <MenuItem value={'all'}>全部</MenuItem>
                  <MenuItem value={true}>啟用</MenuItem>
                  <MenuItem value={false}>停用</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="action-wrap" onClick={() => queryAllAccounts()}>
              <div className="btn">
                <span>查詢</span>
              </div>
            </div>
          </section>

          <section className="users-list-container ">
            <div className="action-wrap">
              {accounts.totalPages > 1 ? (
                <Pagination
                  className="pages"
                  count={accounts.totalPages}
                  page={accounts.search.currentPage}
                  onChange={queryAccountByPage}
                  color="primary"
                />
              ) : null}

              <div className="btn add-account" onClick={() => setOpenModal(true)}>
                <span>新增管理員</span>
              </div>
            </div>

            <div className="users-table-container loading-container scroll-wrap-x">
              <LoadingCover open={usersLoading} />

              {accounts.users.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      {tableHead.map((item) => (
                        <th key={item}>
                          <span>{item}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {accounts.users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <span>{user.account}</span>
                        </td>

                        <td>
                          <span>{user.email}</span>
                        </td>

                        <td>
                          <span>{user.role === 'user' ? '一般用戶' : '系統管理員'}</span>
                        </td>

                        <td>
                          <span
                            className={
                              user.active
                                ? 'account-active '
                                : 'account-active not-active'
                            }
                          >
                            停用
                          </span>
                          <Switch
                            checked={user.active}
                            onChange={(e) =>
                              toggleAccountActive(e, user._id, user.account)
                            }
                            disabled={user.role === 'admin'}
                            color="default"
                          />
                          <span
                            className={
                              user.active ? 'account-active is-active' : 'account-active '
                            }
                          >
                            啟用
                          </span>
                        </td>

                        <td>
                          <div className="icon-action">
                            <SearchIcon
                              sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '30px' }}
                              onClick={() => checkAccount(user._id)}
                            ></SearchIcon>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <NoData></NoData>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}
