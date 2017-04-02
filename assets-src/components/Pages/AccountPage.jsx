import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import {LoggedIn, LoggedOut} from 'containers/UtilsContainers'
import style from 'components/Pages/AccountPage.scss'

class AccountPage extends PureComponent {
  static proptypes = {
    username: PropTypes.string
  }

  render() {
    const {loggedInUser} = this.props 
    const username = loggedInUser.username 
      ? loggedInUser.username.toUpperCase()
      : 'ANON'

    return (
      <div className={style.wrapper}>
        <LoggedIn>
          <div>
            <h2 className={style.title}>HI {username}</h2>
            <a className={style.item} href="/logout/">Log Out</a>
            <a className={style.item} href="/change/">Change Password</a>
          </div>
        </LoggedIn>
        <LoggedOut>
          <div>
            <h2 className={style.title}>HI {username}</h2>
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