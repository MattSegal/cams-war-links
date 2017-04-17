import React, {Component} from 'react';
import {connect} from 'react-redux'
import HyperLink from 'components/HyperLink'
import style from 'components/LinkList.scss'
import linkStyle from 'components/Link.scss'
import FaBookmarkO from 'react-icons/lib/fa/bookmark-o'
import FaBookmark from 'react-icons/lib/fa/bookmark'
import Actions from 'actions'


class BookmarkListContainer extends Component {
  render()
  {
    const {users, links, loggedInUser,bookmarkLink} = this.props

    const usernames = users.reduce( (obj, user) => 
      ({...obj, [`${user.id}`]: user.username}), {}
    )

    const sortByDate = (link1, link2) => 
      new Date(link2.created) - new Date(link1.created)

    const filteredLinks = links.filter(
      link => loggedInUser.bookmarks.includes(link.id)
    )
    .sort(sortByDate)
    .map(link => ({
      ...link,
      username: usernames[link.user]
    }))

    return filteredLinks.length > 0 
    ? (
      <ul className={style.list}>
        {filteredLinks.map(link => 
          <HyperLink key={link.id} link={link}>
            {loggedInUser.bookmarks.includes(link.id)
            ? (
              <div className={linkStyle.button} onClick={() => bookmarkLink(link, loggedInUser, false)}>
                <FaBookmark />
              </div>
            ) : (
              <div className={linkStyle.button} onClick={() => bookmarkLink(link, loggedInUser, true)}>
                <FaBookmarkO />
              </div>
            )}
          </HyperLink>
        )}
      </ul>
    ) : (
      <p>No bookmarks</p>
    )
  }
}

const mapStateToProps = (state) => ({
    loggedInUser: state.loggedInUser,
    links: state.links.items,
    users: state.users.items,
})

const mapDispatchToProps = (dispatch) => ({
  bookmarkLink: (link, user, value) => dispatch(Actions.bookmarkLink(link, user, value)),
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(BookmarkListContainer)