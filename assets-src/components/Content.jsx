import React, {PropTypes, Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import LinkListContainer from 'containers/LinkListContainer'
import UserListContainer from 'containers/UserListContainer'
import Menu from 'components/Menu'
import LinkModalContainer from 'containers/LinkModalContainer'
import AddLinkModalContainer from 'containers/AddLinkModalContainer'

export default class Content extends Component 
{
  static contextTypes = {
    router: PropTypes.object
  }
  
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
            <Route path="/add" component={({match}) =>
              <AddLinkModalContainer 
                router={this.context.router} 
              />
            }/>
            <Route path="/link/:linkId" component={({match}) =>
              <LinkModalContainer 
                router={this.context.router} 
                linkId={Number(match.params.linkId)}
              />
            }/>
            <UserListContainer />
            <LinkListContainer />
          </div>
        </Route>
      </Switch>
    )
  }
}
