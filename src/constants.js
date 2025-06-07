// Идентификаторы фильтров
export const FILTERS = {
  ALL: 'all',
  WITHOUT_TRANSFER: 'without_transfer',
  ONE_TRANSFER: 'one_transfer',
  TWO_TRANSFER: 'two_transfer',
  THREE_TRANSFER: 'three_transfer',
}

// Варианты сортировки
export const SORT_TYPES = {
  CHEAPEST: 'cheapest',
  FASTEST: 'fastest',
  OPTIMAL: 'optimal',
}

// Все фильтры кроме "Все"
export const ALL_TRANSFER_FILTERS = [
  FILTERS.WITHOUT_TRANSFER,
  FILTERS.ONE_TRANSFER,
  FILTERS.TWO_TRANSFER,
  FILTERS.THREE_TRANSFER,
]
