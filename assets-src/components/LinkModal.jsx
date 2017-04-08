import React, {PropTypes, Component} from 'react'
import {Link, Route, Switch} from 'react-router-dom'
import Modal from 'components/Modal'
import {getTimeSince} from 'utilities'
import style from 'components/LinkModal.scss'
import linkStyle from 'components/Link.scss'
import FaTrashO from 'react-icons/lib/fa/trash-o'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaClose from 'react-icons/lib/fa/close'
import LinkForm from 'components/LinkForm'

class LinkModal extends Component 
{
  static propTypes = {
    link: PropTypes.object,
    username: PropTypes.string,
    isLinkOwner: PropTypes.bool,
    deleteLink: PropTypes.func,
    editLink: PropTypes.func,
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
          user: this.props.link.user
      })
  }

  // TODO 'bookmarked'
  // TODO render link 'loading/requesting' state
  render() 
  {
    const {link, username, isLinkOwner, deleteLink} = this.props

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
          <a className={style.hyperlink} href={this.state.url} target="_blank" rel="noopener noreferrer">
            <strong>{this.state.title}</strong>
          </a>
          <p className={linkStyle.details}>
            {username} - {getTimeSince(link.created)} ago
          </p>
        </div>
        <div className={style.description}>{this.state.description}</div>
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
                  <button className={style.btn} onClick={()=>deleteLink(link.id)}>
                    <FaTrashO />&nbsp;Delete
                  </button>
                </Link>
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