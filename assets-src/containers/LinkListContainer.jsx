import React, {Component} from 'react';
import {connect} from 'react-redux'
import UserLinkList from 'components/UserLinkList'
import LatestLinkList from 'components/LatestLinkList'
import NewLinkForm from 'components/NewLinkForm'
import Actions from 'actions'
import {NO_USER_SELECTED} from 'constants'

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
    /*
    
    TODO: 
         add signup
         add new styles
         add tags
         group links by month
         group recent links by days
         add user comments
         add 'read' checkbox and 'to-read'
             we can have views of these
         use soft delete
         reconstruct created data?
         add links as Anon
             claim links later
             sign in with Google?
         search

    */

    render() 
    {
        let noActiveUser = this.props.activeUserId === NO_USER_SELECTED
        let usernames = this.getUsernames(this.props.users)

        let links = this.props.links
            .sort( (l1, l2) => new Date(l2.created) - new Date(l1.created) )
            .map(link => ({
                ...link,
                username: usernames[link.user]
            }))

        let linkList = noActiveUser
            ? (<LatestLinkList 
                    links={links} 
                    deleteLink={this.props.deleteLink} 
                    editLink={this.props.editLink}
                    linkDetails={this.props.linkDetails}
                />)
            : (<UserLinkList 
                    activeUserId={this.props.activeUserId} 
                    links={links} 
                    deleteLink={this.props.deleteLink} 
                    editLink={this.props.editLink}
                    linkDetails={this.props.linkDetails}
                />)

        return (
            <div>
                 <NewLinkForm
                    addFormStatus={this.props.addFormStatus} 
                    addLink={this.props.addLink} 
                />
                {linkList}
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