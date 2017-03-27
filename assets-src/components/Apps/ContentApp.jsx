import React, {Component} from 'react'
import LinkListContainer from 'containers/LinkListContainer'
import UserListContainer from 'containers/UserListContainer'

class Content extends Component 
{
    render() 
    {
        return (
            <div>
                <UserListContainer />
                <LinkListContainer />
            </div>
        )
    }
}

module.exports = Content