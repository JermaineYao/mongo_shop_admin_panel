import { createHashRouter, RouterProvider } from 'react-router-dom'
import { routeMap } from '../route/route'

export default function RouteComponent() {
  const router = createHashRouter(routeMap)

  return <RouterProvider router={router}></RouterProvider>
}
