/*========================= Redux Toolkit =========================*/
import { configureStore } from '@reduxjs/toolkit'

import { msgReducers } from './slice/msgSlice'
import { userReducers } from './slice/userSlice'

/*-------------------- store --------------------*/

const store = configureStore({
  reducer: {
    msg: msgReducers,
    user: userReducers
  }
})

export default store
