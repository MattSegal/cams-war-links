import React, {Component} from 'react';
import {connect} from 'react-redux'
import UserList from 'components/UserList'
import Actions from 'actions'

class UserListContainer extends Component
{
    render()
    {
        let users = this.props.users.map(user => ({
            ...user,
            isActive: user.id === this.props.activeUserId
        }))
        return (
            <UserList 
                users={users} 
                onUserClick={this.props.onUserClick} 
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