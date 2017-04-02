import React, {PropTypes, PureComponent} from 'react';
import {connect} from 'react-redux'
import MoreInfoButton from 'components/LinkButtons/MoreInfoButton'
import DeleteButton from 'components/LinkButtons/DeleteButton'
import EditButton from 'components/LinkButtons/EditButton'
import BookmarkButton from 'components/LinkButtons/BookmarkButton'
import DeleteLinkForm from 'components/LinkForms/DeleteLinkForm'
import LinkForm from 'components/LinkForms/LinkForm'
import style from 'components/Link.scss'
import {OPEN, WAITING, CLOSED, NO_USER_SELECTED} from 'constants'
import {getTimeSince} from 'utilities'


class Link extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    url: PropTypes.string,
    user: PropTypes.number,
    username: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.object,
    bookmark: PropTypes.string,
    deleteLink: PropTypes.object,
    editLink: PropTypes.object,
    linkDetails: PropTypes.object,
  }

  render()
  {
    const ownerOnly = (jsx) => this.props.user === this.props.loggedInUser.id && jsx
    const loggedInOnly = (jsx) => this.props.loggedInUser.id !== NO_USER_SELECTED && jsx

    const moreInfoButton = this.props.description
    && <MoreInfoButton
        linkId={this.props.id}
        status={this.props.status.details}
        {...this.props.linkDetails} />

    const bookmarkButton = loggedInOnly(
        <BookmarkButton 
            linkId={this.props.id} 
            status={this.props.bookmark} 
            {...this.props.bookmarkLink} />)

    const moreInfoDisplay = this.props.status.details === OPEN 
        && <p>{this.props.description}</p>

    const deleteButton = ownerOnly(
      <DeleteButton 
        linkId={this.props.id} 
        status={this.props.status} 
        {...this.props.deleteLink} />)

    const deleteLinkForm =  ownerOnly(
      <DeleteLinkForm 
        linkId={this.props.id} 
        status={this.props.status} 
        {...this.props.deleteLink} />)


    const editButton = ownerOnly(
      <EditButton 
        linkId={this.props.id} 
        status={this.props.status} 
        {...this.props.editLink} />)

    const editLinkForm = ownerOnly(
      <LinkForm 
        linkId={this.props.id} 
        description={this.props.description} 
        title={this.props.title} 
        url={this.props.url} 
        formStatus={this.props.status.edit} 
        {...this.props.editLink} />)

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
        <a className={style.hyperlink} href={this.props.url} target="_blank" rel="noopener noreferrer">
          {this.props.title}
        </a>
        {deleteButton}
        {editButton}
        {moreInfoButton}
        <p className={style.details} >
          {this.props.username} - {getTimeSince(this.props.created)} ago
        </p>
        {linkFormContainer}
      </li>
    )
  }
}

let mapStateToProps = (state) => ({
    loggedInUser: state.loggedInUser,
})

module.exports = connect(
    mapStateToProps
)(Link)