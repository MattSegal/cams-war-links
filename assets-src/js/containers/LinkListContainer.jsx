import React, {Component} from 'react';
import {connect} from 'react-redux'
import LinkList from 'components/LinkList'
import NewLinkForm from 'components/NewLinkForm'
import Actions from 'actions'

class LinkListContainer extends Component 
{
    render() 
    {
        let links = this.props.links
            .filter( link => link.user === this.props.activeUserId)
        let refreshButton = this.props.isFetching 
            ? (<button>Fetching...</button>)
            : (<button onClick={this.props.onRefreshClick}>Refresh Links</button>)
        return (
            <div>
                {refreshButton}
                <NewLinkForm onAddLink={this.props.onAddLink} />
                <LinkList links={links} />
            </div>
        )
    }
}

let mapStateToProps = (state) => ({
    links: state.links.items,
    isFetching: state.links.isFetching,
    activeUserId: state.users.activeUserId
})

let mapDispatchToProps = (dispatch) => ({
    onRefreshClick: () => dispatch(Actions.fetchLinks()),
    onAddLink: (newLink) => dispatch(Actions.addNewLink(newLink)),
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkListContainer)