import React, {Component} from 'react';
import {connect} from 'react-redux'
import HyperLink from 'components/HyperLink'
import style from 'components/LinkList.scss'
import linkStyle from 'components/Link.scss'
import FaBookmark from 'react-icons/lib/fa/bookmark'
import Actions from 'actions'


class BookmarkListContainer extends Component {
  render() {
    const {users, loggedInUser, removeBookmark} = this.props
    const usernames = users.reduce((obj, user) => ({...obj, [`${user.id}`]: user.username}), {})
    const annotateUsername = link => ({...link, username: usernames[link.user]})
    const sortByDate = (link1, link2) => new Date(link2.created) - new Date(link1.created)
    const bookmarks = loggedInUser.bookmarks
      .map(annotateUsername)
      .sort(sortByDate)

    if (bookmarks.length > 0) {
      return (
        <ul className={style.list}>
          {bookmarks.map(link => this.renderBookmarkedLink(link, removeBookmark))}
        </ul>
      )
    } else {
      return (<p>No bookmarks</p>)
    }
  }

  renderBookmarkedLink = (link, removeBookmark) => (
    <HyperLink key={link.id} link={link}>
      <div className={linkStyle.button} onClick={() => removeBookmark(link)}>
        <FaBookmark />
      </div>
    </HyperLink>
  )
}

const mapStateToProps = (state) => ({
    loggedInUser: state.loggedInUser,
    users: state.users.items,
})

const mapDispatchToProps = (dispatch) => ({
  removeBookmark: link => dispatch(Actions.removeBookmark(link)),
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(BookmarkListContainer)
