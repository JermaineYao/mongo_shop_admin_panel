import { Outlet } from 'react-router-dom'

import { Snackbar, Alert } from '@mui/material'

import { useSelector, useDispatch } from 'react-redux'
import { setMsg, toggleMsg } from './store/slice/msgSlice'

function App() {
  const dispatch = useDispatch()

  const msg = useSelector((store) => store.msg.msg)
  const open = useSelector((store) => store.msg.open)
  const severity = useSelector((store) => store.msg.severity)

  function handleClose() {
    dispatch(toggleMsg({ open: false }))
    dispatch(setMsg({ msg: '', severity: '' }))
  }

  return (
    <div id="app">
      <Outlet></Outlet>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default App
