import React, {Component} from 'react';
import {connect} from 'react-redux'
import LinkList from 'components/LinkList'
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

    // TODO: add confirm delete

    // TODO: add editing

    // TODO: add description

    // TODO: add login, signup, authentication


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

        if (noActiveUser)
        {   
            const numLinks = 20
            links = links.slice(0,numLinks-1)
        }
        else 
        {
            links = links.filter( link => link.user === this.props.activeUserId)
        }

        let refreshButton = this.props.isFetching 
            ? (<button>Fetching...</button>)
            : (<button onClick={this.props.onRefreshClick}>Refresh Links</button>)

        let newLinkForm = !noActiveUser
            ? <NewLinkForm onAddLink={this.props.onAddLink} activeUserId={this.props.activeUserId} />
            : null

        let newLinksHeader = noActiveUser
            ? (<h2>Latest Links</h2>)
            : null

        return (
            <div>
                {refreshButton}
                {newLinkForm}
                {newLinksHeader}
                <LinkList 
                    readOnly={noActiveUser} 
                    links={links} 
                    onTryDeleteLink={this.props.onTryDeleteLink} 
                    onCancelDeleteLink={this.props.onCancelDeleteLink} 
                    onConfirmDeleteLink={this.props.onConfirmDeleteLink} 
                />
            </div>
        )
    }
}

let mapStateToProps = (state) => ({
    links: state.links.items,
    users: state.users.items,
    isFetching: state.links.isFetching,
    activeUserId: state.users.activeUserId
})

let mapDispatchToProps = (dispatch) => ({
    onRefreshClick: () => dispatch(Actions.fetchLinks()),
    onAddLink: (newLink) => dispatch(Actions.addNewLink(newLink)),
    onTryDeleteLink: (link_id) => dispatch(Actions.tryDeleteLink(link_id)),
    onCancelDeleteLink: (link_id) => dispatch(Actions.cancelDeleteLink(link_id)),
    onConfirmDeleteLink: (link_id) => dispatch(Actions.confirmDeleteLink(link_id)),
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkListContainer)