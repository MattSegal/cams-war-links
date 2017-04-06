import React, {PropTypes, Component} from 'react'
import {Link, Route, Switch} from 'react-router-dom'
import Modal from 'components/Modal'
import {getTimeSince} from 'utilities'
import style from 'components/LinkModal.scss'
import linkStyle from 'components/Link.scss'

import FaTrashO from 'react-icons/lib/fa/trash-o'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaClose from 'react-icons/lib/fa/close'

class LinkModal extends Component 
{
  static propTypes = {
    link: PropTypes.object,
    username: PropTypes.string,
    isLinkOwner: PropTypes.bool,
  }

  // TODO: exit on ESC press
  // TODO 'bookmarked'
  render() 
  {
    const {link, username, isLinkOwner} = this.props

    if (!link) {
      return (
      <Modal closeRoute="/">
       <p>Link not found</p>
      </Modal>
      )
    }

    return (
      <Modal closeRoute="/">
        <div className={style.field}>
          <a className={style.hyperlink} href={link.url} target="_blank" rel="noopener noreferrer">
            <strong>{link.title}</strong>
          </a>
          <p className={linkStyle.details}>
            {username} - {getTimeSince(link.created)} ago
          </p>
        </div>
        <div className={style.description}>{link.description}</div>
        {isLinkOwner && (
          <Switch>
            <Route path={`/link/${link.id}/edit`}>
              <div className={style.btnWrapper}>
                <button className={style.btn}><FaPencil />&nbsp;Submit</button>
                <Link to={`/link/${link.id}`}>
                  <button className={style.btn}><FaClose />&nbsp;Cancel</button>
                </Link>
              </div>
            </Route>
            <Route path={`/link/${link.id}/delete`}>
              <div className={style.btnWrapper}>
                <button className={style.btn}><FaTrashO />&nbsp;Delete</button>
                <Link to={`/link/${link.id}`}>
                  <button className={style.btn}><FaClose />&nbsp;Cancel</button>
                </Link>
              </div>
            </Route>
            <Route path={`/link/${link.id}`} >
              <div className={style.btnWrapper}>
                <Link to={`/link/${link.id}/edit`}>
                  <button className={style.btn}><FaPencil />&nbsp;Edit</button>
                </Link>
                <Link to={`/link/${link.id}/delete`}>
                  <button className={style.btn}><FaTrashO />&nbsp;Delete</button>
                </Link>
              </div>
            </Route>
          </Switch>
        )}
      </Modal>
    )
  }
}

module.exports = LinkModal