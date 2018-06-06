import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux'
import Waypoint from 'react-waypoint'
import {Link} from 'react-router-dom'
import MdEdit from 'react-icons/lib/md/edit'
import FaEllipsisH from 'react-icons/lib/fa/ellipsis-h'

import style from 'scss/LinkList.scss'
import linkStyle from 'scss/Link.scss'

import { actions } from 'state'
import { NO_USER_SELECTED } from 'constants'
import HyperLink from 'components/HyperLink'
import Spinner from 'components/Spinner'


class LinkListContainer extends Component {
  static propTypes = {
    scrollCount: PropTypes.number,
  }

  sortLinkByDate = (link1, link2) =>
      new Date(link2.created) - new Date(link1.created)

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
    const {links, scrollCount} = this.props
    const scrolledLinks = links.slice(0, scrollCount)

    return (
      <ul className={style.list}>
        {scrolledLinks.map(link =>
          <HyperLink key={link.id} link={link}>
              {this.renderLinkOptions(link)}
          </HyperLink>
        )}
        <Waypoint onEnter={this.props.scrollBottom} topOffset="400px" />
        {this.renderScrollBottom(links)}
      </ul>
    )
  }
}

const mapStateToProps = (state) => ({
    links: state.links.items,
    loggedInUser: state.loggedInUser,
    scrollCount: state.nav.scrollCount,
})

const mapDispatchToProps = (dispatch) => ({
  fetchLinks: () => dispatch(actions.fetchLinks()),
  scrollBottom: () => dispatch(actions.scrollLinksBottom()),
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkListContainer)
