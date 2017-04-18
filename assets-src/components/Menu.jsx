import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {LoggedIn, LoggedOut} from 'containers/UtilsContainers'
import style from 'components/Menu.scss'

class AccountPage extends PureComponent {
  static proptypes = {
    username: PropTypes.string
  }

  render() {
    const {loggedInUser} = this.props 
    const username = loggedInUser && loggedInUser.username 
      ? loggedInUser.username.toUpperCase()
      : 'ANON'

    return (
      <div className={style.wrapper}>
        <h2 className={style.title}>HI {username}</h2>
        <Link className={style.item} to="/" title="Links Page">Links</Link>
        <LoggedIn>
          <div>
            <Link className={style.item} to="/bookmarks">Bookmarks</Link>
            <a className={style.item} href="/change/">Change Password</a>
            <a className={style.item} href="/logout/">Log Out</a>
          </div>
        </LoggedIn>
        <LoggedOut>
          <div>
            <a className={style.item} href="/login/">Log In</a>
            <a className={style.item} href="/signup/">Sign Up</a>
          </div>
        </LoggedOut>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
    loggedInUser: state.loggedInUser
})

module.exports = connect(mapStateToProps)(AccountPage)