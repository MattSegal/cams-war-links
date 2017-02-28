import React, {PropTypes, Component} from 'react';
import {OPEN, WAITING, CLOSED} from 'constants'
import FaPlus from 'react-icons/lib/fa/plus'
import FaMinus from 'react-icons/lib/fa/minus'
import Spinner from 'components/Spinner'

class NewLinkButton extends Component 
{
    static propTypes = {
        select: PropTypes.func,
        cancel: PropTypes.func,
        addFormStatus: PropTypes.string,
    }

    render() 
    {
        if (this.props.addFormStatus === CLOSED)
        {
            return (<button onClick={this.props.select}><FaPlus /></button>)
        }
        if (this.props.addFormStatus === WAITING)
        {
            return (<button>&nbsp;&nbsp;&nbsp;<Spinner /></button>)
        }
        else
        {
            return (<button onClick={this.props.cancel}><FaMinus /></button>)
        }
    }
}

module.exports = NewLinkButton