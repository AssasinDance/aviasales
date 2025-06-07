import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

let abortController = new AbortController()

export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async (_, { getState, dispatch }) => {
  const searchResponse = await fetch('https://aviasales-test-api.kata.academy/search', {
    signal: abortController.signal,
  }).catch((e) => e.name !== 'AbortError' && dispatch(setError(true)))

  const { searchId } = await searchResponse.json()
  let state = getState()

  abortController.abort()
  abortController = new AbortController()

  while (!state.tickets.isComplete) {
    try {
      const ticketsResponse = await fetch(`https://aviasales-test-api.kata.academy/tickets?searchId=${searchId}`, {
        signal: abortController.signal,
      })
      const data = await ticketsResponse.json()
      dispatch(addTickets(data.tickets))

      if (data.stop) {
        dispatch(setComplete())
      }
    } catch (e) {
      if (e.message !== "Failed to execute 'json' on 'Response': Unexpected end of JSON input") console.log(e.message)
    } finally {
      state = getState()
    }
  }
})

const initialState = {
  tickets: [],
  displayedCount: 5,
  isComplete: false,
  isError: false,
}

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    addTickets(state, action) {
      state.tickets = [...state.tickets, ...action.payload]
    },
    resetDisplayedCount(state) {
      state.displayedCount = 5
    },
    showMoreTickets(state) {
      state.displayedCount += 5
    },
    setComplete(state) {
      state.isComplete = true
    },
    setError(state, action) {
      state.isError = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.isComplete = false
      })
      .addCase(fetchTickets.fulfilled, (state) => {
        state.isComplete = true
      })
  },
})

export const { addTickets, showMoreTickets, resetTickets, setComplete, setError, resetDisplayedCount } =
  ticketsSlice.actions
export default ticketsSlice.reducer
