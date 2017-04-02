import React, {PropTypes, Component} from 'react';
import style from 'components/Link.scss'
import {OPEN, WAITING, CLOSED} from 'constants'
import FaTrashO from 'react-icons/lib/fa/trash-o'
import FaRefresh from 'react-icons/lib/fa/refresh'


class DeleteButton extends Component 
{
    static propTypes = {
        linkId: React.PropTypes.number,
        status: PropTypes.object,
        select: PropTypes.func,
        cancel: PropTypes.func,
    }

    render() 
    {
        let tryDelete = () => this.props.select(this.props.linkId)
        let cancelDelete = () => this.props.cancel(this.props.linkId)
        let button
        if (this.props.status.delete === CLOSED)
        {
            button = (<span onClick={tryDelete}><FaTrashO /></span>)
        }
        else if (this.props.status.delete === OPEN)
        {
            button = (<span onClick={cancelDelete}><FaTrashO /></span>)
        }
        else
        {
            button = (<span ><FaRefresh /></span>)
        }

        return (
            <span title="Delete" className={style.button}>
                {button}
            </span>
        )
    }
}

module.exports = DeleteButton