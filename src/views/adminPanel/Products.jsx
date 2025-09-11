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
import Switch from '@mui/material/Switch'
import Pagination from '@mui/material/Pagination'
// utils
import { formatCurrency } from '@/utils/utils'
// hook
import { useError } from '@/hook/useError'
// api
import { queryAllProductsApi, toggleProductEnableApi } from '@/api/product'
// reducer
import { initProducts, productsReducer } from '@/reducer/products'
// redux
import { useDispatch } from 'react-redux'
import { setMsg, toggleMsg } from '@/store/slice/msgSlice'
// icon
import SearchIcon from '@mui/icons-material/Search'
// component
import AddProduct from '@comp/adminPanel/AddProduct'
import PageTitle from '@comp/adminPanel/PageTitle'
import NoData from '@comp/adminPanel/NoData'

export default function Products() {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const title = '商品管理'

  const controllerRef = useRef(null)

  const handleError = useError()

  // url 查詢參數
  const [searchParams, setSearchParams] = useSearchParams()
  const urlSreach = {
    productNameMain: searchParams.get('productNameMain') || '',
    productNameSub: searchParams.get('productNameSub') || '',
    category: searchParams.get('category') || 'all',
    enable: getEnable(searchParams.get('enable')),
    currentPage: searchParams.get('currentPage') * 1 || 1
  }

  function getEnable(v) {
    if (v === 'false') return false
    if (v === 'true') return true

    return 'all'
  }

  // 查詢結果表格
  const tableHead = ['商品名稱', '分類', '單價 (NTD)', '庫存', '是否啟用', '查看']
  // const tableHead = [
  //   '商品主名稱',
  //   '商品副名稱',
  //   '分類',
  //   '單價 (NTD)',
  //   '庫存',
  //   '是否啟用',
  //   '查看'
  // ]

  function categoryName(category) {
    switch (category) {
      case '0':
        return '碗'

      case '1':
        return '瓶子'

      case '2':
        return '杯子'
    }
  }

  // 查詢所有商品
  const [productsLoading, setProductsLoading] = useState(false)
  const [products, productsDispatch] = useReducer(productsReducer, initProducts)
  const [lastQuery, setLastQuery] = useState('')

  // 預設查詢
  useEffect(() => {
    productsDispatch({ type: 'search', payload: urlSreach })
    queryAllProducts(urlSreach)
    setLastQuery(JSON.stringify(products.search))
    setSearchParams({}, { replace: true })

    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  // 查詢所有張品
  function queryAllProducts(queryOverride) {
    if (productsLoading) return

    // 中止前一次請求
    if (controllerRef.current) controllerRef.current.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    const { signal } = controller

    setProductsLoading(true)
    const query = queryOverride ? queryOverride : { ...products.search }
    if (!queryOverride) {
      query.currentPage = 1
      productsDispatch({ type: 'set-page', payload: 1 })
    }

    for (const key in query) {
      if (key !== 'category') {
        if (
          query[key] === '' ||
          query[key] === 'all' ||
          query[key] === null ||
          query[key] === '0'
        )
          delete query[key]
      }

      if (key === 'category') {
        if (query[key] === '' || query[key] === 'all' || query[key] === null)
          delete query[key]
      }
    }

    if (query.price?.gte) query.price.gte = query.price.gte * 1
    if (query.price?.lte) query.price.lte = query.price.lte * 1

    queryAllProductsApi(query, signal)
      .then((res) => {
        if (res.status === 200) {
          const data = res.data

          productsDispatch({ type: 'products', payload: data.data })

          productsDispatch({
            type: 'total-page',
            payload: data.totalPages
          })

          productsDispatch({
            type: 'data-count',
            payload: data.dataCount
          })

          if (!queryOverride) setLastQuery(JSON.stringify(products.search))
        }
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || err?.name === 'CanceledError') return

        handleError(err)
      })
      .finally(() => {
        setProductsLoading(false)
      })
  }

  // 分頁查詢
  function queryProductsByPage(_e, page) {
    productsDispatch({ type: 'set-page', payload: page })
    const query = { ...JSON.parse(lastQuery), currentPage: page }
    const queryStr = JSON.stringify(query)

    queryAllProducts(query)

    productsDispatch({ type: 'search', payload: { ...JSON.parse(queryStr) } })
  }

  // 選單
  function selectOnBlur(fieldName, e) {
    const v = e.target.value
    const setField = fieldName === 'category' ? { category: v } : { enable: v }

    productsDispatch({
      type: 'search',
      payload: setField
    })
  }

  // 輸入
  function inputOnBlurName(fieldName, e) {
    const v = e.target.value
    const setField =
      fieldName === 'productNameMain' ? { productNameMain: v } : { productNameSub: v }

    productsDispatch({
      type: 'search',
      payload: setField
    })
  }

  function onChangePrice(field, e) {
    const raw = e.target.value

    productsDispatch({
      type: 'search',
      payload: {
        price: {
          ...products.search.price,
          [field]: raw
        }
      }
    })
  }

  function inputOnBlurPrice(fieldName, e) {
    const v = e.target.value

    if (fieldName === 'priceGte') {
      if (v * 1 <= 0) {
        e.target.value = ''
        productsDispatch({ type: 'price-gte-err', payload: '' })

        return
      }

      const lte = products.search.price?.lte ? products.search.price.lte * 1 : 0

      if (v * 1 >= lte && lte > 0) {
        productsDispatch({ type: 'price-lte-err', payload: '' })
        productsDispatch({ type: 'price-gte-err', payload: `不可大於或等於 ${lte}` })

        return
      }

      productsDispatch({ type: 'clear-err' })
      productsDispatch({ type: 'price-gte', payload: v })
    }

    if (fieldName === 'priceLte') {
      if (v * 1 <= 0) {
        productsDispatch({ type: 'price-lte', payload: '' })
        productsDispatch({ type: 'price-lte-err', payload: '' })

        return
      }

      const gte = products.search.price?.gte ? products.search.price.gte * 1 : 0

      if (v * 1 <= gte && gte > 0) {
        productsDispatch({ type: 'price-gte-err', payload: '' })
        productsDispatch({ type: 'price-lte-err', payload: `不可小於或等於 ${gte}` })

        return
      }

      productsDispatch({ type: 'clear-err' })
      productsDispatch({ type: 'price-lte', payload: v })
    }
  }

  // 新增帳號
  const [openModal, setOpenModal] = useState(false)

  function cancelAddingProduct() {
    queryAllProducts()
    setOpenModal(false)
  }

  // 啟用, 停用商品
  function toggleProductEnable(enable, id, product) {
    const query = {
      productId: id,
      enable
    }

    toggleProductEnableApi(query)
      .then((res) => {
        if (res.status === 200) {
          const msg = res.data.msg

          productsDispatch({
            type: 'update-product',
            payload: { _id: id, update: { enable } }
          })

          dispatch(toggleMsg({ open: true }))
          dispatch(
            setMsg({
              msg: `商品 ${product.productNameMain} ${msg}`,
              severity: 'success'
            })
          )
        }
      })
      .catch((err) => {
        handleError(err)
      })
  }

  function toggleEnable(e, id, product) {
    const enable = e.target.checked

    toggleProductEnable(enable, id, product)
  }

  // 查看商品資訊
  function checkAccount(id) {
    nav(`/admin_panel/product/${id}`, { state: { search: products.search } })
  }

  return (
    <main className="page-view">
      <PageTitle title={title}></PageTitle>

      {openModal ? (
        <AddProduct
          setOpenModal={setOpenModal}
          cancelAddingProduct={cancelAddingProduct}
          dispatch={dispatch}
          handleError={handleError}
        ></AddProduct>
      ) : null}

      <div
        id="products"
        className={productsLoading ? 'extend content' : 'extend content scroll-wrap-y'}
      >
        <section className="content-container">
          <section className="search-container content-item">
            <div className="search-wrap">
              <TextField
                key="name-main-input"
                value={products.search.productNameMain ?? ''}
                label="商品主名稱"
                variant="standard"
                onChange={(e) => inputOnBlurName('productNameMain', e)}
              />

              <TextField
                key="name-sub-input"
                value={products.search.productNameSub ?? ''}
                label="商品副名稱"
                variant="standard"
                onChange={(e) => inputOnBlurName('productNameSub', e)}
              />

              <TextField
                key="price-gte-input"
                type="number"
                value={products.search.price.gte}
                label="單價大於"
                variant="standard"
                error={Boolean(products.priceGteErr)}
                helperText={products.priceGteErr || ' '}
                onChange={(e) => onChangePrice('gte', e)}
                onBlur={(e) => inputOnBlurPrice('priceGte', e)}
              />

              <TextField
                key="price-lte-input"
                type="number"
                value={products.search.price.lte}
                label="單價小於"
                variant="standard"
                error={Boolean(products.priceLteErr)}
                helperText={products.priceLteErr || ' '}
                onChange={(e) => onChangePrice('lte', e)}
                onBlur={(e) => inputOnBlurPrice('priceLte', e)}
              />

              <FormControl variant="standard">
                <InputLabel id="searcg-category">商品分類</InputLabel>
                <Select
                  labelId="searcg-category"
                  value={products.search.category ?? 'all'}
                  label="是否啟用"
                  onChange={(e) => selectOnBlur('category', e)}
                >
                  <MenuItem value={'all'}>全部</MenuItem>
                  <MenuItem value={'0'}>碗</MenuItem>
                  <MenuItem value={'1'}>瓶子</MenuItem>
                  <MenuItem value={'2'}>杯子</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="standard">
                <InputLabel id="searcg-enable">是否啟用</InputLabel>
                <Select
                  labelId="searcg-enable"
                  value={products.search.enable ?? 'all'}
                  label="是否啟用"
                  onChange={(e) => selectOnBlur('enable', e)}
                >
                  <MenuItem value={'all'}>全部</MenuItem>
                  <MenuItem value={true}>啟用</MenuItem>
                  <MenuItem value={false}>停用</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="action-wrap">
              <div className="btn" onClick={() => queryAllProducts()}>
                <span>查詢</span>
              </div>
            </div>
          </section>

          <section className="content-list-container">
            <div className="action-wrap">
              {products.totalPages > 1 ? (
                <Pagination
                  className="pages"
                  count={products.totalPages}
                  page={products.search.currentPage}
                  onChange={queryProductsByPage}
                  color="primary"
                />
              ) : null}

              <div className="btn" onClick={() => setOpenModal(true)}>
                <span>新增商品</span>
              </div>
            </div>

            <div className="content-table-container loading-container scroll-wrap-x">
              <LoadingCover open={productsLoading} />

              {products.products.length > 0 ? (
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
                    {products.products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="product-name-wrap">
                            <span className="name-main">{product.productNameMain}</span>
                            <span className="name-sub">{product.productNameSub}</span>
                          </div>
                        </td>

                        <td>
                          <span>{categoryName(product.category)}</span>
                        </td>

                        <td>
                          <span>{formatCurrency(product.price)}</span>
                        </td>

                        <td>
                          <span>{product.inStock}</span>
                        </td>

                        <td>
                          <span className={product.enable ? '' : 'not-active'}>停用</span>
                          <Switch
                            checked={product.enable}
                            onChange={(e) => toggleEnable(e, product._id, product)}
                            color="default"
                          />
                          <span className={product.enable ? 'is-active' : ''}>啟用</span>
                        </td>

                        <td>
                          <div className="icon-action">
                            <SearchIcon
                              sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '30px' }}
                              onClick={() => checkAccount(product._id)}
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
