import http from './axios'
import { catchErr } from './catchError'
const baseUrl = '/order'

// 查詢所有商品
export const queryAllOrdersApi = (query, singal) => {
  const url = `${baseUrl}/orders_admin`
  return catchErr(http.post(url, { ...query, singal }))
}

// 查詢該訂單
/**
 * @param {string} orderNo
 */
export const queryOrderApi = (orderNo, signal) => {
  const url = `${baseUrl}/order_admin/${orderNo}`
  return catchErr(http.get(url, { signal }))
}

// 修改訂單狀態
/**
 * PATCH /order_admin/:id/status/:status
 * @param {string} id
 *
 * 下個訂單狀態
 * @param {string<newStatus: 'shipping' | 'completed' | 'cancelled'>} status
 */
export const updateOrderStatusApi = (id, status, singal) => {
  const url = `${baseUrl}/order_admin/${id}/status/${status}`

  return catchErr(http.patch(url, { singal }))
}
