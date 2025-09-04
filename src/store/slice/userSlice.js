import { createSlice } from '@reduxjs/toolkit'
// import { queryAccountApi } from '@/api/user'

const initialState = {
  account: '',
  email: '',
  role: '',
  active: true,
  photo: {
    createAt: null,
    fileKey: null,
    url: null
  },
  phoneNumber: '',
  address: '',
  userId: null
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
      console.log(action.payload)
      const { field, value } = action.payload
      state[field] = value
    },
    resetUser() {
      return initialState
    }
  }
})

export const userReducers = userSlice.reducer

// const { setUser } = userSlice.actions
export const { setUserInfo, resetUser, setUser } = userSlice.actions
