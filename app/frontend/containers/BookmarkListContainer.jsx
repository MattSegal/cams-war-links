import React, {Component} from 'react';
import {connect} from 'react-redux'
import FaBookmark from 'react-icons/lib/fa/bookmark'

import style from 'scss/LinkList.scss'
import linkStyle from 'scss/Link.scss'

import { actions } from 'state'
import HyperLink from 'components/HyperLink'


class BookmarkListContainer extends Component {
  render() {
    const {loggedInUser, removeBookmark} = this.props
    const sortByDate = (link1, link2) => new Date(link2.created) - new Date(link1.created)
    const bookmarks = loggedInUser.bookmarks.sort(sortByDate)

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
})

const mapDispatchToProps = (dispatch) => ({
  removeBookmark: link => dispatch(actions.removeBookmark(link)),
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(BookmarkListContainer)
