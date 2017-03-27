import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom'
import Actions from 'actions'
import {NO_USER_SELECTED, OPEN, WAITING, CLOSED} from 'constants'
import FaBook from 'react-icons/lib/fa/book'
import FaChain from 'react-icons/lib/fa/chain'
import FaRefresh from 'react-icons/lib/fa/refresh'
import FaPlus from 'react-icons/lib/fa/plus'
import FaMinus from 'react-icons/lib/fa/minus'
import Spinner from 'components/Spinner'


const BookmarkPageButton = props => {
  const btn = (child) => <button onClick={props.cancel}>{child}</button>
  return (
    <Switch>
      <Route path="/bookmarks" render={() => (
        <Link to="/">{btn(<FaChain />)}</Link>
      )} />
      <Route path="/" render={() => (
        <Link to="/bookmarks">{btn(<FaBook />)}</Link>
      )} />
    </Switch>
  )
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
  : <button onClick={props.onRefreshClick}><FaRefresh /></button>
)
RefreshButton.propTypes = {
    isFetching: PropTypes.bool,
    onRefreshClick: PropTypes.func,
}


const Header = props => 
{
  const loggedIn = props.currentUser.id !== NO_USER_SELECTED
  return (
    <Router>
      <div>
        <RefreshButton 
          onRefreshClick={props.onRefreshClick}
          isFetching={props.isFetching}
        />
        {loggedIn && 
          <span>
            <NewLinkButton 
              addFormStatus={props.addFormStatus} 
              {...props.addLink} 
            />
            <BookmarkPageButton {...props.addLink} />
          </span>
        }
      </div>
    </Router>
  )
}

let mapStateToProps = (state) => ({
  isFetching: state.links.isFetching,
  addFormStatus: state.links.add,
  currentUser: state.currentUser
})

let mapDispatchToProps = (dispatch) => ({
  onRefreshClick: () => dispatch(Actions.fetchLinks()),
  addLink: {
    select: () => dispatch(Actions.tryAddLink()),
    cancel: () => dispatch(Actions.cancelAddLink()),
  },
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)