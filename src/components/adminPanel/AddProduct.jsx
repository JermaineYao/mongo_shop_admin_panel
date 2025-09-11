import { useState, useReducer } from 'react'
// ui
import LoadingCover from '@comp/ui/LoadingCover'
// mui
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputAdornment from '@mui/material/InputAdornment'
// api
import { addProductApi, checkProductNameApi } from '@/api/product'
// reducer
import { initNewProduct, addProductReducer } from '@/reducer/addProduct'
// redux
import { setMsg, toggleMsg } from '@/store/slice/msgSlice'
// icon
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

export default function AddProduct(props) {
  const { setOpenModal, cancelAddingProduct, dispatch, handleError } = props

  const [openAddLoading, setOpenAddLoading] = useState(false)
  const [product, productDispatch] = useReducer(addProductReducer, initNewProduct)

  function nameOnBlur(field, e) {
    const v = e.target.value.trim()

    if (field === 'name-main') {
      if (v.length === 0) {
        productDispatch({
          type: 'update',
          field: 'productNameMainErr',
          payload: '商品主名稱必填'
        })
        return
      }
    }

    if (field === 'name-sub') {
      if (v.length === 0) {
        productDispatch({
          type: 'update',
          field: 'productNameSubErr',
          payload: '商品副名稱必填'
        })
        return
      }
    }

    checkProductName(field, v)
  }

  // 檢查名稱
  function checkProductName(field, name) {
    const query =
      field === 'name-main' ? { productNameMain: name } : { productNameSub: name }

    const fieldName = field === 'name-main' ? 'productNameMain' : 'productNameSub'
    const fieldNameErr =
      field === 'name-main' ? 'productNameMainErr' : 'productNameSubErr'

    checkProductNameApi(query)
      .then((res) => {
        if (res.status === 200) {
          productDispatch({ type: 'update', field: fieldName, payload: name })
          productDispatch({ type: 'update', field: fieldNameErr, payload: '' })
        }
      })
      .catch((err) => {
        if (err.response.status === 409) {
          productDispatch({
            type: 'update',
            field: fieldNameErr,
            payload: err.response.data.msg
          })
        }
      })
  }

  function numberOnChange(field, e) {
    const raw = e.target.value
    const num = raw === '' ? '' : Number(raw)

    productDispatch({ type: 'update', field, payload: num < 0 ? 0 : num })
  }

  // 新增商品
  function addProduct() {
    if (openAddLoading) return

    if (product.productNameMainErr.length > 0 || product.productNameSubErr.length > 0)
      return

    const query = {
      productNameMain: product.productNameMain,
      productNameSub: product.productNameSub,
      price: product.price * 1,
      category: product.category,
      inStock: product.inStock * 1,
      description: product.description
    }

    addProductApi(query)
      .then((res) => {
        if (res.status === 201) {
          const msg = res.data.msg

          dispatch(toggleMsg({ open: true }))
          dispatch(
            setMsg({
              msg,
              severity: 'success'
            })
          )

          cancelAddingProduct()
        }
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        setOpenAddLoading(false)
      })
  }

  return (
    <article className="add-product loading-container">
      <div className="add-product-container">
        <LoadingCover open={openAddLoading}></LoadingCover>

        <span className="caption">新增商品</span>

        <div className="input-wrap">
          <TextField
            key="name-main"
            defaultValue={product.productNameMain || ''}
            label="商品主名稱 *"
            variant="standard"
            error={Boolean(product.productNameMainErr)}
            helperText={product.productNameMainErr || ' '}
            onBlur={(e) => nameOnBlur('name-main', e)}
          ></TextField>

          <TextField
            key="name-sub"
            defaultValue={product.productNameSub || ''}
            label="商品副名稱 *"
            variant="standard"
            error={Boolean(product.productNameSubErr)}
            helperText={product.productNameSubErr || ' '}
            onBlur={(e) => nameOnBlur('name-sub', e)}
          ></TextField>

          <div className="input-sub-wrap">
            <TextField
              key="peoduct-price"
              type="number"
              value={product.price}
              label="單價"
              variant="standard"
              onChange={(e) => numberOnChange('price', e)}
            />

            <TextField
              key="product-instock"
              type="number"
              value={product.inStock}
              label="庫存"
              variant="standard"
              onChange={(e) => numberOnChange('inStock', e)}
            />

            <FormControl variant="standard">
              <InputLabel id="product-category">商品分類</InputLabel>
              <Select
                labelId="product-category"
                value={product.category ?? '0'}
                label="是否啟用"
                onChange={(e) =>
                  productDispatch({
                    type: 'update',
                    field: 'category',
                    payload: e.target.value
                  })
                }
              >
                <MenuItem value={'0'}>碗</MenuItem>
                <MenuItem value={'1'}>瓶子</MenuItem>
                <MenuItem value={'2'}>杯子</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="description-wrap">
            <div
              className="btn add-description"
              onClick={() =>
                productDispatch({
                  type: 'desc-add',
                  payload: ''
                })
              }
            >
              <span>商品描述</span>

              <AddCircleOutlineIcon></AddCircleOutlineIcon>
            </div>

            {product.description.map((d, index) => {
              return (
                <TextField
                  key={`description-${index}`}
                  value={d}
                  label="商品描述"
                  variant="standard"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <RemoveCircleIcon
                            onClick={() =>
                              productDispatch({
                                type: 'desc-remove',
                                payload: { index }
                              })
                            }
                          />
                        </InputAdornment>
                      )
                    }
                  }}
                  onChange={(e) =>
                    productDispatch({
                      type: 'desc-update',
                      payload: { index, value: e.target.value }
                    })
                  }
                />
              )
            })}
          </div>
        </div>

        <div className="action-wrap">
          <div className="btn" onClick={addProduct}>
            <span>新增商品</span>
          </div>

          <div className="btn" onClick={() => setOpenModal(false)}>
            <span>取消</span>
          </div>
        </div>
      </div>
    </article>
  )
}
