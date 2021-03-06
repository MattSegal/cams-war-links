import React, { PropTypes, Component } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import FaTrashO from 'react-icons/lib/fa/trash-o'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaClose from 'react-icons/lib/fa/close'
import FaBookmarkO from 'react-icons/lib/fa/bookmark-o'
import FaBookmark from 'react-icons/lib/fa/bookmark'
import FaTag from 'react-icons/lib/fa/tag'

import style from 'scss/LinkModal.scss'
import linkStyle from 'scss/Link.scss'

import Modal from 'components/Modal'
import { getTimeSince } from 'utilities'
import LinkForm from 'components/LinkForm'
import Spinner from 'components/Spinner'


class LinkModal extends Component {
  static propTypes = {
    link: PropTypes.object,
    loggedInUser: PropTypes.object,
    deleteLink: PropTypes.func,
    editLink: PropTypes.func,
    addBookmark: PropTypes.func,
    removeBookmark: PropTypes.func,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  constructor(props)
  {
    super(props)
    const {link} = this.props
    this.state =  link ? {
      title: link.title,
      url: link.url,
      description: link.description
    } : {}
    this.submitEditLink = this.submitEditLink.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.link.title,
      url: nextProps.link.url,
      description: nextProps.link.description
    })
  }

  submitEditLink()
  {
      this.props.editLink({
          id: this.props.link.id,
          title: this.state.title,
          url: this.state.url,
          description: this.state.description,
          user_id: this.props.loggedInUser.id
      })
  }

  addAnchorLinks(str, idx) {
    if (s.match(new RegExp('https?://'))) {
      return <strong>{s}</strong>
    }
    console.log(s)
    return s
  }

  parseDescription(desc) {
    return desc.split('\n').map((str, idx) =>
        <span key={idx}>
          {str.split(' ').map((s, i) => {
            if (s.match(new RegExp('https?://'))) {
              return <a href={s} key={i} target="_blank" rel="noopener noreferrer">{s} </a>
            } else {
              return `${s} `
            }
          })}
          <br/>
        </span>
      )
  }

  render()
  {
    const {
      link,
      loggedInUser,
      deleteLink,
      addBookmark,
      removeBookmark
    } = this.props
    // This is dumb but there's server side validation that checks permissions as well
    const isLinkOwner = link && loggedInUser && link.username === loggedInUser.username

    if (!link) {
      return (
      <Modal closeRoute="/">
       <p>Link not found</p>
      </Modal>
      )
    }

    const bookmarkButton = loggedInUser && (
      loggedInUser.bookmarks.map(l => l.id).includes(link.id)
      ? (
        <button className={style.btn} onClick={() => removeBookmark(link)}>
          <FaBookmark />&nbsp;Forget
        </button>
      ) : (
        <button className={style.btn} onClick={() => addBookmark(link)}>
          <FaBookmarkO />&nbsp;Bookmark
        </button>
      )
    )

    const isEditMode = this.context.router.route.location.pathname.includes('edit')

    return (
      <Modal closeRoute="/">
        <div className={isEditMode && style.hiddenOnPhone}>
          <div className={style.field}>
            <a className={style.hyperlink} href={this.state.url} target="_blank" rel="noopener noreferrer">
              <strong>{this.state.title}</strong>
            </a>
            <p className={linkStyle.details}>
              {link.username} - {getTimeSince(link.created)} ago
            </p>
          </div>
          <div className={style.description}>
            {this.parseDescription(this.state.description)}
          </div>
        </div>
        {isLinkOwner && (
          <Switch>
            <Route path={`/link/${link.id}/edit`}>
              <LinkForm
                action={this.submitEditLink}
                state={this.state}
                setState={(obj) => this.setState(obj)}
                backToURL={`/link/${link.id}`}
              />
            </Route>
            <Route path={`/link/${link.id}/delete`}>
              <div className={style.btnWrapper}>
                <Link to="/">
                  <button className={style.btn} onClick={() => deleteLink(link)}>
                    <FaTrashO />&nbsp;Delete
                  </button>
                </Link>
                <Link to={`/link/${link.id}`}>
                  <button className={style.btn}><FaClose />&nbsp;Cancel</button>
                </Link>
              </div>
            </Route>
            <Route path={`/link/${link.id}`} >
              <div>
                {!link.updating && (
                  <div className={style.btnWrapper}>
                    <Link to={`/link/${link.id}/edit`}>
                      <button className={style.btn}><FaPencil />&nbsp;Edit</button>
                    </Link>
                    <Link to={`/link/${link.id}/delete`}>
                      <button className={style.btn}><FaTrashO />&nbsp;Delete</button>
                    </Link>
                    {
                    // <Link to={`/link/${link.id}/tags`}>
                    //   <button className={style.btn}><FaTag />&nbsp;Tags</button>
                    // </Link>
                    }
                    {bookmarkButton}
                  </div>
                )}
                {link.updating &&
                  <div className={style.spinnerWrapper}>
                    <Spinner className={style.spinner}/>
                  </div>
                }
              </div>
            </Route>
          </Switch>
        )}
        {!isLinkOwner && !link.updating && (
          <div className={style.btnWrapper}>
            {bookmarkButton}
          </div>
        )}
        {!isLinkOwner && link.updating && (
          <div className={style.spinnerWrapper}>
            <Spinner className={style.spinner}/>
          </div>
        )}
      </Modal>
    )
  }
}

module.exports = LinkModal
