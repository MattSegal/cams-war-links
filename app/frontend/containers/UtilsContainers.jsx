import React, { Component, PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'

import { NO_USER_SELECTED } from 'constants'


class LoggedInContainer extends Component {
  render() {
    const {loggedInUser} = this.props
    return loggedInUser && loggedInUser.id !== NO_USER_SELECTED
      ? (this.props.children)
      : null
  }
}

class LoggedOutContainer extends Component {
  render() {
    const {loggedInUser} = this.props
    return loggedInUser
      ? null
      : (this.props.children)
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.loggedInUser
})

const LoggedIn = connect(mapStateToProps)(LoggedInContainer)
const LoggedOut = connect(mapStateToProps)(LoggedOutContainer)


module.exports = {
  LoggedIn,
  LoggedOut,
}
