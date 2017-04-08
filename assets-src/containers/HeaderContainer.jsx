import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Header from 'components/Header'
import Actions from 'actions'

class HeaderContainer extends Component {
  render()
  {
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
  fetchLinks: () => dispatch(Actions.fetchLinks()),
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