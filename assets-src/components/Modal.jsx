import React, {Component, PropTypes} from 'react'
import style from './Modal.scss'
import FaClose from 'react-icons/lib/fa/close'
import {Link} from 'react-router-dom'


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
  }

  componentWillUnmount() {
    document.removeEventListener('keydown',this.handleEscKeypress)
  }

  render() 
  {
    const {children, closeRoute} = this.props
    return (
      <div className={style.modal}>
        <div className={style.contentWrapper}>
          <Link to={closeRoute} className={style.close}><FaClose /></Link>
          {children}
        </div>
      </div>
    )
  }
}
