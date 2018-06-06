import React, {Component} from 'react';
import {connect} from 'react-redux'

import style from 'scss/account.scss'

import { actions } from 'state'
import { titleCase } from 'utilities'


class AccountContainer extends Component
{
  render()
  {
    const { loggedInUser } = this.props
    const title = loggedInUser
      ? 'Welcome ' + titleCase(loggedInUser.username)
      : 'You are not logged in'
    return  (
      <div>
        <h1 className={style.title}>{title}</h1>
        <div className={style.options}>
          {loggedInUser && <a href="/change/">Change Password</a>}
          {loggedInUser && <a href="/logout/">Log Out</a>}
          {!loggedInUser && <a href="/signup/">Sign Up</a>}
          {!loggedInUser && <a href="/login/">Log In</a>}
        </div>
      </div>
    )
  }
}

let mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser,
})


module.exports = connect(
  mapStateToProps,
  () => ({})
)(AccountContainer)
