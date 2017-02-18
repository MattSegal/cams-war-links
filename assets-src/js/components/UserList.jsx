import React, {PropTypes, Component} from 'react'
import User from 'components/User'

class UserList extends Component
{
    static propTypes = {
        users: PropTypes.array,
        onUserClick: PropTypes.func,
    }

    render()
    {
        let users = this.props.users
            .sort( user => -user.id)
            .map( user => 
                <User key={user.id} onUserClick={this.props.onUserClick} {...user}/>
            )

        return (
            <ul>{users}</ul>
        )
    }
}

module.exports = UserList

