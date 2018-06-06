import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'

import { actions } from 'state'
import LinkModal from 'components/LinkModal'

class LinkModalContainer extends Component
{
  static propTypes = {
    linkId: PropTypes.number,
    links: PropTypes.array,
    loggedInUser: PropTypes.object,
    deleteLink: PropTypes.func,
    editLink: PropTypes.func,
    addBookmark: PropTypes.func,
    removeBookmark: PropTypes.func,
  }
  render()
  {
    const {linkId, links, loggedInUser} = this.props
    const link = links.find(l => l.id === linkId)
    return (
      <LinkModal
        link={link}
        username={link.user.username}
        loggedInUser={loggedInUser}
        addBookmark={this.props.addBookmark}
        removeBookmark={this.props.removeBookmark}
        deleteLink={this.props.deleteLink}
        editLink={this.props.editLink}
      />
    )
  }
}

let mapStateToProps = (state) => ({
    links: state.links.items,
    loggedInUser: state.loggedInUser,
})

let mapDispatchToProps = (dispatch) => ({
    addBookmark: link => dispatch(actions.addBookmark(link)),
    removeBookmark: link => dispatch(actions.removeBookmark(link)),
    deleteLink: (link) => dispatch(actions.deleteLink(link)),
    editLink: (link) => dispatch(actions.editLink(link)),
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkModalContainer)
