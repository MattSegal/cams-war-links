import React, {PureComponent, Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import LinkListContainer from 'containers/LinkListContainer'
import UserListContainer from 'containers/UserListContainer'

class Content extends Component 
{
  render() 
  {
    return (
      <Switch>
        <Route path="/bookmarks">
          <h1>BOOKMARKS</h1>
        </Route>
        <Route path="/account">
          <h1>ACCOUNT</h1>
        </Route>
        <Route path="/">
          <div>
            <UserListContainer />
            <LinkListContainer />
          </div>
        </Route>
      </Switch>
    )
  }
}

module.exports = Content