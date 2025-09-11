import { useState, useEffect, useReducer, useRef } from 'react'
// router
import { useNavigate, useSearchParams } from 'react-router-dom'
// ui
import LoadingCover from '@comp/ui/LoadingCover'
// mui
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Pagination from '@mui/material/Pagination'
// utils
import { formatCurrency } from '@/utils/utils'
// hook
import { useError } from '@/hook/useError'
// api
import { queryAllOrdersApi } from '@/api/order'
// reducer
import { initOrders, ordersReducer } from '@/reducer/orders'
// redux
import { useDispatch } from 'react-redux'
// icon
import SearchIcon from '@mui/icons-material/Search'
// component
import PageTitle from '@comp/adminPanel/PageTitle'
import NoData from '@comp/adminPanel/NoData'

export default function Orders() {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const title = '帳單管理'

  const controllerRef = useRef(null)

  const handleError = useError()

  // url 查詢參數
  const [searchParams, setSearchParams] = useSearchParams()
  const urlSreach = {
    orderNo: searchParams.get('orderNo') || '',
    account: searchParams.get('account') || '',
    email: searchParams.get('email') || '',
    orderStatus: searchParams.get('orderStatus') || 'all',
    totalAmount: {
      gte: searchParams.get('totalAmount_gte') || '',
      lte: searchParams.get('totalAmount_lte') || ''
    },
    currentPage: searchParams.get('currentPage') * 1 || 1
  }

  // 查詢結果表格
  const tableHead = ['訂單編號', '帳號', '信箱', '總價', '訂單狀態', '查看']

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

  // 查詢所有訂單
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orders, ordersDispatch] = useReducer(ordersReducer, initOrders)
  const [lastQuery, setLastQuery] = useState('')

  // 預設查詢
  useEffect(() => {
    ordersDispatch({ type: 'search', payload: urlSreach })
    queryAllOrders(urlSreach)
    setLastQuery(JSON.stringify(orders.search))
    setSearchParams({}, { replace: true })

    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  function queryAllOrders(queryOverride) {
    if (ordersLoading) return

    // 中止前一次請求
    if (controllerRef.current) controllerRef.current.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    const { signal } = controller

    setOrdersLoading(true)
    const query = queryOverride ? queryOverride : { ...orders.search }
    if (!queryOverride) {
      query.currentPage = 1
      ordersDispatch({ type: 'set-page', payload: 1 })
    }

    for (const key in query) {
      if (key !== 'orderStatus') {
        if (
          query[key] === '' ||
          query[key] === 'all' ||
          query[key] === null ||
          query[key] === '0'
        )
          delete query[key]
      }

      if (key === 'orderStatus') {
        if (query[key] === '' || query[key] === 'all' || query[key] === null)
          delete query[key]
      }
    }

    if (query.totalAmount?.gte) query.totalAmount.gte = query.totalAmount.gte * 1
    if (query.totalAmount?.lte) query.totalAmount.lte = query.totalAmount.lte * 1

    queryAllOrdersApi(query, signal)
      .then((res) => {
        if (res.status === 200) {
          const data = res.data

          ordersDispatch({
            type: 'update',
            field: 'orders',
            payload: data.data
          })

          ordersDispatch({
            type: 'update',
            field: 'totalPages',
            payload: data.totalPages
          })

          ordersDispatch({
            type: 'update',
            field: 'dataCount',
            payload: data.dataCount
          })

          if (!queryOverride) setLastQuery(JSON.stringify(orders.search))
        }
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || err?.name === 'CanceledError') return

        handleError(err)
      })
      .finally(() => {
        setOrdersLoading(false)
      })
  }

  // 分頁查詢
  function queryOrdersByPage(_e, page) {
    ordersDispatch({
      type: 'obj-update',
      field: 'currentPage',
      payload: { currentPage: page }
    })

    const query = { ...JSON.parse(lastQuery), currentPage: page }
    const queryStr = JSON.stringify(query)

    queryAllOrders(query)

    ordersDispatch({
      type: 'update',
      field: 'search',
      payload: { ...JSON.parse(queryStr) }
    })
  }

  // 選單
  function selectOnBlur(e) {
    const v = e.target.value

    ordersDispatch({
      type: 'obj-update',
      field: 'search',
      payload: { orderStatus: v }
    })
  }

  // 輸入
  function inputOnBlurName(fieldName, e) {
    const v = e.target.value.trim()

    ordersDispatch({
      type: 'obj-update',
      field: 'search',
      payload: { [fieldName]: v }
    })
  }

  function onChangetotalAmount(field, e) {
    console.log(field)
    const v = e.target.value

    const type = field === 'gte' ? 'totalAmount-gte' : 'totalAmount-lte'

    ordersDispatch({ type, payload: v })
  }

  function inputOnBlurtotalAmount(fieldName, e) {
    const v = e.target.value

    if (fieldName === 'totalAmountGte') {
      if (v * 1 <= 0) {
        e.target.value = ''
        ordersDispatch({ type: 'totalAmount-gte-err', payload: '' })

        return
      }

      const lte = orders.search.totalAmount?.lte ? orders.search.totalAmount.lte * 1 : 0

      if (v * 1 >= lte && lte > 0) {
        ordersDispatch({ type: 'totalAmount-lte-err', payload: '' })
        ordersDispatch({ type: 'totalAmount-gte-err', payload: `不可大於或等於 ${lte}` })

        return
      }

      ordersDispatch({ type: 'clear-err' })
      ordersDispatch({ type: 'totalAmount-gte', payload: v })
    }

    if (fieldName === 'totalAmountLte') {
      if (v * 1 <= 0) {
        ordersDispatch({ type: 'totalAmount-lte', payload: '' })
        ordersDispatch({ type: 'totalAmount-lte-err', payload: '' })

        return
      }

      const gte = orders.search.totalAmount?.gte ? orders.search.totalAmount.gte * 1 : 0

      if (v * 1 <= gte && gte > 0) {
        ordersDispatch({ type: 'totalAmount-gte-err', payload: '' })
        ordersDispatch({ type: 'totalAmount-lte-err', payload: `不可小於或等於 ${gte}` })

        return
      }

      ordersDispatch({ type: 'clear-err' })
      ordersDispatch({ type: 'totalAmount-lte', payload: v })
    }
  }

  // 查看訂單資訊
  function checkAccount(orderNo) {
    const search = { ...orders.search }
    search.totalAmount_gte = search.totalAmount.gte
    search.totalAmount_lte = search.totalAmount.lte
    delete search.totalAmount

    nav(`/admin_panel/order/${orderNo}`, { state: { search } })
  }

  return (
    <main className="page-view">
      <PageTitle title={title}></PageTitle>

      <div
        id="orders"
        className={ordersLoading ? 'extend content' : 'extend content scroll-wrap-y'}
      >
        <section className="content-container">
          <section className="search-container content-item">
            <div className="search-wrap">
              <TextField
                key="account-input"
                value={orders.search.account ?? ''}
                label="帳號"
                variant="standard"
                onChange={(e) => inputOnBlurName('account', e)}
              />

              <TextField
                key="email-input"
                value={orders.search.email ?? ''}
                label="信箱"
                variant="standard"
                onChange={(e) => inputOnBlurName('email', e)}
              />

              <TextField
                key="order-no-input"
                value={orders.search.orderNo ?? ''}
                label="訂單編號"
                variant="standard"
                onChange={(e) => inputOnBlurName('orderNo', e)}
              />

              <TextField
                key="totalAmount-gte-input"
                type="number"
                value={orders.search.totalAmount.gte}
                label="總價大於"
                variant="standard"
                error={Boolean(orders.totalAmountGteErr)}
                helperText={orders.totalAmountGteErr || ' '}
                onChange={(e) => onChangetotalAmount('gte', e)}
                onBlur={(e) => inputOnBlurtotalAmount('totalAmountGte', e)}
              />

              <TextField
                key="totalAmount-lte-input"
                type="number"
                value={orders.search.totalAmount.lte}
                label="總價小於"
                variant="standard"
                error={Boolean(orders.totalAmountLteErr)}
                helperText={orders.totalAmountLteErr || ' '}
                onChange={(e) => onChangetotalAmount('lte', e)}
                onBlur={(e) => inputOnBlurtotalAmount('totalAmountLte', e)}
              />

              <FormControl variant="standard">
                <InputLabel id="searcg-enable">訂單狀態</InputLabel>
                <Select
                  labelId="searcg-enable"
                  value={orders.search.orderStatus ?? 'all'}
                  label="訂單狀態"
                  onChange={(e) => selectOnBlur(e)}
                >
                  <MenuItem value={'all'}>全部</MenuItem>
                  <MenuItem value={'pending'}>準備中</MenuItem>
                  <MenuItem value={'shipping'}>運送中</MenuItem>
                  <MenuItem value={'completed'}>已完成</MenuItem>
                  <MenuItem value={'cancelled'}>已取消</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="action-wrap">
              <div className="btn" onClick={() => queryAllOrders()}>
                <span>查詢</span>
              </div>
            </div>
          </section>

          <section className="content-list-container">
            <div className="action-wrap">
              {orders.totalPages > 1 ? (
                <Pagination
                  className="pages"
                  count={orders.totalPages}
                  page={orders.search.currentPage}
                  onChange={queryOrdersByPage}
                  color="primary"
                />
              ) : null}
            </div>

            <div className="content-table-container loading-container scroll-wrap-x">
              <LoadingCover open={ordersLoading} />

              {orders.orders.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      {tableHead.map((item) => (
                        <th key={item}>
                          <span>{item}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {orders.orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span>{order.orderNo}</span>
                        </td>

                        <td>
                          <span>{order.account}</span>
                        </td>

                        <td>
                          <span>{order.email}</span>
                        </td>

                        <td>
                          <span>{formatCurrency(order.totalAmount)}</span>
                        </td>

                        <td>
                          <span>{orderStatusName(order.orderStatus)}</span>
                        </td>

                        <td>
                          <div className="icon-action">
                            <SearchIcon
                              sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '30px' }}
                              onClick={() => checkAccount(order.orderNo)}
                            ></SearchIcon>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <NoData></NoData>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}
