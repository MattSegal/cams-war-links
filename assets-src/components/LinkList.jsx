import React, {PropTypes, PureComponent} from 'react'
import Link from './Link'
import style from 'components/LinkList.scss'

export default class LinkList extends PureComponent {
  static propTypes = {
    links: PropTypes.array,
  }

  render() 
  {
    const {links} = this.props
    return (
      <ul className={style.list}>
        {links.map(link => <Link key={link.id} {...link} />)}
      </ul>
    )
  }
}
