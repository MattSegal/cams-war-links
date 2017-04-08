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
    updating: PropTypes.bool,
    fetchLinks: PropTypes.func,
  }

  render() 
  {
    const {updating, fetchLinks} = this.props
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
            <span>
              {!updating && <Route exact path="/" component={() =>
                <FaRefresh title="Reload Links" onClick={fetchLinks} className={style.btn} />
              }/>}
              {!updating && <Route exact path="/" component={() =>
                <Link title="Add New Link" to="/add">
                  <FaPlus className={style.btn}/>
                </Link>
              }/>}
              {updating && <span className={style.btn}><Spinner /></span>}
            </span>
          </LoggedIn>
        </div>
        <div className={style.group}>
          <Switch>
            <Route path="/menu">
              <Link to="/" title="Menu"><FaBars className={style.btn}/></Link>
            </Route>
            <Route path="/">
              <Link to="/menu" title="Menu"><FaBars className={style.btn}/></Link>
            </Route>
          </Switch>
        </div>
      </header>
    )
  }
}
