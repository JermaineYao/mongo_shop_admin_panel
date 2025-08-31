import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  open: false,
  msg: '',
  severity: ''
}

const msgSlice = createSlice({
  name: 'msg',
  initialState,
  reducers: {
    setMsg(state, action) {
      state.msg = action.payload.msg
      state.severity = action.payload.severity
    },
    toggleMsg(state, action) {
      state.open = action.payload.open
    }
  }
})

export const msgReducers = msgSlice.reducer

export const { setMsg, toggleMsg } = msgSlice.actions
