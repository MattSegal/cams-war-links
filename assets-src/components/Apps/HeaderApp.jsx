import React, {Component, PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Route, Switch, Link} from 'react-router-dom'
import Actions from 'actions'
import {LoggedIn, LoggedOut} from 'containers/UtilsContainers'
import {NO_USER_SELECTED, OPEN, WAITING, CLOSED} from 'constants'
import FaBook from 'react-icons/lib/fa/book'
import FaChain from 'react-icons/lib/fa/chain'
import FaRefresh from 'react-icons/lib/fa/refresh'
import FaPlus from 'react-icons/lib/fa/plus'
import FaMinus from 'react-icons/lib/fa/minus'
import FaUser from 'react-icons/lib/fa/user'
import Spinner from 'components/Spinner'


class BookmarkPageButton extends Component {
  render() {
    const btn = (child) => <button onClick={this.props.cancel}>{child}</button>
    return (
      <Switch>
        <Route path="/bookmarks">
          <Link to="/" title="Links Page">
            {btn(<FaChain />)}
          </Link>
        </Route>
        <Route path="/">
          <Link to="/bookmarks" title="Bookmarks Page">
            {btn(<FaBook />)}
          </Link>
        </Route>
      </Switch>
    )
  }
}

class UserPageButton extends Component {
  render() {
    const btn = (child) => <button onClick={()=>{}}>{child}</button>
    return (
      <Switch>
        <Route path="/account">
          <Link to="/" title="Links Page">
            {btn(<FaChain />)}
          </Link>
        </Route>
        <Route path="/">
          <Link to="/account" title="Account Page">
            {btn(<FaUser />)}
          </Link>
        </Route>
      </Switch>
    )
  }
}


const NewLinkButton = props =>
{
  if (props.addFormStatus === WAITING)
  {
    return (<button>&nbsp;&nbsp;&nbsp;<Spinner /></button>)
  }

  const click = props.addFormStatus === CLOSED
    ? props.select
    : props.cancel

  const btn = (child) => <button onClick={click}>{child}</button>
  return null
  return (
    <Switch>
      <Route path="/add" render={() => (
        <Link to="/">{btn(<FaMinus />)}</Link>
      )} />
      <Route path="/" render={() => (
        <Link to="/add">{btn(<FaPlus />)}</Link>
      )} />
    </Switch>
  )
}
NewLinkButton.propTypes = {
  select: PropTypes.func,
  cancel: PropTypes.func,
  addFormStatus: PropTypes.string,
}

const RefreshButton = props => 
(
  props.isFetching
  ? <button>&nbsp;&nbsp;&nbsp;<Spinner /></button>
  : <button title="Reload Links" onClick={props.onRefreshClick}><FaRefresh /></button>
)
RefreshButton.propTypes = {
    isFetching: PropTypes.bool,
    onRefreshClick: PropTypes.func,
}


// Add login logout etc
// <div class="headerOptionWrapper">
//     {% if user.is_authenticated %}
//     <span class="headerItem">{{ user.username.title }}</span>
//     <a class="headerItem" href="/logout/">Log Out</a>
//     <a class="headerItem" href="/change/">Change Password</a></p>
//     {% else %}
//     <a class="headerItem" href="/login/">Log In</a>
//     <a class="headerItem" href="/signup/">Sign Up</a>
//     {% endif %}
// </div>




class HeaderToolbar extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  render() 
  {
    return (
      <header>
        <h1><Link className="headerItem" to="/">LINKS</Link></h1>
        <div className="headerOptionWrapper">
        <RefreshButton 
          onRefreshClick={this.props.onRefreshClick}
          isFetching={this.props.isFetching}
        />
        <LoggedIn>
          <span>
            <NewLinkButton 
              addFormStatus={this.props.addFormStatus} 
              {...this.props.addLink} 
            />
            <BookmarkPageButton {...this.props.addLink} />
            <UserPageButton />
          </span>
        </LoggedIn>
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