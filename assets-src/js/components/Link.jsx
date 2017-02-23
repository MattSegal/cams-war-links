import React, {PropTypes, Component} from 'react';
import style from 'components/Link.scss'
import {OPEN, WAITING, CLOSED} from 'constants'

class Link extends Component 
{
    static propTypes = {
        id: PropTypes.number,
        title: PropTypes.string,
        url: PropTypes.string,
        user: PropTypes.number,
        username: PropTypes.string,
        readOnly: PropTypes.bool,
        status: PropTypes.object,
        onTryDeleteLink: PropTypes.func,
        onCancelDeleteLink: PropTypes.func,
        onConfirmDeleteLink: PropTypes.func,

    }

    render() 
    {
        let onTryDeleteLink = () => this.props.onTryDeleteLink(this.props.id) 
        let onCancelDeleteLink = () => this.props.onCancelDeleteLink(this.props.id) 
        let onConfirmDeleteLink = () => this.props.onConfirmDeleteLink(this.props.id) 

        const tryDeleteButton = !this.props.readOnly && (!this.props.status || this.props.status.delete === CLOSED)
            ? (<span className={style.button} onClick={onTryDeleteLink}>(Delete)</span>)
            : null

        const cancelDeleteButton = this.props.status && this.props.status.delete === OPEN
            ? (<span className={style.button} onClick={onCancelDeleteLink}>(Cancel)</span>)
            : null

        const confirmDeleteButton = this.props.status && this.props.status.delete === OPEN
            ? (<span className={style.button} onClick={onConfirmDeleteLink}>(Confirm)</span>)
            : null

        const pendingDeleteLabel = this.props.status && this.props.status.delete === WAITING
            ? (<span className={style.button}>(Deleting...)</span>)
            : null

        const userLabel = this.props.readOnly
            ? (<span className={style.button} >{this.props.username}</span>)
            : null

        let deleteLink = () => this.props.onDeleteLink(this.props.id)
        return (
            <li className={style.li}>
                <a href={this.props.url}>
                    {this.props.title}
                </a>
                {userLabel}
                {tryDeleteButton}
                {cancelDeleteButton}
                {confirmDeleteButton}
                {pendingDeleteLabel}
            </li>
        )
    }
}

module.exports = Link