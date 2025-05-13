import { configureStore } from '@reduxjs/toolkit'
import userReducer from './src/redux/userslice.js'

export const store = configureStore({
    reducer: {
      user : userReducer
    },
})