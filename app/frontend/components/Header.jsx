import React, {Component, PropTypes} from 'react'
import {Switch, Route, Link} from 'react-router-dom'
import {LoggedIn, LoggedOut} from 'containers/UtilsContainers'
import FaBars from 'react-icons/lib/fa/bars'
import FaPlus from 'react-icons/lib/fa/plus'
import FaRefresh from 'react-icons/lib/fa/refresh'
import Spinner from 'components/Spinner'
import style from 'components/Header.scss'

export default class Header extends Component {
  static propTypes ={
    username: PropTypes.string,
    updating: PropTypes.bool,
    fetchLinks: PropTypes.func,
    toggleSidebar: PropTypes.func,
  }

  render() 
  {
    const {updating, fetchLinks, toggleSidebar, username} = this.props
    return (
      <header className={style.header}>
        <div className={style.headerContent}>
          <div className={style.group}>
            <FaBars 
              onClick={toggleSidebar}
              className={style.btn}
            />
            <Switch>
            <Route path="/bookmarks">
              <Link to="/"><h1>Bookmarks</h1></Link>
              </Route>
              <Route path="/">
                <Link to="/"><h1>{username ? username : 'Links'}</h1></Link>
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
          </div>
        </div>
      </header>
    )
  }
}
