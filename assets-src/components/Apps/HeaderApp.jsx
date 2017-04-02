import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Switch, Route, Link} from 'react-router-dom'
import Actions from 'actions'
import {LoggedIn, LoggedOut} from 'containers/UtilsContainers'
import NewLinkButton from 'components/HeaderButtons/NewLinkButton'
import RefreshButton from 'components/HeaderButtons/RefreshButton'
import FaUser from 'react-icons/lib/fa/user'
import FaChain from 'react-icons/lib/fa/chain'
import FaBook from 'react-icons/lib/fa/book'
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
          <Route path="/account">
            <Link to="/"><h1>ACCOUNT</h1></Link>
          </Route>
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
          <Link to="/" title="Links Page">
            <button onClick={addLink.cancel}><FaChain /></button>
          </Link>
          <LoggedIn>
            <Link to="/bookmarks" title="Bookmarks Page">
              <button onClick={addLink.cancel}><FaBook /></button>
            </Link>
          </LoggedIn>
          <Link to="/account" title="Account Page">
            <button onClick={addLink.cancel}><FaUser /></button>
          </Link>
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