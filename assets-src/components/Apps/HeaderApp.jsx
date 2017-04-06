import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Switch, Route, Link} from 'react-router-dom'
import Actions from 'actions'
import {LoggedIn, LoggedOut} from 'containers/UtilsContainers'
import NewLinkButton from 'components/HeaderButtons/NewLinkButton'
import RefreshButton from 'components/HeaderButtons/RefreshButton'
import FaBars from 'react-icons/lib/fa/bars'
import style from 'components/Apps/Header.scss'


class HeaderToolbar extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  render() 
  {
    const {isFetching, addFormStatus, onRefreshClick, addLink} = this.props
    return (
      <header className={style.header}>
        <Switch>
        <Route path="/bookmarks">
           <Link to="/"><h1>BOOKMARKS</h1></Link>
          </Route>
          <Route path="/">
            <Link to="/"><h1>LINKS</h1></Link>
          </Route>
        </Switch>
        <div className={style.group}>
          <LoggedIn>
            <Route exact path="/" render={()=> (
              <span>
                <RefreshButton 
                  onRefreshClick={onRefreshClick}
                  isFetching={isFetching}
                />
                <NewLinkButton 
                  addFormStatus={addFormStatus} 
                  {...addLink} 
                />
              </span>
            )}/>
          </LoggedIn>
        </div>
        <div className={style.group}>
          <Switch>
            <Route path="/menu">
              <Link to="/" title="Menu"><button><FaBars /></button></Link>
            </Route>
            <Route path="/">
              <Link to="/menu" title="Menu"><button><FaBars /></button></Link>
            </Route>
          </Switch>
        </div>
      </header>
    )
  }
}


const mapStateToProps = (state) => ({
  isFetching: state.links.isFetching,
  addFormStatus: state.links.add,
})

const mapDispatchToProps = (dispatch) => ({
  onRefreshClick: () => dispatch(Actions.fetchLinks()),
  addLink: {
    select: () => dispatch(Actions.tryAddLink()),
    cancel: () => dispatch(Actions.cancelAddLink()),
  },
})

const ConnectedHeaderToolbar = connect(mapStateToProps,mapDispatchToProps)(HeaderToolbar)

// Pass context to connected component so it knows to
// update when router state changes
class Header extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  render() {
    return <ConnectedHeaderToolbar router={this.context.router} />
  }
}

module.exports = Header