import App from '../App'
import Home from '../views/Home'

export const routeMap = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      }
      // {
      //   path: '/set_pwd/:token',
      //   element: <SetNewPwd />
      // },
      // {
      //   path: 'dashboard',
      //   element: <Dashboard />,
      //   loader: routerProtection,
      //   children: [
      //     {
      //       path: 'product',
      //       element: <Product />,
      //       index: true,
      //       loader: routerProtection
      //     },
      //     {
      //       path: 'order',
      //       element: <Order />,
      //       loader: routerProtection,
      //       children: [
      //         {
      //           path: '',
      //           element: <OrderList />,
      //           loader: routerProtection
      //         },
      //         {
      //           path: 'detail/:id',
      //           element: <OrderContent />,
      //           loader: routerProtection
      //         }
      //       ]
      //     },
      //     {
      //       path: 'account',
      //       element: <AccountManagement />,
      //       loader: routerProtection,
      //       children: [
      //         {
      //           path: '',
      //           element: <Account />,
      //           loader: routerProtection
      //         },
      //         {
      //           path: 'detail/:id/:accountCheck',
      //           element: <MyAccount />,
      //           loader: routerProtection
      //         }
      //       ]
      //     },
      //     {
      //       path: 'my_account/:id/:accountCheck',
      //       element: <MyAccount />,
      //       loader: routerProtection
      //     }
      //   ]
      // }
    ]
  }
  // {
  //   path: '*',
  //   element: <NotFound />
  // }
]
