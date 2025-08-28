import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  account: '',
  firstName: '',
  lastName: '',
  fullName: '',
  email: '',
  birthday: '',
  role: '',
  photo: {
    createAt: null,
    fileKey: null,
    url: null
  },
  address: '',
  phone: '',
  active: 0,
  userId: '',
  createAt: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state = { ...state, ...action.payload }
      return state
    },
    setUserInfo(state, action) {
      const { field, value } = action.payload
      state[field] = value
    },
    resetUser() {
      return initialState
    }
  }
})

export const userActions = userSlice.actions
