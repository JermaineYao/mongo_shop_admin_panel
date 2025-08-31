/*========================= Redux Toolkit =========================*/
import { configureStore } from '@reduxjs/toolkit'

import { msgReducers } from './slice/msgSlice'

/*-------------------- store --------------------*/

const store = configureStore({
  reducer: {
    msg: msgReducers
  }
})

export default store
