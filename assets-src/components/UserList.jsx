import React, {PropTypes, Component} from 'react'
import User from 'components/User'
import style from 'components/UserList.scss'
import {NO_USER_SELECTED} from 'constants'

class UserList extends Component
{
    static propTypes = {
        users: PropTypes.array,
        onUserClick: PropTypes.func,
        isNoActiveUser: PropTypes.bool,
    }

    render()
    {
        let users = this.props.users
            .sort( user => -user.id)
            .map( user => 
                <User key={user.id} onUserClick={this.props.onUserClick} {...user}/>
            )

        return (
            <ul className={style.userList}>
                <User 
                    key={NO_USER_SELECTED}
                    id={NO_USER_SELECTED}
                    username="Latest"
                    isActive={this.props.isNoActiveUser}
                    onUserClick={this.props.onUserClick} 
                />
                {users}
            </ul>
        )
    }
}

module.exports = UserList

