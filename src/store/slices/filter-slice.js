import { createSlice } from '@reduxjs/toolkit'

import { FILTERS, SORT_TYPES, ALL_TRANSFER_FILTERS } from '../../constants'

const initialState = {
  sort: SORT_TYPES.CHEAPEST, // активная сортировка
  filters: ['all', 'without_transfer', 'one_transfer', 'two_transfer', 'three_transfer'], // активные фильтры
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Переключение фильтра
    toggleFilter(state, action) {
      const filterId = action.payload

      // Обработка фильтра "Все"
      if (filterId === FILTERS.ALL) {
        if (state.filters.includes(FILTERS.ALL)) {
          // Снимаем все фильтры
          state.filters = []
        } else {
          // Включаем все фильтры
          state.filters = [FILTERS.ALL, ...ALL_TRANSFER_FILTERS]
        }
        return
      }

      // Обработка обычных фильтров
      if (state.filters.includes(filterId)) {
        // Удаляем фильтр
        state.filters = state.filters.filter((id) => id !== filterId)

        // Если сняли фильтр при включенном "Все" - снимаем "Все"
        if (state.filters.includes(FILTERS.ALL)) {
          state.filters = state.filters.filter((id) => id !== FILTERS.ALL)
        }
      } else {
        // Добавляем фильтр
        state.filters.push(filterId)

        // Проверяем, все ли фильтры включены
        const allFiltersSelected = ALL_TRANSFER_FILTERS.every((filter) => state.filters.includes(filter))

        // Если все включены - добавляем "Все"
        if (allFiltersSelected) {
          state.filters.push(FILTERS.ALL)
        }
      }
    },

    // Установка сортировки
    setSort(state, action) {
      state.sort = action.payload
    },
  },
})

export const { toggleFilter, setSort } = filterSlice.actions
export default filterSlice.reducer
