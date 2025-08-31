import { useDispatch } from 'react-redux'
import { toggleMsg, setMsg } from '../store/slice/msgSlice'

export function useError() {
  const dispatch = useDispatch()

  function handleError(err, fallbackMsg = '發生未知錯誤') {
    const errMsg = err?.response?.data?.msg || err.message || fallbackMsg

    dispatch(toggleMsg({ open: true }))
    dispatch(
      setMsg({
        msg: errMsg,
        severity: 'error'
      })
    )
  }

  return handleError
}
