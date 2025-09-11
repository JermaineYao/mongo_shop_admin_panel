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
import TextareaAutosize from '@mui/material/TextareaAutosize'
// utils
import { formatCurrency } from '@/utils/utils'
// api
import { updateProductApi } from '@/api/product'
// redux
import { setMsg, toggleMsg } from '@/store/slice/msgSlice'
// icon
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

export default function Content(props) {
  const { dispatch, handleError, product, productDispatch, queryProduct } = props

  // 修改商品
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)

  function updateProduct() {
    if (loading) return

    setLoading(true)
    const query = {
      productId: product.productId,
      category: product.category,
      price: product.price * 1,
      inStock: product.inStock * 1,
      description: product.description,
      size: product.size
    }

    updateProductApi(query)
      .then((res) => {
        if (res.status === 200) {
          cancelEdit()
          const msg = res.data.msg

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
      .finally(() => {
        setLoading(false)
      })
  }

  function cancelEdit() {
    setEdit(false)
    queryProduct()
  }

  function numberOnChange(field, e) {
    const raw = e.target.value
    const num = raw === '' ? '' : Number(raw)

    productDispatch({ type: 'update', field, payload: num < 0 ? 0 : num })
  }

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

  return (
    <section className="product-content-container product-wrap">
      <LoadingCover open={loading}></LoadingCover>

      {edit ? (
        <div className="action-wrap">
          <div className="btn" onClick={updateProduct}>
            <span>儲存</span>
          </div>

          <div className="btn" onClick={cancelEdit}>
            <span>取消</span>
          </div>
        </div>
      ) : (
        <div className="action-wrap" onClick={() => setEdit(true)}>
          <div className="btn">
            <span>編輯</span>
          </div>
        </div>
      )}

      {edit ? (
        <article className="input-sub-wrap">
          <TextField
            key="peoduct-price"
            type="number"
            value={product.price ?? ''}
            label="商品單價 (NTD)"
            variant="standard"
            onChange={(e) => numberOnChange('price', e)}
          />

          <TextField
            key="product-instock"
            type="number"
            value={product.inStock}
            label="商品庫存"
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
        </article>
      ) : (
        <article className="input-sub-wrap not-edit">
          <div className="product-item-wrap">
            <span className="item-name">商品單價 (NTD)</span>
            <span className="item-value">{formatCurrency(product.price)}</span>
          </div>

          <div className="product-item-wrap">
            <span className="item-name">商品庫存</span>
            <span className="item-value">{product.inStock}</span>
          </div>

          <div className="product-item-wrap">
            <span className="item-name">商品分類</span>
            <span className="item-value">{categoryName(product.category)}</span>
          </div>
        </article>
      )}

      {edit ? (
        <article className="size-wrap">
          <span>尺寸</span>
          <TextareaAutosize
            className="input-textarea"
            value={product.size}
            aria-label="minimum height"
            minRows={3}
            onChange={(e) =>
              productDispatch({
                type: 'update',
                field: 'size',
                payload: e.target.value.trim()
              })
            }
          />
        </article>
      ) : (
        <article className="product-item-wrap">
          <span className="item-name">尺寸</span>
          <pre className="item-value">{product.size}</pre>
        </article>
      )}

      {edit ? (
        <article className="description-wrap">
          <div
            className="btn add-description"
            onClick={() =>
              productDispatch({
                type: 'arr-add',
                field: 'description',
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
                variant="standard"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <RemoveCircleIcon
                          onClick={() =>
                            productDispatch({
                              type: 'arr-remove',
                              field: 'description',
                              payload: index
                            })
                          }
                        />
                      </InputAdornment>
                    )
                  }
                }}
                onChange={(e) =>
                  productDispatch({
                    type: 'arr-update',
                    field: 'description',
                    payload: { index, value: e.target.value.trim() }
                  })
                }
              />
            )
          })}
        </article>
      ) : (
        <article className="product-item-wrap align-start">
          <span className="item-name">商品描述</span>

          {product.description?.length > 0
            ? product.description.map((d, index) => (
                <span className="item-value" key={index}>
                  {d}
                </span>
              ))
            : null}
        </article>
      )}
    </section>
  )
}
