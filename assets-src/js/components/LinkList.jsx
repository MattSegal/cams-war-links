import React, {PropTypes, Component} from 'react'
import Link from './Link'

class LinkList extends Component 
{
    static propTypes = {
        links: PropTypes.array,
        readOnly: PropTypes.bool,
        onTryDeleteLink: React.PropTypes.func,
        onCancelDeleteLink: React.PropTypes.func,
        onConfirmDeleteLink: React.PropTypes.func,
    }

    render() 
    {
        let links = this.props.links.map( link => 
        (<Link 
            key={link.id} 
            readOnly={this.props.readOnly} 
            onTryDeleteLink={this.props.onTryDeleteLink} 
            onCancelDeleteLink={this.props.onCancelDeleteLink} 
            onConfirmDeleteLink={this.props.onConfirmDeleteLink} 
            {...link} 
        />))
        return (
            <ul>
                {links}
            </ul>
        )
    }
}

module.exports = LinkList