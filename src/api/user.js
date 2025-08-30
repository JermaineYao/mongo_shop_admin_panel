import http from './axios'
import { catchErr } from './catchError'
const baseUrl = 'api/v1/user'

// 登入
export const loginApi = (query) => {
  const url = `${baseUrl}/sign_in_admin`
  return catchErr(http.post(url, { ...query }))
}
