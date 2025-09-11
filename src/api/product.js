import http from './axios'
import { catchErr } from './catchError'
const baseUrl = 'api/v1/product'

// 查詢所有商品
export const queryAllProductsApi = (query, singal) => {
  const url = `${baseUrl}/all_admin`
  return catchErr(http.post(url, { ...query, singal }))
}

// 啟用, 停用商品
/**
 * @param {string} procudtId
 * @param {boolean || null} enbale
 */
export const toggleProductEnableApi = (query) => {
  const url = `${baseUrl}/enable`
  return catchErr(http.patch(url, { ...query }))
}

// 檢查商品名稱
/**
 * 檢查 (productNameMain, productNameSub 至少給一個)
 * @param {string} productNameMain
 * @param {string} productNameSub
 */
export const checkProductNameApi = (query) => {
  const url = `${baseUrl}/check_product_name_admin`
  return catchErr(http.post(url, { ...query }))
}

// 新增產品
/**
 * @param {string} productNameMain
 * @param {string} productNameSub
 * @param {number} price
 * @param {string} category
 * @param {number} inStock
 * @param {array<string || null> || null || undefined} description
 */
export const addProductApi = (query) => {
  const url = `${baseUrl}/add_product_admin`
  return catchErr(http.post(url, { ...query }))
}

// 查看商品資訊
/**
 * @param {string} procudtId
 */
export const queryProductApi = (procudtId, singal) => {
  const url = `${baseUrl}/product_admin/${procudtId}`
  return catchErr(http.get(url, { singal }))
}

// 修改商品內容 (圖片資訊, 啟用除外)
/**
 * @param {string} procudtId
 * @param {string} category
 * @param {number} price
 * @param {string} size
 * @param {array<string || null> || null || undefined} description
 * @param {number} inStock
 */
export const updateProductApi = (query) => {
  const url = `${baseUrl}/modify`
  return catchErr(http.patch(url, { ...query }))
}

// 上傳主要圖片
/**
 * @param {string} procudtId
 * @param {binary} file
 */
export const uploadMainPhotoApi = (formData) => {
  const url = `${baseUrl}/upload_main_photo_admin`

  return catchErr(
    http.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  )
}

// 上傳次要圖片
/**
 * @param {string} procudtId
 * @param {string} subPhotoId
 * @param {binary} file
 */
export const uploadSubPhotoApi = (formData) => {
  const url = `${baseUrl}/upload_sub_photo_admin`

  return catchErr(
    http.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  )
}

// 刪除主要圖片
/**
 * @param {string} procudtId
 */
export const deleteMainPhotoApi = (query) => {
  const url = `${baseUrl}/delete_main_photo_admin`
  return catchErr(http.post(url, { ...query }))
}

// 刪除次要圖片
/**
 * @param {string} procudtId
 * @param {string} subPhotoId
 * @param {string} fileKey
 */
export const deleteSubPhotoApi = (query) => {
  const url = `${baseUrl}/delete_sub_photo_admin`
  return catchErr(http.post(url, { ...query }))
}
