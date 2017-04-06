import React, {Component, PropTypes} from 'react'
import style from './Modal.scss'
import FaClose from 'react-icons/lib/fa/close'
import {Link} from 'react-router-dom'


export default class Modal extends Component 
{
  static propTypes = {
    closeRoute: PropTypes.string,
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
