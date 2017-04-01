import React, {Component, PureComponent, PropTypes} from 'react'
import {NO_USER_SELECTED} from 'constants'
import {connect} from 'react-redux'

class LoggedInContainer extends Component {
  render() {
    return this.props.currentUser.id !== NO_USER_SELECTED
      ? (this.props.children)
      : null
  }
}

class LoggedOutContainer extends Component {
  render() {
    return this.props.currentUser.id === NO_USER_SELECTED
      ? (this.props.children)
      : null
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser
})

const LoggedIn = connect(mapStateToProps)(LoggedInContainer)
const LoggedOut = connect(mapStateToProps)(LoggedOutContainer)


module.exports = {
  LoggedIn,
  LoggedOut,
}