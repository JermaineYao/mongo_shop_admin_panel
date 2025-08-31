import http from './axios'
import { catchErr } from './catchError'
const baseUrl = 'api/v1/user'

// 登入
/**
 * @param {string} account
 * @param {string} email
 */
export const loginApi = (query) => {
  const url = `${baseUrl}/sign_in_admin`
  return catchErr(http.post(url, { ...query }))
}

// 忘記密碼
/**
 * @param {string} email
 */
export const forgotPwdApi = (query) => {
  const url = `${baseUrl}/forgot_pwd_admin`
  return catchErr(http.post(url, { ...query }))
}
