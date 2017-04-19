import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Header from 'components/Header'
import Actions from 'actions'
import {NO_USER_SELECTED} from 'constants'
import {titleCase} from 'utilities'

class HeaderContainer extends Component {
  render()
  {
    const username = this.props.activeUserId !== NO_USER_SELECTED
      ? titleCase(this.props.users.find(u => u.id === this.props.activeUserId).username)
      : ''
    return (
      <Header
        updating={this.props.updating}
        username={username}
        fetchLinks={this.props.fetchLinks}
        toggleSidebar={this.props.toggleSidebar}
      />
     )
  }
}

const mapStateToProps = (state) => ({
  updating: state.links.updating,
  users: state.users.items,
  activeUserId: state.users.activeUserId,
})

const mapDispatchToProps = (dispatch) => ({
  fetchLinks: () => dispatch(Actions.fetchLinks()),
  toggleSidebar: () => dispatch(Actions.toggleSidebar()),
})

const ConnectedHeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContainer)

// Pass context to connected component so it knows to
// update when router state changes
class RoutedHeader extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  render() {
    return <ConnectedHeaderContainer router={this.context.router} />
  }
}

module.exports = RoutedHeader