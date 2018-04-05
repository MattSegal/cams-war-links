import React, {PropTypes, PureComponent} from 'react';
import style from 'components/Link.scss'
import {getTimeSince} from 'utilities'
import Spinner from 'components/Spinner'

export default class HyperLink extends PureComponent {
  static propTypes = {
    link: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      username: PropTypes.string,
      created: PropTypes.string,
      updating: PropTypes.bool,
    })
  }

  render()
  {
    const {link, children} = this.props
    return (
      <li className={style.link}>
        <div className={style.left}>
          <a
            className={style.hyperlink}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.title}
          </a>
          <p className={style.details} >
            {link.username} - {getTimeSince(link.created)} ago {link.description ? '- description' : ''}
          </p>
        </div>
        {link.updating
          ? <span className={style.button}><Spinner className={style.spinner} /></span>
          : children
        }
      </li>
    )
  }
}
