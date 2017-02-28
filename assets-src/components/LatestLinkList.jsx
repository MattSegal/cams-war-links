import React, {PropTypes, Component} from 'react'
import Link from './Link'
import style from 'components/LinkList.scss'
import NewLinkForm from 'components/NewLinkForm'


class LatestLinkList extends Component 
{
    static propTypes = {
        links: PropTypes.array,
        addLink: React.PropTypes.object,
        deleteLink: React.PropTypes.object,
        editLink: React.PropTypes.object,
        linkDetails: React.PropTypes.object,
    }

    render() 
    {
        let links = this.props.links
            .map( link => 
            (<Link 
                key={link.id} 
                noActiveUser={true} 
                deleteLink={this.props.deleteLink} 
                editLink={this.props.editLink} 
                linkDetails={this.props.linkDetails}
                {...link} 
            />))

        return (
            <div>
                <ul className={style.list}>
                    {links}
                </ul>
            </div>
        )
    }
}

module.exports = LatestLinkList