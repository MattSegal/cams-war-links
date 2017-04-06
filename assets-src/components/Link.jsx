import React, {PropTypes, PureComponent} from 'react';
import {connect} from 'react-redux'
import style from 'components/Link.scss'
import {getTimeSince} from 'utilities'
import FaCommentO from 'react-icons/lib/fa/comment-o'
import FaCog from 'react-icons/lib/fa/cog'
import {Link as RouterLink} from 'react-router-dom'

// TODO: Rename to HyperLink
class Link extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    url: PropTypes.string,
    user: PropTypes.number,
    username: PropTypes.string,
    description: PropTypes.string,
    loggedInUser: PropTypes.object,
    created: PropTypes.string,
  }

  // TODO: Bold link that you own
  // TOOD: Indicate that a link has a description
  render()
  {
    const userIsOwner = this.props.user === this.props.loggedInUser.id
    const linkHasDescription = !!this.props.description

    const moreButton = (userIsOwner || linkHasDescription) && (
        <RouterLink to={`/link/${this.props.id}`} title="More" className={style.button}>
          {userIsOwner ? <FaCog /> : <FaCommentO />}
        </RouterLink>
      )

    return (
      <li className={style.link}>
        <div className={style.left}>
          <a className={style.hyperlink} href={this.props.url} target="_blank" rel="noopener noreferrer">
            {this.props.title}
          </a>
        </div>
        {moreButton}
        <p className={style.details} >
          {this.props.username} - {getTimeSince(this.props.created)} ago
        </p>
      </li>
    )
  }
}

// this should be props from container
let mapStateToProps = (state) => ({
    loggedInUser: state.loggedInUser,
})

module.exports = connect(
    mapStateToProps
)(Link)