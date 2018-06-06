import React, { PropTypes, Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import LinkListContainer from 'containers/LinkListContainer'
import BookmarkListContainer from 'containers/BookmarkListContainer'
import LinkModalContainer from 'containers/LinkModalContainer'
import AddLinkModalContainer from 'containers/AddLinkModalContainer'
import AccountContainer from 'containers/AccountContainer'
import SearchContainer from 'containers/SearchContainer'

export default class Content extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  render()
  {
    return (
      <Switch>
        <Route path="/search">
          <SearchContainer />
        </Route>
        <Route path="/account">
          <AccountContainer />
        </Route>
        <Route path="/bookmarks">
          <BookmarkListContainer />
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
            <LinkListContainer />
          </div>
        </Route>
      </Switch>
    )
  }
}
