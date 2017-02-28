import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux'
import MoreInfoButton from 'components/MoreInfoButton'
import DeleteButton from 'components/DeleteButton'
import DeleteLinkForm from 'components/DeleteLinkForm'
import EditButton from 'components/EditButton'
import LinkForm from 'components/LinkForm'
import style from 'components/Link.scss'
import {OPEN, WAITING, CLOSED} from 'constants'


class Link extends Component 
{
    static propTypes = {
        id: PropTypes.number,
        title: PropTypes.string,
        url: PropTypes.string,
        user: PropTypes.number,
        username: PropTypes.string,
        description: PropTypes.string,
        noActiveUser: PropTypes.bool,
        status: PropTypes.object,
        deleteLink: React.PropTypes.object,
        editLink: React.PropTypes.object,
        linkDetails: React.PropTypes.object,
    }

    timeSince = (date) => 
    {
        var seconds = Math.floor((new Date() - new Date(date)) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) { return interval + " years" }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) { return interval + " months" }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) { return interval + " days" }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) { return interval + " hours" }
        interval = Math.floor(seconds / 60);
        if (interval > 1) { return interval + " minutes" }
        return Math.floor(seconds) + " seconds";
    }

    render() 
    {
        let userOwnsLink = this.props.user === this.props.currentUser.id

        const moreInfoButton = (<MoreInfoButton
            linkId={this.props.id}
            status={this.props.status.details}
            {...this.props.linkDetails}
        />)

        // const description = this.props.description !== ""
        //     ? <p>{this.props.description}</p>
        //     : <p>No description</p>

        const description = <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        
        const moreInfoDisplay = this.props.status.details === OPEN 
            ? description
            : null

        // const moreInfoDisplay = description

        const deleteButton = userOwnsLink
            ? <DeleteButton linkId={this.props.id} status={this.props.status} {...this.props.deleteLink} />
            : null

        const deleteLinkForm =  userOwnsLink
            ? <DeleteLinkForm linkId={this.props.id} status={this.props.status} {...this.props.deleteLink} />
            : null

        const editButton = userOwnsLink
            ? <EditButton linkId={this.props.id} status={this.props.status} {...this.props.editLink} />
            : null

        const editLinkForm = userOwnsLink
            ? <LinkForm 
                linkId={this.props.id} 
                description={this.props.description} 
                title={this.props.title} 
                url={this.props.url} 
                formStatus={this.props.status.edit} 
                {...this.props.editLink} />
            : null

        const details = this.props.noActiveUser
            ? (<p className={style.details} >{this.props.username} - {this.timeSince(this.props.created)} ago</p>)
            : (<p className={style.details} >{this.timeSince(this.props.created)} ago</p>)

        let displayContainer = this.props.status.edit === OPEN ||
            this.props.status.delete === OPEN ||
            this.props.status.details === OPEN 

        const linkFormContainer = displayContainer ? (
            <div className={style.linkFormContainer}>
                {deleteLinkForm}
                {editLinkForm}
                {moreInfoDisplay}
            </div>
        ) : null

        return (
            <li className={style.link}>
                <a className={style.hyperlink} href={this.props.url}>
                    {this.props.title}
                </a>
                {moreInfoButton}
                {editButton}
                {deleteButton}
                {details}
                {linkFormContainer}
            </li>
        )
    }
}

let mapStateToProps = (state) => ({
    currentUser: state.currentUser,
})

module.exports = connect(
    mapStateToProps
)(Link)