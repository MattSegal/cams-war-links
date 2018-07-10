import React, { Component, PropTypes } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import FaBook from 'react-icons/lib/fa/book'
import FaChain from 'react-icons/lib/fa/chain'
import FaPlus from 'react-icons/lib/fa/plus'
import FaRefresh from 'react-icons/lib/fa/refresh'
import FaCog from 'react-icons/lib/fa/cog'
import FaSearch from 'react-icons/lib/fa/search'

import { LoggedIn, LoggedOut } from 'containers/UtilsContainers'
import Spinner from 'components/Spinner'
import style from 'scss/Header.scss'

export default class Header extends Component {
  static propTypes ={
    updating: PropTypes.bool,
    fetchLinks: PropTypes.func,
  }

  render()
  {
    const { updating, fetchLinks } = this.props
    return (
      <header className={style.header}>
        <div className={style.headerContent}>
          <div className={style.group}>
            <Switch>
              <Route path="/search">
                <Link to="/"><h1>Search</h1></Link>
              </Route>
              <Route path="/account">
                <Link to="/"><h1>Account</h1></Link>
              </Route>
              <Route path="/bookmarks">
                <Link to="/"><h1>Bookmarks</h1></Link>
              </Route>
              <Route path="/">
                <Link to="/"><h1>Cam's War Links</h1></Link>
              </Route>
           </Switch>
          </div>
          <div className={style.group}>
            <LoggedIn>
              {!updating && <Route exact path="/" component={() =>
                <Link title="Add New Link" to="/add">
                  <FaPlus className={style.btn}/>
                </Link>
              }/>}
            </LoggedIn>
            {!updating && <Route exact path="/" component={() =>
              <FaRefresh title="Reload Links" onClick={fetchLinks} className={style.btn} />
            }/>}
            {updating && <span className={style.btn}><Spinner /></span>}
            <Route path="/(account|bookmarks|search)" component={() =>
              <Link title="Links" to="/">
                <FaChain className={style.btn}/>
              </Link>
            }/>
            <Link title="Search" to="/search">
              <FaSearch className={style.btn}/>
            </Link>
            <LoggedIn>
              <Link title="Bookmarks" to="/bookmarks">
                <FaBook className={style.btn}/>
              </Link>
            </LoggedIn>
            <Link title="Account" to="/account">
              <FaCog className={style.btn}/>
            </Link>
          </div>
        </div>
      </header>
    )
  }
}
