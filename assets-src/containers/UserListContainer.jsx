import React, {Component} from 'react';
import {connect} from 'react-redux'
import UserList from 'components/UserList'
import Actions from 'actions'
import {NO_USER_SELECTED} from 'constants'

class UserListContainer extends Component
{
    render()
    {
        let users = this.props.users.map(user => ({
            ...user,
            isActive: user.id === this.props.activeUserId
        }))

        let isNoActiveUser = this.props.activeUserId === NO_USER_SELECTED
        return (
            <UserList 
                users={users} 
                onUserClick={this.props.onUserClick}
                isNoActiveUser={isNoActiveUser} 
            />
        )
    }
}

let mapStateToProps = (state) => ({
    users: state.users.items,
    isFetching: state.users.isFetching,
    activeUserId: state.users.activeUserId
})

let mapDispatchToProps = (dispatch) => ({
    onUserClick: (user_id) => dispatch(Actions.setActiveUser(user_id))
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserListContainer)