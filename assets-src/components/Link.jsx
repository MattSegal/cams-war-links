import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux'
import MoreInfoButton from 'components/MoreInfoButton'
import DeleteButton from 'components/DeleteButton'
import DeleteLinkForm from 'components/DeleteLinkForm'
import EditButton from 'components/EditButton'
import LinkForm from 'components/LinkForm'
import BookmarkButton from 'components/BookmarkButton'
import style from 'components/Link.scss'
import {OPEN, WAITING, CLOSED, NO_USER_SELECTED} from 'constants'
import {getTimeSince} from 'utilities'


const Link = (props) =>
{
    const ownerOnly = (jsx) => props.user === props.currentUser.id ? jsx : null
    const loggedInOnly = (jsx) => props.currentUser.id !== NO_USER_SELECTED ? jsx : null

    const moreInfoButton = <MoreInfoButton
        linkId={props.id}
        status={props.status.details}
        {...props.linkDetails} />

    const bookmarkButton = loggedInOnly(
        <BookmarkButton 
            linkId={props.id} 
            status={props.bookmark} 
            {...props.bookmarkLink} />)

    const description = props.description !== ""
        ? <p>{props.description}</p>
        : <p>No description</p>
    
    const moreInfoDisplay = props.status.details === OPEN 
        ? description
        : null

    const deleteButton = ownerOnly(
        <DeleteButton 
            linkId={props.id} 
            status={props.status} 
            {...props.deleteLink} />)

    const deleteLinkForm =  ownerOnly(
        <DeleteLinkForm 
            linkId={props.id} 
            status={props.status} 
            {...props.deleteLink} />)


    const editButton = ownerOnly(
        <EditButton 
            linkId={props.id} 
            status={props.status} 
            {...props.editLink} />)

    const editLinkForm = ownerOnly(
        <LinkForm 
            linkId={props.id} 
            description={props.description} 
            title={props.title} 
            url={props.url} 
            formStatus={props.status.edit} 
            {...props.editLink} />)

    const details = props.noActiveUser
        ? (<p className={style.details} >{props.username} - {getTimeSince(props.created)} ago</p>)
        : (<p className={style.details} >{getTimeSince(props.created)} ago</p>)

    let displayContainer = props.status.edit === OPEN ||
        props.status.delete === OPEN ||
        props.status.details === OPEN 

    const linkFormContainer = displayContainer ? (
        <div className={style.linkFormContainer}>
            {deleteLinkForm}
            {editLinkForm}
            {moreInfoDisplay}
        </div>
    ) : null

    return (
        <li className={style.link}>
            <a className={style.hyperlink} href={props.url} target="_blank" rel="noopener noreferrer">
                {props.title}
            </a>
            {moreInfoButton}
            {editButton}
            {deleteButton}
            {details}
            {linkFormContainer}
        </li>
    )
}

Link.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    url: PropTypes.string,
    user: PropTypes.number,
    username: PropTypes.string,
    description: PropTypes.string,
    noActiveUser: PropTypes.bool,
    status: PropTypes.object,
    bookmark: PropTypes.string,
    deleteLink: PropTypes.object,
    editLink: PropTypes.object,
    linkDetails: PropTypes.object,
}

let mapStateToProps = (state) => ({
    currentUser: state.currentUser,
})

module.exports = connect(
    mapStateToProps
)(Link)