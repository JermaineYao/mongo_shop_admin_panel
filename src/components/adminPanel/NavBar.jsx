import { useState, useEffect } from 'react'
// router
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
// hook
import { useError } from '@/hook/useError'
// api
import { logoutApi, queryMyAccountApi } from '@/api/user'
// redux
import { useSelector, useDispatch } from 'react-redux'
import { setUser, resetUser } from '../../store/slice/userSlice'
// icon
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import StartIcon from '@mui/icons-material/Start'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// component
import Logo from '../Logo'

export default function NavBar() {
  const dispatch = useDispatch()
  const user = useSelector((store) => store.user)

  const nav = useNavigate()
  const routerLocation = useLocation()
  const currentPath = routerLocation.pathname

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    if (!user.userId) queryAccount({ signal })

    return () => controller.abort()
  }, [])

  const handleError = useError()

  // 取得帳號資料
  function queryAccount({ signal }) {
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
  }

  const myAccountPath = '/admin_panel/my_account'

  // 是否收合
  const [openNav, setOpenNav] = useState(true)
  function toggleNav() {
    setOpenNav((openNav) => !openNav)
  }

  // 登出
  function logout() {
    logoutApi()
      .then((res) => {
        if (res.status === 200) {
          dispatch(resetUser())
          nav('/')
        }
      })
      .catch((err) => {
        handleError(err)
      })
  }

  // 導航列
  const navItems = [
    {
      name: '商品管理',
      path: '/admin_panel'
    },
    {
      name: '訂單管理',
      path: '/admin_panel/orders'
    },
    {
      name: '帳號管理',
      path: '/admin_panel/users'
    }
  ]

  return (
    <div id="nav-bar" className={openNav ? '' : 'closed'}>
      <div className="nav-container">
        <Logo large={false}></Logo>

        <hr />

        <div className="user-wrap">
          <div
            className={
              currentPath === myAccountPath ? 'user-avadar active' : 'user-avadar'
            }
            onClick={() => nav(myAccountPath, { state: { name: '我的帳號' } })}
          >
            {user.photo.url ? (
              <div
                className="img"
                style={{
                  background: `url(${user.photo.url}) center/cover no-repeat`
                }}
              ></div>
            ) : (
              <EmojiEmotionsIcon
                sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '50px' }}
              />
            )}

            <span>{user.account}</span>
          </div>

          <div className="logout" onClick={logout}>
            <DirectionsRunIcon
              sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '30px' }}
            />
            <span>登出</span>
          </div>
        </div>

        {user.active ? <hr /> : null}

        {user.active ? (
          <nav>
            {navItems.map((v) => {
              return (
                <div className="nav-item" key={v.name}>
                  <NavLink to={v.path} state={v.name} end>
                    <span>{v.name}</span>
                  </NavLink>
                </div>
              )
            })}
          </nav>
        ) : null}
      </div>

      <div id="toggle-nav" onClick={toggleNav}>
        {openNav ? (
          <ArrowBackIcon sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '35px' }} />
        ) : (
          <StartIcon sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '35px' }} />
        )}
      </div>
    </div>
  )
}
