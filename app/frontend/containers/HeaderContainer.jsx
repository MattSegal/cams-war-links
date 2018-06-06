import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { actions } from 'state'
import Header from 'components/Header'


class HeaderContainer extends Component {
  render() {
    return (
      <Header
        updating={this.props.updating}
        fetchLinks={this.props.fetchLinks}
      />
     )
  }
}

const mapStateToProps = (state) => ({
  updating: state.links.updating,
})

const mapDispatchToProps = (dispatch) => ({
  fetchLinks: () => dispatch(actions.fetchLinks()),
})

const ConnectedHeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContainer)

// Pass context to connected component so it knows to
// update when router state changes
class RoutedHeader extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  render() {
    return <ConnectedHeaderContainer router={this.context.router} />
  }
}

module.exports = RoutedHeader
