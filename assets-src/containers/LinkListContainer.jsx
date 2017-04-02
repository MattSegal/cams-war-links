import React, {Component} from 'react';
import {connect} from 'react-redux'
import LinkList from 'components/LinkList'
import NewLinkForm from 'components/LinkForms/NewLinkForm'
import {NO_USER_SELECTED} from 'constants'
import Actions from 'actions'

const LinkListContainer = props =>
{
    const usernames = props.users.reduce( (obj, user) => 
        ({...obj, [`${user.id}`]: user.username}), {}
    )

    const sortByDate = (link1, link2) => 
        new Date(link2.created) - new Date(link1.created)
    
    const isVisible = link => 
        link.user === props.activeUserId ||
        props.activeUserId === NO_USER_SELECTED 

    let links = props.links
        .filter(isVisible)
        .sort(sortByDate)
        .map(link => ({
            ...link,
            username: usernames[link.user]
        }))

    // Only grab 50 most recent links
    links = props.activeUserId === NO_USER_SELECTED
        ? links.slice(0, 50)
        : links

    return (
        <div>
             <NewLinkForm
                addFormStatus={props.addFormStatus} 
                addLink={props.addLink} 
            />
            <LinkList 
                links={links} 
                deleteLink={props.deleteLink} 
                editLink={props.editLink}
                linkDetails={props.linkDetails}
            />
        </div>
    )
}

let mapStateToProps = (state) => ({
    links: state.links.items,
    users: state.users.items,
    activeUserId: state.users.activeUserId,
    addFormStatus: state.links.add,
})

let mapDispatchToProps = (dispatch) => ({
    linkDetails: {
        show: (link_id) => dispatch(Actions.showLinkDetails(link_id)),
        hide: (link_id) => dispatch(Actions.hideLinkDetails(link_id)),
    },
    addLink: {
        confirm: (link) => dispatch(Actions.confirmAddLink(link)),
        cancel:() => dispatch(Actions.cancelAddLink()),
    },
    deleteLink: {
        select: (link_id) => dispatch(Actions.tryDeleteLink(link_id)),
        confirm: (link_id) => dispatch(Actions.confirmDeleteLink(link_id)),
        cancel:(link_id) => dispatch(Actions.cancelDeleteLink(link_id)),
    },
    editLink: {
        select: (link_id) => dispatch(Actions.tryEditLink(link_id)),
        confirm: (link) => dispatch(Actions.confirmEditLink(link)),
        cancel:(link_id) => dispatch(Actions.cancelEditLink(link_id)),
    },
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkListContainer)