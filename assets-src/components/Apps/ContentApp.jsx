import React, {PureComponent, Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import LinkListContainer from 'containers/LinkListContainer'
import UserListContainer from 'containers/UserListContainer'
import Menu from 'components/Menu'
import LinkModalContainer from 'containers/LinkModalContainer'

export default class Content extends Component 
{
  render() 
  {
    return (
      <Switch>
      
        <Route path="/bookmarks">
          <p>Coming soon...</p>
        </Route>
        <Route path="/menu">
          <Menu/>
        </Route>
        <Route path="/">
          <div>
            <Route path="/link/:linkId" component={({match}) =>
              <LinkModalContainer linkId={Number(match.params.linkId)}/>
            }/>
            <UserListContainer />
            <LinkListContainer />
          </div>
        </Route>
      </Switch>
    )
  }
}
