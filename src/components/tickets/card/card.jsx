import './card.scss'

export default function Card({ ticket }) {
  function getPrice() {
    const thousands = Math.floor(ticket.price / 1000)
    let rest = ticket.price % 1000

    if (rest < 10) {
      rest = `00${rest}`
    } else if (rest < 100) {
      rest = `0${rest}`
    }

    return `${thousands} ${rest} Р`
  }

  function getTimeTrack(index) {
    const timeStart = `${ticket.segments[index].date.slice(11, 16)}`
    let timeEndHours = `${(Number(ticket.segments[index].date.slice(11, 13)) + Math.floor(ticket.segments[index].duration / 60)) % 24}`
    let timeEndMinutes = `${(Number(ticket.segments[index].date.slice(14, 16)) + (ticket.segments[index].duration % 60)) % 24}`

    if (timeEndHours < 10) timeEndHours = `0${timeEndHours}`
    if (timeEndMinutes < 10) timeEndMinutes = `0${timeEndMinutes}`

    return `${timeStart} - ${timeEndHours}:${timeEndMinutes}`
  }

  function getDuration(index) {
    const hours = Math.floor(ticket.segments[index].duration / 60)
    let minutes = ticket.segments[index].duration % 60

    if (minutes < 10) minutes = `0${minutes}`

    return `${hours}ч ${minutes}м`
  }

  function getStopsAmount(stopsAmount) {
    switch (stopsAmount) {
      case 0:
        return 'Без пересадок'
      case 1:
        return '1 пересадка'
      case 2:
        return '2 пересадки'
      case 3:
        return '3 пересадки'
      default:
        return 'Много пересадок'
    }
  }

  function getStops(index) {
    const stopsArray = ticket.segments[index].stops
    let stops = ''

    stopsArray.forEach((item) => {
      if (stops) {
        stops = `${stops}, ${item}`
      } else stops = item
    })

    return stops || '-'
  }

  return (
    <div className="tickets__card card">
      <div className="card__main-info">
        <span className="card__price">{getPrice()}</span>
        <img className="card__logo" alt="" src={`https://pics.avs.io/99/36/${ticket.carrier}.png`} />
      </div>
      <div className="card__lines">
        <div className="card__line">
          <div className="card__track card__property">
            <span className="card__title">{`${ticket.segments[0].origin}-${ticket.segments[0].destination}`}</span>
            <span className="card__info">{getTimeTrack(0)}</span>
          </div>
          <div className="card__time card__property">
            <span className="card__title">В ПУТИ</span>
            <span className="card__info">{getDuration(0)}</span>
          </div>
          <div className="card__transfer card__property">
            <span className="card__title">{getStopsAmount(ticket.segments[0].stops.length)}</span>
            <span className="card__info">{getStops(0)}</span>
          </div>
        </div>
        <div className="card__line">
          <div className="card__track card__property">
            <span className="card__title">{`${ticket.segments[1].origin}-${ticket.segments[1].destination}`}</span>
            <span className="card__info">{getTimeTrack(1)}</span>
          </div>
          <div className="card__time card__property">
            <span className="card__title">В ПУТИ</span>
            <span className="card__info">{getDuration(1)}</span>
          </div>
          <div className="card__transfer card__property">
            <span className="card__title">{getStopsAmount(ticket.segments[1].stops.length)}</span>
            <span className="card__info">{getStops(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
