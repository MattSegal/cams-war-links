import React, {PureComponent, Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import LinkListContainer from 'containers/LinkListContainer'
import UserListContainer from 'containers/UserListContainer'
import AccountPage from 'components/Pages/AccountPage'

export default class Content extends Component 
{
  render() 
  {
    return (
      <Switch>
        <Route path="/bookmarks">
          <p>Coming soon...</p>
        </Route>
        <Route path="/account">
          <AccountPage/>
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
