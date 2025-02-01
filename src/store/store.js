import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
  reducer: {
    // Reducers will be added here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      // API middleware will be added here
    ]),
})

setupListeners(store.dispatch)
