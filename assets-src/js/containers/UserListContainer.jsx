import React, {Component} from 'react';
import {connect} from 'react-redux'
import UserList from 'components/UserList'
import Actions from 'actions'

class UserListContainer extends Component
{
    render()
    {
        return (
            <UserList 
                users={this.props.users} 
                onUserClick={this.props.onUserClick} 
            />
        )
    }
}

let mapStateToProps = (state) => ({
    users: state.users
})

let mapDispatchToProps = (dispatch) => ({
    onUserClick: (username) => dispatch(Actions.setActiveUser(username))
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserListContainer)