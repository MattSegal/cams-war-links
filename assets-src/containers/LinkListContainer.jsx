import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux'
import {NO_USER_SELECTED} from 'constants'
import HyperLink from 'components/HyperLink'
import Waypoint from 'react-waypoint'
import {Link} from 'react-router-dom'
import Actions from 'actions'
import style from 'components/LinkList.scss'
import linkStyle from 'components/Link.scss'
import MdEdit from 'react-icons/lib/md/edit'
import FaEllipsisH from 'react-icons/lib/fa/ellipsis-h'
import Spinner from 'components/Spinner'

class LinkListContainer extends Component {
  static propTypes = {
    scrollCount: PropTypes.number,
  }

  render()
  {
    const {users, links, activeUserId, loggedInUser, scrollCount} = this.props
    const usernames = users.reduce( (obj, user) => 
      ({...obj, [`${user.id}`]: user.username}), {}
    )

    const sortByDate = (link1, link2) => 
      new Date(link2.created) - new Date(link1.created)
    
    const isVisible = link => 
      link.user === activeUserId ||
      activeUserId === NO_USER_SELECTED 

    const filteredLinks = links
      .filter(isVisible)
      .sort(sortByDate)
      .map(link => ({
          ...link,
          username: usernames[link.user]
      }))
      
    const scrolledLinks = filteredLinks.slice(0, scrollCount)

    return (
      <ul className={style.list}>
        {scrolledLinks.map(link => 
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
        <Waypoint
          onEnter={this.props.scrollBottom}
          topOffset="100px"
        />
        {scrollCount < filteredLinks.length &&
          <div className={style.spinnerWrapper}><Spinner /></div>
        }
      </ul>
    )
  }
}

const mapStateToProps = (state) => ({
    links: state.links.items,
    users: state.users.items,
    activeUserId: state.users.activeUserId,
    loggedInUser: state.loggedInUser,
    scrollCount: state.nav.scrollCount,
})

const mapDispatchToProps = (dispatch) => ({
  scrollBottom: () => dispatch(Actions.scrollLinksBottom()),
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkListContainer)