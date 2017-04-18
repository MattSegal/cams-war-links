import React, {Component, PureComponent, PropTypes} from 'react'
import {NO_USER_SELECTED} from 'constants'
import {connect} from 'react-redux'

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
    return loggedInUser && loggedInUser.id === NO_USER_SELECTED
      ? (this.props.children)
      : null
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