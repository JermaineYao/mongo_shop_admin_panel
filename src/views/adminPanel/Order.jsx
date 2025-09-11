import { useState, useReducer, useEffect } from 'react'
// router
import { useLocation, useNavigate, useParams } from 'react-router-dom'
// ui
import LoadingCover from '@comp/ui/LoadingCover'
// utils
import { formatCurrency } from '@/utils/utils'
// hook
import { useError } from '@/hook/useError'
// api
import { queryOrderApi, updateOrderStatusApi } from '@/api/order'
// reducer
import { initAccount, accountReducer } from '@/reducer/account'
// redux
import { useDispatch } from 'react-redux'
import { setMsg, toggleMsg } from '@/store/slice/msgSlice'
// icon
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
// component
import PageTitle from '@comp/adminPanel/PageTitle'
import Info from '@comp/adminPanel/user/Info'
import Contact from '@comp/adminPanel/user/Contact'

export default function Order() {
  const dispatch = useDispatch()
  const title = '商品資訊'
  const routerState = useLocation().state
  const orderNo = useParams().orderNo

  const nav = useNavigate()

  const handleError = useError()

  const ORDER_TRANSITIONS = {
    pending: ['shipping', 'cancelled'], // 訂單確認中 → 可出貨或取消
    shipping: ['completed', 'cancelled'], // 運送中 → 收貨完成 or 退貨取消
    completed: [], // 完成後不可再改
    cancelled: [] // 取消後不可再改
  }

  function orderStatusName(orderStatus) {
    switch (orderStatus) {
      case 'pending':
        return '準備中'

      case 'shipping':
        return '運送中'

      case 'completed':
        return '已完成'

      case 'cancelled':
        return '已取消'
    }
  }

  function orderStatusClass(orderStatus) {
    return `order-status ${orderStatus}`
  }

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    queryOrder({ signal })

    return () => controller.abort()
  }, [orderNo])

  // 查詢該訂單
  const [order, setOrder] = useState(null)
  const [orderLoading, setOrderLoading] = useState(false)

  function queryOrder({ signal }) {
    if (orderLoading) return
    setOrderLoading(true)

    queryOrderApi(orderNo, signal)
      .then((res) => {
        const orderData = res.data.data
        setOrder(orderData)
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        setOrderLoading(false)
      })
  }

  function twTime(dateString, options) {
    const date = new Date(dateString)

    return date.toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      ...options
    })
  }

  // 修改訂單狀態
  function updateOrderStatus(nextStatus) {
    if (orderLoading) return
    setOrderLoading(true)

    const controller = new AbortController()
    const signal = controller.signal

    // const query = {
    //   status: nextStatus
    // }

    const id = order._id
    // const currentStatus = order.orderStatus

    updateOrderStatusApi(id, nextStatus, signal)
      .then((res) => {
        if (res.status == 200) {
          dispatch(toggleMsg({ open: true }))
          dispatch(
            setMsg({
              msg: `訂單 ${order.orderNo} 已更新為 ${orderStatusName(nextStatus)}`,
              severity: 'success'
            })
          )

          queryOrder({ signal })
        }
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        setOrderLoading(false)
      })
  }

  // 回帳號管理
  function returnToOrders() {
    const params = new URLSearchParams(routerState.search)
    nav(`/admin_panel/orders?${params.toString()}`)
  }

  return (
    <div className="page-view has-return-btn">
      <PageTitle title={title}></PageTitle>

      <div className="btn return" onClick={returnToOrders}>
        <KeyboardDoubleArrowLeftIcon
          sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '30px' }}
        />
        <span>回訂單管理</span>
      </div>

      <main id="order" className="extend loading-container scroll-wrap-y">
        <LoadingCover open={orderLoading} />

        <section className="order-container">
          <section className="order-base-container">
            {/*----- orderNo, account, email, createdAt, updatedAt, orderStatus -----*/}
            <article className="order-item">
              <div className="orderNo-wrap">
                <span className="order-no">{order?.orderNo ?? ''}</span>

                <div className={orderStatusClass(order?.orderStatus)}>
                  <span>
                    {order?.orderStatus ? orderStatusName(order.orderStatus) : ''}
                  </span>
                </div>
              </div>

              <div className="order-field-wrap">
                <span className="title">建立時間</span>
                <span className="value">
                  {order?.createdAt ? twTime(order.createdAt) : ''}
                </span>
              </div>

              <div className="order-field-wrap">
                <span className="title">更新時間</span>
                <span>{order?.updatedAt ? twTime(order.updatedAt) : ''}</span>
              </div>

              <div className="order-field-wrap">
                <span className="title">帳號</span>
                <span>{order?.account ?? ''}</span>
              </div>

              <div className="order-field-wrap">
                <span className="title">信箱</span>
                <span>{order?.email ?? ''}</span>
              </div>

              <hr />

              <div className="order-status-update">
                {ORDER_TRANSITIONS[order?.orderStatus]?.length > 0 ? (
                  <span>更新狀態為 : </span>
                ) : null}
                <div className="action-wrap">
                  {order?.orderStatus
                    ? ORDER_TRANSITIONS[order?.orderStatus].map((s) => (
                        <div className="btn" key={s} onClick={() => updateOrderStatus(s)}>
                          <span>{orderStatusName(s)}</span>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </article>
          </section>

          <section className="order-receiver-container ">
            <article className="ordered-count-wrap">
              <div className="order-field-wrap">
                <span className="title">總金額</span>
                <span className="value">
                  {order?.totalAmount
                    ? `${formatCurrency(order.totalAmount)} 新台幣`
                    : ''}
                </span>
              </div>

              <div className="order-field-wrap">
                <span className="title">購買件數</span>
                <span className="value">
                  {order?.sumQuantity ? `${order?.sumQuantity} 件` : ''}
                </span>
              </div>

              <div className="order-field-wrap">
                <span className="title">收件人</span>
                <span className="value">{order?.receiver ?? ''}</span>
              </div>

              <div className="order-field-wrap">
                <span className="title">收件地址</span>
                <span className="value">{order?.receiverAddress ?? ''}</span>
              </div>

              <div className="order-field-wrap">
                <span className="title">收件人連絡電話</span>
                <span className="value">{order?.receiverPhoneNumber ?? ''}</span>
              </div>
            </article>
          </section>

          <section className="order-product-container ">
            {order?.productsOrdered?.map((p) => (
              <div className="product-wrap order-wrap" key={p.productId}>
                <div
                  className="photo"
                  style={{
                    background: `url(${p.mainPhoto.url}) center/cover no-repeat`
                  }}
                ></div>

                <div className="name-price-wrap">
                  <div className="name-wrap">
                    <span className="name-main">{p.productNameMain}</span>
                    <span className="name-sub">{p.productNameSub}</span>
                  </div>

                  <div className="price-wrap">
                    <div className="order-field-wrap">
                      <span className="title">單價</span>
                      <span className="value">{`${formatCurrency(p.price)} 新台幣`}</span>
                    </div>

                    <div className="order-field-wrap">
                      <span className="title">購買件數</span>
                      <span className="value">{`${p.quantity} 件`}</span>
                    </div>

                    <div className="order-field-wrap summary pad">
                      <span className="title">小記</span>
                      <span className="value">{`${formatCurrency(p.subtotal)} 新台幣`}</span>
                    </div>
                  </div>
                </div>

                <div className="order-field-wrap summary">
                  <span className="title">小記</span>
                  <span className="value">{`${formatCurrency(p.subtotal)} 新台幣`}</span>
                </div>
              </div>
            )) ?? null}
          </section>
        </section>
      </main>
    </div>
  )
}
