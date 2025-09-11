import { useState, useReducer, useEffect, useRef } from 'react'
// router
import { useLocation, useNavigate, useParams } from 'react-router-dom'
// ui
import LoadingCover from '@comp/ui/LoadingCover'
// hook
import { useError } from '@/hook/useError'
// api
import { queryProductApi } from '@/api/product'
// reducer
import { initProduct, productReducer } from '@/reducer/product'
// redux
import { useDispatch } from 'react-redux'
// icon
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
// component
import PageTitle from '@comp/adminPanel/PageTitle'
import Name from '@comp/adminPanel/product/Name'
import Photo from '@comp/adminPanel/product/Photo'
import Content from '@comp/adminPanel/product/Content'

export default function ProductDetail() {
  const dispatch = useDispatch()
  const title = '商品資訊'
  const controllerRef = useRef(null)
  const routerState = useLocation().state
  const productId = useParams().id

  const nav = useNavigate()

  const handleError = useError()

  useEffect(() => {
    queryProduct()

    return () => {
      controllerRef.current?.abort()
    }
  }, [productId])

  // 取得帳號資料
  const [product, productDispatch] = useReducer(productReducer, initProduct)
  const [productLoading, setProductLoading] = useState(false)

  function queryProduct() {
    if (productLoading) return

    // 中止前一次請求
    if (controllerRef.current) controllerRef.current.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    const { signal } = controller

    setProductLoading(true)

    queryProductApi(productId, signal)
      .then((res) => {
        if (res.status === 200) {
          const resData = res.data.data

          resData.mainPhoto.loading = false
          resData.subPhotos.forEach((p) => (p.loading = false))

          productDispatch({ type: 'init', payload: resData })
        }
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        setProductLoading(false)
      })
  }

  // 回帳號管理
  function returnToProducts() {
    const params = new URLSearchParams(routerState.search)
    nav(`/admin_panel/products?${params.toString()}`)
  }

  return (
    <div className="page-view has-return-btn">
      <PageTitle title={title}></PageTitle>

      <div className="btn return" onClick={returnToProducts}>
        <KeyboardDoubleArrowLeftIcon
          sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '30px' }}
        />
        <span>回商品管理</span>
      </div>

      <main id="product" className="extend loading-container scroll-wrap-y">
        <LoadingCover open={productLoading} />

        <section className="product-container">
          <Name
            dispatch={dispatch}
            handleError={handleError}
            productDispatch={productDispatch}
            product={product}
            queryProduct={queryProduct}
          ></Name>

          <Content
            dispatch={dispatch}
            handleError={handleError}
            product={product}
            productDispatch={productDispatch}
            queryProduct={queryProduct}
          ></Content>

          <Photo
            dispatch={dispatch}
            handleError={handleError}
            productDispatch={productDispatch}
            product={product}
          ></Photo>
        </section>
      </main>
    </div>
  )
}
