import React, {PropTypes, PureComponent} from 'react';

import style from 'scss/Link.scss'

import { getTimeSince } from 'utilities'
import Spinner from 'components/Spinner'

export default class HyperLink extends PureComponent {
  static propTypes = {
    link: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      created: PropTypes.string,
      updating: PropTypes.bool,
      user: PropTypes.shape({
        username: PropTypes.string,
      }),
    })
  }

  getDomain(url) {
    return url
      .replace('http://', '')
      .replace('https://', '')
      .split(/[/?#]/)[0]
      .replace('www.', '')
  }

  render() {
    const {link, children} = this.props
    const timeAgo = getTimeSince(link.created) + ' ago'
    const domain = this.getDomain(link.url)
    const description = link.description ? '- description' : ''
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
          <p className={style.details}>
            {link.user.username} - {timeAgo} - {domain} {description}
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
