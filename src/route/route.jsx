import { redirect } from 'react-router-dom'

import App from '../App'

import Home from '../views/Home'
import SetPwdFromLink from '../views/SetPwdFromLink'
import NotFound from '../views/NotFound'

import AdminPanel from '../views/adminPanel/AdminPanel'

import Products from '../views/adminPanel/Products'

import Users from '../views/adminPanel/Users'
import MyAccount from '../views/adminPanel/MyAccount'
import UserDetail from '../views/adminPanel/UserDetail'

import Orders from '../views/adminPanel/Orders'

// api
import { isLoginApi, logoutApi } from '../api/user'

export function isLogin() {
  return isLoginApi()
    .then((res) => {
      if (res.status === 200) {
        return res.data.data
      }

      throw redirect('/')
    })
    .catch(() => {
      throw redirect('/')
    })
}

export function isLoginAndActive() {
  return isLoginApi()
    .then((res) => {
      if (res.status === 200) {
        const data = res.data.data

        if (data.active) {
          return res.data.data
        }

        return logoutApi().then(() => redirect('/'))
      }

      throw redirect('/')
    })
    .catch(() => {
      throw redirect('/')
    })
}

export const routeMap = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'set_pwd/:token',
        element: <SetPwdFromLink />
      },
      {
        path: 'admin_panel',
        element: <AdminPanel />,
        loader: isLogin,
        children: [
          {
            index: true,
            element: <Products />
          },
          {
            path: 'products',
            element: <Products />,
            loader: isLoginAndActive
          },
          {
            path: 'users',
            element: <Users />,
            loader: isLoginAndActive
          },
          {
            path: 'user/:id',
            element: <UserDetail />,
            loader: isLoginAndActive
          },
          {
            path: 'my_account',
            element: <MyAccount />,
            loader: isLogin
          },

          {
            path: 'orders',
            element: <Orders />,
            loader: isLogin
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]
