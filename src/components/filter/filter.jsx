import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { toggleFilter } from '../../store/slices/filter-slice'
import { FILTERS } from '../../constants'

import './filter.scss'

export default function Filter() {
  const filters = useRef(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const dispatch = useDispatch()
  const activeFilters = useSelector((state) => state.filters.filters)
  const filterOptions = [
    { id: FILTERS.ALL, label: 'Все' },
    { id: FILTERS.WITHOUT_TRANSFER, label: 'Без пересадок' },
    { id: FILTERS.ONE_TRANSFER, label: '1 пересадка' },
    { id: FILTERS.TWO_TRANSFER, label: '2 пересадки' },
    { id: FILTERS.THREE_TRANSFER, label: '3 пересадки' },
  ]

  function titleClickHandler() {
    filters.current.classList.toggle('filter--opened')
  }

  window.addEventListener('resize', () => setWindowWidth(window.innerWidth))

  return (
    <div className="filter" ref={filters}>
      <button
        className="filter__title"
        type="button"
        tabIndex={windowWidth > 780 ? '-1' : '0'}
        onClick={(e) => titleClickHandler(e)}
      >
        Количество пересадок
      </button>
      {filterOptions.map((filter) => (
        <label className="filter__option" htmlFor={filter.id} key={filter.id}>
          <input
            type="checkbox"
            id={filter.id}
            onChange={() => dispatch(toggleFilter(filter.id))}
            checked={activeFilters.includes(filter.id)}
            className="filter__checkbox"
          />
          <span className="filter__checkbox-icon" />
          {filter.label}
        </label>
      ))}
    </div>
  )
}
