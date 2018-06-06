import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom'
import FaClose from 'react-icons/lib/fa/close'

import style from 'scss/Modal.scss'


export default class Modal extends Component
{
  static propTypes = {
    closeRoute: PropTypes.string,
  }

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }).isRequired
    }).isRequired
  }

  constructor(props) {
    super(props);
    this.handleEscKeypress = this.handleEscKeypress.bind(this)
  }

  handleEscKeypress(event) {
    const { history } = this.context.router
    if (event.key === 'Escape' || event.keyCode === 27) {
      history.push(this.props.closeRoute)
    }
  }

  componentDidMount() {
    document.addEventListener('keydown',this.handleEscKeypress)
    this.background.classList.add('Modal__active')
  }

  componentWillUnmount() {
    document.removeEventListener('keydown',this.handleEscKeypress)
    this.background.classList.remove('Modal__active')
  }

  render()
  {
    const {children, closeRoute} = this.props
    return (
      <div ref={c => this.background = c} className={style.background}>
        <div className={style.content}>
          <Link to={closeRoute} className={style.close}><FaClose /></Link>
          {children}
        </div>
      </div>
    )
  }
}
