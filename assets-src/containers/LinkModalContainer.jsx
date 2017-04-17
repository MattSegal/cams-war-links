import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import LinkModal from 'components/LinkModal'
import Actions from 'actions'

class LinkModalContainer extends Component 
{
  static propTypes = {
    linkId: PropTypes.number,
    links: PropTypes.array,
    loggedInUser: PropTypes.object,
    users: PropTypes.array,
    deleteLink: PropTypes.func,
    editLink: PropTypes.func,
    bookmarkLink: PropTypes.func,
  }
  render() 
  {
    const {linkId, links, loggedInUser, users} = this.props
    const link = links.find(l => l.id === linkId)
    const username = link && users.find(u => u.id === link.user).username
    
    return (
      <LinkModal 
        link={link} 
        username={username}
        loggedInUser={loggedInUser}
        bookmarkLink={this.props.bookmarkLink}
        deleteLink={this.props.deleteLink}
        editLink={this.props.editLink}
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
    bookmarkLink: (link, user, value) => dispatch(Actions.bookmarkLink(link, user, value)),
    deleteLink: (link_id) => dispatch(Actions.deleteLink(link_id)),
    editLink: (link) => dispatch(Actions.editLink(link)),
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkModalContainer)