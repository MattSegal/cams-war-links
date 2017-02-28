import React, {Component, PropTypes} from 'react'
import FaRefresh from 'react-icons/lib/fa/refresh'
import Spinner from 'components/Spinner'


class RefreshButton extends Component 
{
    static propTypes = {
        isFetching: PropTypes.bool,
        onRefreshClick: PropTypes.func,
    }

    render() 
    {
        if (this.props.isFetching)
        {
            return (<button>&nbsp;&nbsp;&nbsp;<Spinner /></button>)
        }
        else
        {
            return (<button onClick={this.props.onRefreshClick}><FaRefresh /></button>)
        }
    }
}


module.exports = RefreshButton