import React, {Component} from 'react';
import {connect} from 'react-redux'
import LinkList from 'components/LinkList'

class LinkListContainer extends Component 
{
    render() 
    {
        let links = this.props.links
            .filter( link => link.isActive)
        return (<LinkList links={links} />)
    }
}

function mapStateToProps(state)
{
    return {links: state.links}
}

module.exports = connect(mapStateToProps)(LinkListContainer)