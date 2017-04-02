import React, {Component, PropTypes} from 'react'
import {OPEN, WAITING, CLOSED} from 'constants'
import FaPlus from 'react-icons/lib/fa/plus'
import FaMinus from 'react-icons/lib/fa/minus'
import Spinner from 'components/Spinner'


export default class NewLinkButton extends Component {
  static propTypes = {
    select: PropTypes.func,
    cancel: PropTypes.func,
    addFormStatus: PropTypes.string,
  }

  render() {
    const {addFormStatus, select, cancel} = this.props

    if (addFormStatus === WAITING)
    {
      return (<button>&nbsp;&nbsp;&nbsp;<Spinner /></button>)
    }
    else if (addFormStatus === OPEN)
    {
      return (<button title="Add New Link" onClick={cancel}><FaMinus /></button>)
    }
    else
    {
      return (<button title="Add New Link" onClick={select}><FaPlus /></button>)
    }
  }
}