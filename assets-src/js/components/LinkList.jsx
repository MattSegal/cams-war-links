import React, {PropTypes, Component} from 'react'
import Link from './Link'

class LinkList extends Component 
{
    static propTypes = {
        links: PropTypes.array
    }

    render() 
    {
        let links = this.props.links
            .sort( link => link.id )
            .map( link => (<Link key={link.id} {...link} />))
        return (<ul>{links}</ul>)
    }
}

module.exports = LinkList