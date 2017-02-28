import React, {PropTypes, Component} from 'react';
import style from 'components/Link.scss'
import {OPEN, WAITING, CLOSED} from 'constants'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaRefresh from 'react-icons/lib/fa/refresh'

class EditButton extends Component 
{
    static propTypes = {
        linkId: React.PropTypes.number,
        status: PropTypes.object,
        select: PropTypes.func,
        cancel: PropTypes.func,
    }

    render() 
    {
        let tryEdit = () => this.props.select(this.props.linkId) 
        let cancelEdit = () => this.props.cancel(this.props.linkId) 

        let button
        if (this.props.status.edit === CLOSED)
        {
            button = (<span onClick={tryEdit}><FaPencil /></span>)
        }
        else if (this.props.status.edit === OPEN)
        {
            button = (<span onClick={cancelEdit}><FaPencil /></span>)
        }
        else
        {
            button = (<span ><FaRefresh /></span>)
        }

        return (
            <span className={style.button}>
                {button}
            </span>
        )
    }
}

module.exports = EditButton