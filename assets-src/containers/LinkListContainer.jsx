import React, {Component} from 'react';
import {connect} from 'react-redux'
import LinkList from 'components/LinkList'
import NewLinkForm from 'components/NewLinkForm'
import Actions from 'actions'

class LinkListContainer extends Component 
{

    getUsernames(users)
    {
        let usernames = {}
        for (let user of users)
        {
            usernames[user.id] = user.username
        }
        return usernames
    }

    render() 
    {
        let usernames = this.getUsernames(this.props.users)

        let links = this.props.links
            .sort( (l1, l2) => new Date(l2.created) - new Date(l1.created) )
            .map(link => ({
                ...link,
                username: usernames[link.user]
            }))

        return (
            <div>
                 <NewLinkForm
                    addFormStatus={this.props.addFormStatus} 
                    addLink={this.props.addLink} 
                />
                <LinkList 
                    activeUserId={this.props.activeUserId} 
                    links={links} 
                    deleteLink={this.props.deleteLink} 
                    editLink={this.props.editLink}
                    linkDetails={this.props.linkDetails}
                />
            </div>
        )
    }
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