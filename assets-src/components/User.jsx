import React, {PropTypes, Component} from 'react';
import style from 'components/UserList.scss'

const User = props => 
{
    let username = props.username.charAt(0).toUpperCase() + props.username.slice(1);
    let userStyle = style.user
    userStyle += props.isActive ? ' '+style.selected : ''
    return (
        <li 
            onClick={() => props.onUserClick(props.id)} 
            className={userStyle}>
            {username}
        </li>
    )
}
User.propTypes = {
    id: PropTypes.number,
    username: PropTypes.string,
    isActive: PropTypes.bool,
    onUserClick: PropTypes.func,
}

module.exports = User