import React, {PropTypes, PureComponent} from 'react';
import style from 'components/ScrollFooter.scss'
import FaChevronUp from 'react-icons/lib/fa/chevron-up'

export default class ScrollFooter extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {visible: false}
    window.onscroll = this.handleScroll
  }

  handleScroll = () => {
    if (window.pageYOffset > 100) 
    {
      this.setState({visible: true})
    } 
    else 
    {
      this.setState({visible: false})
    }
  }

  handleClick = () => {
    window.scrollTo(0,0)
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
