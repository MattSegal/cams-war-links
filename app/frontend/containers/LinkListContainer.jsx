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

  sortLinkByDate = (link1, link2) =>
      new Date(link2.created) - new Date(link1.created)

  isLinkVisible = link =>
      this.props.activeUserId === link.user ||
      this.props.activeUserId === NO_USER_SELECTED

  renderLinkOptions = link => {
    const hasViewOption = this.props.loggedInUser || link.description
    const hasEditOption = (
      this.props.loggedInUser &&
      link.user === this.props.loggedInUser.id
    )
    return ((hasViewOption || hasEditOption) &&
      <Link to={`/link/${link.id}`} title="More"className={linkStyle.button}>
        {hasEditOption
          ? <MdEdit />
          : (hasViewOption && <FaEllipsisH  />)
        }
      </Link>
    )
  }

  renderScrollBottom = links => {
    const isScrollBottom = this.props.scrollCount < links.length
    return isScrollBottom && (
      <div className={style.spinnerWrapper}>
        <Spinner />
      </div>
    )
  }

  render()
  {
    const {users, links, scrollCount} = this.props
    const usernames = users.reduce( (obj, user) =>
      ({...obj, [`${user.id}`]: user.username}), {}
    )

    const filteredLinks = links
      .filter(this.isLinkVisible)
      // .sort(this.sortLinkByDate)
      .map(link => ({
          ...link,
          username: usernames[link.user]
      }))

    const scrolledLinks = filteredLinks.slice(0, scrollCount)

    return (
      <ul className={style.list}>
        {scrolledLinks.map(link =>
          <HyperLink key={link.id} link={link}>
              {this.renderLinkOptions(link)}
          </HyperLink>
        )}
        <Waypoint onEnter={this.props.scrollBottom} topOffset="300px" />
        {this.renderScrollBottom(filteredLinks)}
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
  fetchLinks: () => dispatch(Actions.fetchLinks()),
  scrollBottom: () => dispatch(Actions.scrollLinksBottom()),
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkListContainer)
