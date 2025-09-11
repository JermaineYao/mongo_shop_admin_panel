// mui
import Switch from '@mui/material/Switch'
// api
import { toggleProductEnableApi } from '@/api/product'
// redux
import { setMsg, toggleMsg } from '@/store/slice/msgSlice'

export default function Name(props) {
  const { dispatch, handleError, productDispatch, product } = props

  // 啟用, 停用商品
  function toggleProductEnable(enable) {
    const query = {
      productId: product.productId,
      enable
    }

    toggleProductEnableApi(query)
      .then((res) => {
        if (res.status === 200) {
          const msg = res.data.msg

          productDispatch({ type: 'update', field: 'enable', payload: enable })

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

  function toggleEnable(e) {
    const enable = e.target.checked

    toggleProductEnable(enable)
  }

  return (
    <article className="product-name-container">
      <div className="product-name-wrap">
        <span className="name-main">{product.productNameMain}</span>
        <span className="name-sub">{product.productNameSub}</span>
      </div>

      <hr />

      <div className="product-active-container">
        <span className={product.enable ? '' : 'not-active'}>停用</span>
        <Switch checked={product.enable} onChange={toggleEnable} color="default" />
        <span className={product.enable ? 'is-active' : ''}>啟用</span>
      </div>
    </article>
  )
}
