import React, {Component} from 'react';
import {connect} from 'react-redux'
import LinkList from 'components/LinkList'
import {NO_USER_SELECTED} from 'constants'

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

    return <LinkList links={links} />
}

const mapStateToProps = (state) => ({
    links: state.links.items,
    users: state.users.items,
    activeUserId: state.users.activeUserId,
    addFormStatus: state.links.add,
})

const mapDispatchToProps = (dispatch) => ({})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkListContainer)