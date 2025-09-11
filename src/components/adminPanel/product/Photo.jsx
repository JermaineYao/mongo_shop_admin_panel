// ui
import LoadingCover from '@comp/ui/LoadingCover'
// mui
import Switch from '@mui/material/Switch'
// api
import {
  uploadMainPhotoApi,
  deleteMainPhotoApi,
  uploadSubPhotoApi,
  deleteSubPhotoApi
} from '@/api/product'
// redux
import { setMsg, toggleMsg } from '@/store/slice/msgSlice'
// icon
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import BackupIcon from '@mui/icons-material/Backup'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

export default function Photo(props) {
  const { dispatch, handleError, productDispatch, product } = props
  const productId = product.productId

  const fileTypes = ['jpg', 'png', 'jpeg', 'gif']

  // 上傳主要圖片
  function uploadUserPhoto(file) {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('productId', productId)

    uploadMainPhotoApi(formData)
      .then((res) => {
        if (res.status === 200) {
          const photo = res.data.data.mainPhoto

          productDispatch({
            type: 'obj-update',
            field: 'mainPhoto',
            payload: { ...photo }
          })
        }
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        mainPhotoLoading(false)
      })
  }

  function mainPhotoLoading(v) {
    productDispatch({ type: 'obj-update', field: 'mainPhoto', payload: { loading: v } })
  }

  // 上傳次要圖片
  function uploadSubPhoto(file, index, subPhotoId) {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('productId', productId)
    formData.append('subPhotoId', subPhotoId)

    uploadSubPhotoApi(formData)
      .then((res) => {
        const photo = res.data.data

        productDispatch({
          type: 'sub-photo-update',
          field: 'subPhotos',
          payload: { index, value: { ...photo } }
        })
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        subPhotoLoading(false, index)
      })
  }

  function subPhotoLoading(v, index) {
    productDispatch({
      type: 'sub-photo-update',
      field: 'subPhotos',
      payload: { index, value: { loading: v } }
    })
  }

  // 上傳共用
  function setPhoto(e, isMain = true, index = null, subPhotoId = null) {
    console.log(index, subPhotoId)
    const fileChosen = e.target

    if (fileChosen && fileChosen.files && fileChosen.files.length > 0) {
      const file = fileChosen.files[0]
      const fileType = file.type.split('/')[1]

      if (!fileTypes.includes(fileType)) {
        return
      }

      if (isMain) {
        mainPhotoLoading(true)
        uploadUserPhoto(file)

        return
      }

      subPhotoLoading(true, index)
      uploadSubPhoto(file, index, subPhotoId)
    }
  }

  function triggerPhotoUpload(id) {
    const upload = document.getElementById(id)
    upload.value = null
    upload.click()
  }

  // 刪除主要圖片
  function deleteMainPhoto() {
    if (product.mainPhoto.loading) return

    mainPhotoLoading(true)

    deleteMainPhotoApi({ productId })
      .then((res) => {
        if (res.status === 200) {
          const photo = res.data.data.mainPhoto
          const enable = res.data.data.enable

          productDispatch({
            type: 'obj-update',
            field: 'mainPhoto',
            payload: { ...photo }
          })

          productDispatch({ type: 'update', field: 'enable', payload: enable })

          dispatch(toggleMsg({ open: true }))
          dispatch(
            setMsg({
              msg: `商品 ${product.productNameMain} 主要圖片已被刪除, 此商品已被停用`,
              severity: 'success'
            })
          )
        }
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        mainPhotoLoading(false)
      })
  }

  // 刪除次要圖片
  function deleteSubPhoto(s, index) {
    if (s.loading) return

    subPhotoLoading(true, index)

    const query = {
      productId,
      subPhotoId: s.subPhotoId,
      fileKey: s.fileKey
    }

    deleteSubPhotoApi(query)
      .then((res) => {
        if (res.status === 200) {
          removeEmptySubPhoto(index)
        }
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        subPhotoLoading(false, index)
      })
  }

  // 新增次要圖片
  function addSubPhoto() {
    const value = {
      createAt: null,
      fileKey: null,
      url: null,
      subPhotoId: null,
      loading: false
    }
    productDispatch({ type: 'arr-add', field: 'subPhotos', payload: value })
  }

  // 移除空的次要圖片
  function removeEmptySubPhoto(index) {
    productDispatch({ type: 'arr-remove', field: 'subPhotos', payload: index })
  }

  return (
    <article className="product-photo-container">
      <div className="main-photo">
        <div className="photo-caption-wrap">
          <span className="photo-caption">商品主要圖片</span>
        </div>

        <div className="photo-container main-photo">
          {product.mainPhoto.url ? (
            <div
              role="button"
              className="photo"
              style={{
                background: `url(${product.mainPhoto.url}) center/cover no-repeat`
              }}
              aria-label="更換主要圖片"
              onClick={() => triggerPhotoUpload('main-photo-upload')}
            ></div>
          ) : (
            <div
              className="empty"
              aria-label="上傳主要圖片"
              onClick={() => triggerPhotoUpload('main-photo-upload')}
            >
              <BackupIcon sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '50px' }} />
            </div>
          )}

          {!product.mainPhoto.url ? null : (
            <div className="delete" aria-label="刪除主要圖片" onClick={deleteMainPhoto}>
              <CancelRoundedIcon
                sx={{ color: 'rgba(18, 0, 59, 0.7);', fontSize: '30px' }}
              />
            </div>
          )}

          <LoadingCover open={product.mainPhoto.loading} />

          <input
            id="main-photo-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e)}
            hidden
          />
        </div>
      </div>

      <div className="sub-photos">
        <div className="photo-caption-wrap">
          <span className="photo-caption">商品次要圖片</span>

          <div className="btn" onClick={addSubPhoto}>
            <span>新增次要圖片</span>

            <AddCircleOutlineIcon></AddCircleOutlineIcon>
          </div>
        </div>

        <div className="sub-photo-wrap">
          {product.subPhotos.map((s, index) => (
            <div className="photo-container" key={index}>
              {s.url ? (
                <div
                  role="button"
                  className="photo"
                  style={{
                    background: `url(${s?.url}) center/cover no-repeat`
                  }}
                  aria-label="更換主要圖片"
                  onClick={() => triggerPhotoUpload(`sub-photo-upload-${index}`)}
                ></div>
              ) : (
                <div
                  className="empty"
                  aria-label="上傳次要圖片"
                  onClick={() => triggerPhotoUpload(`sub-photo-upload-${index}`)}
                >
                  <BackupIcon
                    sx={{ color: 'rgba(182, 182, 182, 1)', fontSize: '50px' }}
                  />
                </div>
              )}

              {!s.url ? (
                <div
                  className="delete"
                  aria-label="刪除次要圖片"
                  onClick={() => removeEmptySubPhoto(index)}
                >
                  <RemoveCircleIcon
                    sx={{ color: 'rgba(18, 0, 59, 0.7);', fontSize: '30px' }}
                  />
                </div>
              ) : (
                <div
                  className="delete"
                  aria-label="刪除次要圖片"
                  onClick={() => deleteSubPhoto(s, index)}
                >
                  <CancelRoundedIcon
                    sx={{ color: 'rgba(18, 0, 59, 0.7);', fontSize: '30px' }}
                  />
                </div>
              )}

              <LoadingCover open={s.loading} />

              <input
                id={`sub-photo-upload-${index}`}
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e, false, index, s.subPhotoId)}
                hidden
              />
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
