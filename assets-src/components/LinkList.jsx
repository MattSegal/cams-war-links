import React, {PropTypes} from 'react'
import Link from './Link'
import style from 'components/LinkList.scss'
import {NO_USER_SELECTED} from 'constants'

const LinkList = props => 
{
    const isHidden = link => 
        link.user !== props.activeUserId &&
        props.activeUserId !== NO_USER_SELECTED 

    const links = props.links
    .filter(link => !isHidden(link))
    .map( link => 
        (<Link 
            key={link.id}
            isHidden={isHidden(link)}
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
    activeUserId: PropTypes.number,
    deleteLink: React.PropTypes.object,
    editLink: React.PropTypes.object,
    linkDetails: React.PropTypes.object,
}

module.exports = LinkList