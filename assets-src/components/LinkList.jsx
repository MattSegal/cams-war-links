import React, {PropTypes} from 'react'
import Link from './Link'
import style from 'components/LinkList.scss'

const LinkList = props => 
{
    const links = props.links
    .map( link => 
        (<Link 
            key={link.id}
            deleteLink={props.deleteLink} 
            editLink={props.editLink}
            linkDetails={props.linkDetails}
            {...link} 
        />))

    return (
        <ul className={style.list}>
            {links}
        </ul>
    )
}
LinkList.propTypes = {
    links: PropTypes.array,
    deleteLink: React.PropTypes.object,
    editLink: React.PropTypes.object,
    linkDetails: React.PropTypes.object,
}

module.exports = LinkList