import './App.scss'
import Filter from './components/filter/filter'
import Tickets from './components/tickets/tickets'

export default function App() {
  return (
    <div className="main-page">
      <a className="main-page__logo-link" href="#">
        <img className="main-page__logo" src="src\assets\logo.svg" alt="" />
      </a>
      <div className="main-page__content">
        <Filter />
        <Tickets />
      </div>
    </div>
  )
}
