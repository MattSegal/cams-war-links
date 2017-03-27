import React, {PropTypes, Component} from 'react';
import style from 'components/Link.scss'
import {OPEN, WAITING, CLOSED} from 'constants'
import FaClose from 'react-icons/lib/fa/close'
import FaTrash from 'react-icons/lib/fa/trash'

class DeleteLinkForm extends Component
{
    static propTypes = {
        linkId: React.PropTypes.number,
        status: PropTypes.object,
        cancel: PropTypes.func,
        confirm: PropTypes.func,
    }

    render()
    {
        let isDeleteDialogue = this.props.status && this.props.status.delete === OPEN
        if (!isDeleteDialogue) {return null}

        let cancel = () => this.props.cancel(this.props.linkId) 
        let confirm = () => this.props.confirm(this.props.linkId) 

        return (
            <div className={style.deleteForm}>
                <div className={style.deleteButton} onClick={confirm}><FaTrash /></div>
                <div className={style.cancelButton} onClick={cancel}><FaClose /></div>
            </div>
        )
    }
}

module.exports = DeleteLinkForm