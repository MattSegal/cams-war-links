import React, {PropTypes, Component} from 'react';
import style from 'components/User.scss'

class User extends Component
{
    static propTypes = {
        id: PropTypes.number,
        name: PropTypes.string,
        isCurrent: PropTypes.bool,
        onUserClick: PropTypes.func,
    }
    
    render()
    {
        let userStyle = style.user
        userStyle += this.props.isActive ? ' '+style.selected : ''
        return (
            <li 
                onClick={() => this.props.onUserClick(this.props.name)} 
                className={userStyle}>
                {this.props.name}
            </li>
        )
    }
}

module.exports = User