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

// 登出
export const logoutApi = () => {
  const url = `${baseUrl}/sign_out_admin`
  return catchErr(http.get(url))
}

// 忘記密碼
/**
 * @param {string} email
 */
export const forgotPwdApi = (query) => {
  query.routeWithHash = true
  const url = `${baseUrl}/forgot_pwd_admin`
  return catchErr(http.post(url, { ...query }))
}

// 忘記密碼 - 設定新密碼
/**
 * @param {string} newPWD
 * @param {string} token
 */
export const resetPwdApi = (query) => {
  const url = `${baseUrl}/reset_pwd_admin`
  return catchErr(http.post(url, { ...query }))
}

// 檢查是否登入
export const isLoginApi = () => {
  const url = `${baseUrl}/is_login_admin`
  return catchErr(http.get(url))
}

// 我的帳號
export const queryMyAccountApi = () => {
  const url = `${baseUrl}/my_account_admin`
  return catchErr(http.get(url))
}

// 查詢用戶帳號
export const queryAccountApi = (query, singal) => {
  const url = `${baseUrl}/query_user`
  return catchErr(http.post(url, { ...query, singal }))
}

// 上傳照片
/**
 * @param {file} file
 * @param {string} userId
 */
export const uploadUserPhotoApi = (formData) => {
  const url = `${baseUrl}/upload_user_photo_admin`

  return catchErr(
    http.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  )
}

// 刪除照片
/**
 * @param {string} userId
 */
export const deleteUserPhotoApi = (userId) => {
  const url = `${baseUrl}/delete_user_photo_admin/${userId}`
  return catchErr(http.delete(url))
}

// 更新 user (地址, 電話)
/**
 *
 * @param {string} userId
 * @param {string || null} address
 * @param {string || null} phoneNumber
 */
export const updateUserContactApi = (query) => {
  const url = `${baseUrl}/update_user_info_admin`
  return catchErr(http.patch(url, { ...query }))
}

// 停用,啟用 帳號
export const toggleUserActiveApi = (query) => {
  const url = `${baseUrl}/user_enable_admin`
  return catchErr(http.patch(url, { ...query }))
}

// 更改我的密碼
/**
 *
 * @param {string} newPWD
 * @param {string} pwdCurrent
 */
export const changePwdApi = (query) => {
  const url = `${baseUrl}/update_pwd_admin`
  return catchErr(http.patch(url, { ...query }))
}

// 取得所有帳號
export const queryAllAccountsApi = (query) => {
  const url = `${baseUrl}/all`
  return catchErr(http.post(url, { ...query }))
}

// 註冊前檢查帳號 信箱是否已被使用
/**
 * account, email 至少給一個
 * @param {string || null} account
 * @param {string || null} email
 */
export const checkAccountEmailApi = (query) => {
  const url = `${baseUrl}/check_user_admin`
  return catchErr(http.post(url, { ...query }))
}

// 新增管理員帳號
/**
 * @param {string} req.body.account
 * @param {string} req.body.email
 */
export const addAccountApi = (query, singal) => {
  const url = `${baseUrl}/add_user_admin`
  return catchErr(http.post(url, { ...query, singal }))
}
