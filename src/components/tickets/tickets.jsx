import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setSort } from '../../store/slices/filter-slice'
import { SORT_TYPES } from '../../constants'
import { fetchTickets, showMoreTickets, resetDisplayedCount } from '../../store/slices/tickets-slice'

import Card from './card/card'

import './tickets.scss'

export default function Tickets() {
  const [labelActive, setLabelActive] = useState(null)
  const [sortedTickets, setSortedTickets] = useState([])
  const dispatch = useDispatch()
  const { tickets, displayedCount, isComplete, isError } = useSelector((state) => state.tickets)
  const { filters, sort } = useSelector((state) => state.filters)
  const activeSort = useSelector((state) => state.filters.sort)
  const sortOptions = [
    { id: SORT_TYPES.CHEAPEST, label: 'Самый дешевый' },
    { id: SORT_TYPES.FASTEST, label: 'Самый быстрый' },
    { id: SORT_TYPES.OPTIMAL, label: 'Оптимальный' },
  ]

  const processTickets = useCallback((noFilteredTickets, ticketsFilters) => {
    // Фильтрация
    if (!ticketsFilters.filters.length) return []
    const filtered = noFilteredTickets.filter((ticket) => {
      const stopsCounts = ticket.segments.map((segment) => segment.stops.length)
      const maxStops = Math.max(...stopsCounts)

      if (ticketsFilters.filters.includes('all')) return true
      if (ticketsFilters.filters.includes('without_transfer') && maxStops === 0) return true
      if (ticketsFilters.filters.includes('one_transfer') && maxStops === 1) return true
      if (ticketsFilters.filters.includes('two_transfer') && maxStops === 2) return true
      if (ticketsFilters.filters.includes('three_transfer') && maxStops === 3) return true
      return false
    })

    // Сортировка
    return filtered.sort((a, b) => {
      switch (ticketsFilters.sort) {
        case 'cheapest':
          return a.price - b.price
        case 'fastest':
          return a.segments[0].duration + a.segments[1].duration - (b.segments[0].duration + b.segments[1].duration)
        case 'optimal':
          return (
            a.price * 0.7 +
            (a.segments[0].duration + a.segments[1].duration) * 0.3 -
            (b.price * 0.7 + (b.segments[0].duration + b.segments[1].duration) * 0.3)
          )
        default:
          return 0
      }
    })
  }, [])

  useEffect(() => {
    const initialSort = document.querySelector('.tickets__tickets-filter').firstElementChild
    setLabelActive(initialSort)
    initialSort.classList.add('tickets__label--active')

    dispatch(fetchTickets())
  }, [dispatch])

  useEffect(() => {
    dispatch(resetDisplayedCount())
    setSortedTickets(processTickets(tickets, { filters, sort }))
  }, [tickets, dispatch, filters, sort, processTickets])

  function ticketsFilterChangeHandler(event) {
    event.target.labels[0].classList.toggle('tickets__label--active')
    labelActive.classList.toggle('tickets__label--active')
    setLabelActive(event.target.labels[0])
  }

  function renderStatus() {
    if (!isComplete && tickets.length === 0 && !isError)
      return (
        <div className="loading instead-cards">
          <div className="lds-ripple">
            <div />
            <div />
          </div>
        </div>
      )
    if (isError)
      return (
        <div className="error instead-cards">
          Сервер не отвечает :( Проверьте соединение с интернетом и перезагрузите страницу
        </div>
      )
    return null
  }

  return (
    <div className="tickets">
      <form className="tickets__tickets-filter">
        {sortOptions.map((sorting) => (
          <label htmlFor={sorting.id} className="tickets__label" key={sorting.id}>
            <input
              type="radio"
              name="tickets-filter"
              id={sorting.id}
              className="tickets__radio"
              checked={activeSort.includes(sorting.id)}
              onChange={(e) => {
                ticketsFilterChangeHandler(e)
                dispatch(setSort(sorting.id))
              }}
            />
            {sorting.label}
          </label>
        ))}
      </form>
      <div className="tickets__cards">
        {renderStatus()}
        {sortedTickets.length
          ? sortedTickets
              .slice(0, displayedCount)
              .map((ticket) => (
                <Card
                  key={ticket.carrier + ticket.price + ticket.segments[0].duration + ticket.segments[1].duration}
                  ticket={ticket}
                />
              ))
          : null}
      </div>
      {sortedTickets.length
        ? displayedCount < tickets.length && (
            <button type="button" className="tickets__more" onClick={() => dispatch(showMoreTickets())}>
              Показать еще 5 билетов!
            </button>
          )
        : isComplete && <div className="sold-out instead-cards">Билетов с таким количеством пересадок нет</div>}
    </div>
  )
}
