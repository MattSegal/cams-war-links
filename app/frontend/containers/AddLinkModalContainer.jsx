import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'

import { actions } from 'state'
import Modal from 'components/Modal'
import LinkForm from 'components/LinkForm'

class LinkModalContainer extends Component
{
  static propTypes = {
    loggedInUser: PropTypes.object,
    addLink: PropTypes.func,
  }

  constructor(props)
  {
    super(props)
    this.state = {
      title: '',
      url: '',
      description: ''
    }
    this.submitAddLink = this.submitAddLink.bind(this)
  }

  // TODO: Form validation
  submitAddLink()
  {
    this.props.addLink({
      title: this.state.title,
      url: this.state.url,
      description: this.state.description,
      user_id: this.props.loggedInUser.id,
    })
  }

  render()
  {
    return (
      <Modal closeRoute="/">
        <LinkForm
          action={this.submitAddLink}
          state={this.state}
          setState={(obj) => this.setState(obj)}
          backToURL="/"
        />
      </Modal>
    )
  }
}

let mapStateToProps = (state) => ({
    loggedInUser: state.loggedInUser,
})

let mapDispatchToProps = (dispatch) => ({
    addLink: (link) => dispatch(actions.addLink(link))
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkModalContainer)
