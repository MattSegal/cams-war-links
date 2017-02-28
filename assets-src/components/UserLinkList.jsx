import React, {PropTypes, Component} from 'react'
import Link from './Link'
import style from 'components/LinkList.scss'

class UserLinkList extends Component 
{
    static propTypes = {
        links: PropTypes.array,
        activeUserId: PropTypes.number,
        deleteLink: React.PropTypes.object,
        editLink: React.PropTypes.object,
        linkDetails: React.PropTypes.object,
    }

    render() 
    {
        let links = this.props.links
            .filter( link => link.user === this.props.activeUserId)
            .map( link => 
            (<Link 
                key={link.id} 
                deleteLink={this.props.deleteLink} 
                editLink={this.props.editLink}
                linkDetails={this.props.linkDetails}
                {...link} 
            />))

        return (
            <ul className={style.list}>
                {links}
            </ul>
        )
    }
}

module.exports = UserLinkList