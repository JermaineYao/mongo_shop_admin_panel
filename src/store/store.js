/*========================= Redux Toolkit =========================*/
import { configureStore } from '@reduxjs/toolkit'

import { userSlice } from './slice/userSlice'

/*-------------------- store --------------------*/

const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
})

export default store
