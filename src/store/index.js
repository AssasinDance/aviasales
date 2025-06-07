import { configureStore } from '@reduxjs/toolkit'

import filterReducer from './slices/filter-slice'
import ticketsReducer from './slices/tickets-slice'

export default configureStore({
  reducer: {
    filters: filterReducer,
    tickets: ticketsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', // Включить DevTools в development
})
