import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import LinkModal from 'components/LinkModal'

class LinkModalContainer extends Component 
{
  static propTypes = {
    linkId: PropTypes.number,
    links: PropTypes.array,
    loggedInUser: PropTypes.object,
    users: PropTypes.array,
  }
  render() 
  {
    const {linkId, links, loggedInUser, users} = this.props
    const link = links.find(l => l.id === linkId)
    const username = link && users.find(u => u.id === link.user).username
    const isLinkOwner = link && link.user === loggedInUser.id

    return (
      <LinkModal 
        link={link} 
        username={username}
        isLinkOwner={isLinkOwner}
      />
    )
  }
}

let mapStateToProps = (state) => ({
    links: state.links.items,
    loggedInUser: state.loggedInUser,
    users: state.users.items,
})

let mapDispatchToProps = (dispatch) => ({
    linkDetails: {
        show: (link_id) => dispatch(Actions.showLinkDetails(link_id)),
        hide: (link_id) => dispatch(Actions.hideLinkDetails(link_id)),
    },
    addLink: {
        confirm: (link) => dispatch(Actions.confirmAddLink(link)),
        cancel:() => dispatch(Actions.cancelAddLink()),
    },
    deleteLink: {
        select: (link_id) => dispatch(Actions.tryDeleteLink(link_id)),
        confirm: (link_id) => dispatch(Actions.confirmDeleteLink(link_id)),
        cancel:(link_id) => dispatch(Actions.cancelDeleteLink(link_id)),
    },
    editLink: {
        select: (link_id) => dispatch(Actions.tryEditLink(link_id)),
        confirm: (link) => dispatch(Actions.confirmEditLink(link)),
        cancel:(link_id) => dispatch(Actions.cancelEditLink(link_id)),
    },
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkModalContainer)