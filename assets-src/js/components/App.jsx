import React, {Component} from 'react'
import LinkListContainer from 'containers/LinkListContainer'
import UserListContainer from 'containers/UserListContainer'

class App extends Component 
{
    render() 
    {
        return (
            <div>
                <h1>Links App</h1>
                <UserListContainer />
                <LinkListContainer />
            </div>
        )
    }
}

module.exports = App