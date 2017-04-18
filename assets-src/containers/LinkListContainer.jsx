import React, {Component} from 'react';
import {connect} from 'react-redux'
import {NO_USER_SELECTED} from 'constants'
import HyperLink from 'components/HyperLink'

import {Link} from 'react-router-dom'
import style from 'components/LinkList.scss'
import linkStyle from 'components/Link.scss'

import MdEdit from 'react-icons/lib/md/edit'
import FaEllipsisH from 'react-icons/lib/fa/ellipsis-h'

class LinkListContainer extends Component {
  render()
  {
    const {users, links, activeUserId, loggedInUser} = this.props
    const usernames = users.reduce( (obj, user) => 
      ({...obj, [`${user.id}`]: user.username}), {}
    )

    const sortByDate = (link1, link2) => 
      new Date(link2.created) - new Date(link1.created)
    
    const isVisible = link => 
      link.user === activeUserId ||
      activeUserId === NO_USER_SELECTED 

    let filteredLinks = links
      .filter(isVisible)
      .sort(sortByDate)
      .map(link => ({
          ...link,
          username: usernames[link.user]
      }))

    // Only grab 50 most recent links
    filteredLinks = activeUserId === NO_USER_SELECTED
      ? filteredLinks.slice(0, 50)
      : filteredLinks

    return (
      <ul className={style.list}>
        {filteredLinks.map(link => 
          <HyperLink key={link.id} link={link}>
            <Link to={`/link/${link.id}`} title="More" className={linkStyle.button}>
              {
                loggedInUser && link.user === loggedInUser.id 
                ? <MdEdit />
                : <FaEllipsisH />
              }
            </Link>
          </HyperLink>
        )}
      </ul>
    )
  }
}

const mapStateToProps = (state) => ({
    links: state.links.items,
    users: state.users.items,
    activeUserId: state.users.activeUserId,
    loggedInUser: state.loggedInUser,
})

const mapDispatchToProps = (dispatch) => ({})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkListContainer)