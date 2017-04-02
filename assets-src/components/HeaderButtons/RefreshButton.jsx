import React, {PureComponent, PropTypes} from 'react'
import {OPEN, WAITING, CLOSED} from 'constants'
import FaRefresh from 'react-icons/lib/fa/refresh'
import Spinner from 'components/Spinner'


export default class RefreshButton extends PureComponent {
 static propTypes = {
    isFetching: PropTypes.bool,
    onRefreshClick: PropTypes.func,
  }

  render() {
    const {isFetching, onRefreshClick} = this.props
    return isFetching
      ? (<button>&nbsp;&nbsp;&nbsp;<Spinner /></button>)
      : (<button title="Reload Links" onClick={onRefreshClick}><FaRefresh /></button>)
  }
}
