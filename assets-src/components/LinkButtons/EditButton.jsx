import React, {PropTypes, Component} from 'react';
import style from 'components/Link.scss'
import {OPEN, WAITING, CLOSED} from 'constants'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaRefresh from 'react-icons/lib/fa/refresh'

const EditButton = (props) => {
    let tryEdit = () => props.select(props.linkId) 
    let cancelEdit = () => props.cancel(props.linkId) 

    let button
    if (props.status.edit === CLOSED)
    {
        button = (<span onClick={tryEdit}><FaPencil /></span>)
    }
    else if (props.status.edit === OPEN)
    {
        button = (<span onClick={cancelEdit}><FaPencil /></span>)
    }
    else
    {
        button = (<span ><FaRefresh /></span>)
    }

    return (
        <span title="Edit" className={style.button}>
            {button}
        </span>
    )
}

EditButton.propTypes = {
    linkId: React.PropTypes.number,
    status: PropTypes.object,
    select: PropTypes.func,
    cancel: PropTypes.func,
}

module.exports = EditButton