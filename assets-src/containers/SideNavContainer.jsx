import React, {Component} from 'react';
import {connect} from 'react-redux'
import Actions from 'actions'
import SideNav from 'components/SideNav'
import {NO_USER_SELECTED} from 'constants'
import {titleCase} from 'utilities'


class SideNavContainer extends Component
{
  render()
  {
    const {loggedInUser, users, sidebarActive} = this.props 

    const userList = users.map(user => ({
      ...user,
      username: titleCase(user.username),
      isActive: user.id === this.props.activeUserId,
    }))

    const username = loggedInUser && loggedInUser.username 
      ? titleCase(loggedInUser.username)
      : 'Anon'

    const isNoActiveUser = this.props.activeUserId === NO_USER_SELECTED
    return (
      <SideNav
        active={sidebarActive}
        users={userList}
        loggedInName={username}
        isUserLoggedIn={!!loggedInUser}
        isNoActiveUser={isNoActiveUser}
        setActiveUser={this.props.setActiveUser}
        toggleSidebar={this.props.toggleSidebar}
      />
    )
  }
}

let mapStateToProps = (state) => ({
  users: state.users.items,
  activeUserId: state.users.activeUserId,
  loggedInUser: state.loggedInUser,
  sidebarActive: state.nav.sidebar,
})

let mapDispatchToProps = (dispatch) => ({
  toggleSidebar: () => dispatch(Actions.toggleSidebar()),
  setActiveUser: (user_id) => dispatch(Actions.setActiveUser(user_id)),
})

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SideNavContainer)