import React, {PropTypes, Component} from 'react';
import style from 'components/UserList.scss'

class User extends Component
{
    static propTypes = {
        id: PropTypes.number,
        username: PropTypes.string,
        isActive: PropTypes.bool,
        onUserClick: PropTypes.func,
    }
    
    render()
    {
        let username = this.props.username.charAt(0).toUpperCase() + this.props.username.slice(1);
        let userStyle = style.user
        userStyle += this.props.isActive ? ' '+style.selected : ''
        return (
            <li 
                onClick={() => this.props.onUserClick(this.props.id)} 
                className={userStyle}>
                {username}
            </li>
        )
    }
}

module.exports = User