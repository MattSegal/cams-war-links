import React, { PropTypes, PureComponent } from 'react';
import FaChevronUp from 'react-icons/lib/fa/chevron-up'
require('smoothscroll-polyfill').polyfill(); // global side effect on window

import style from 'scss/ScrollFooter.scss'


export default class ScrollFooter extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {visible: false}
    window.onscroll = this.handleScroll
  }

  handleScroll = () => {
    if (window.pageYOffset > 200)
    {
      this.setState({visible: true})
    }
    else
    {
      this.setState({visible: false})
    }
  }

  handleClick = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  render()
  {
    return this.state.visible && (
      <div className={style.footer}>
        <div className={style.scrollButton} onClick={this.handleClick}>
          <FaChevronUp />
        </div>
      </div>
    )
  }
}
