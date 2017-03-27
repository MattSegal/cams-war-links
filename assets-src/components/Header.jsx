import React from 'react'
import {connect} from 'react-redux'
import Actions from 'actions'
import {NO_USER_SELECTED} from 'constants'
import NewLinkButton from 'components/NewLinkButton'
import RefreshButton from 'components/RefreshButton'

const Header = props => 
{
    return (
        <div>
            <RefreshButton 
                onRefreshClick={props.onRefreshClick}
                isFetching={props.isFetching}
            />
            {props.currentUser.id !== NO_USER_SELECTED && 
            <NewLinkButton 
                addFormStatus={props.addFormStatus} 
                {...props.addLink} 
            />}
            {props.currentUser.id !== NO_USER_SELECTED && 
            <NewLinkButton 
                addFormStatus={props.addFormStatus} 
                {...props.addLink} 
            />}
        </div>
    )
}

let mapStateToProps = (state) => ({
    isFetching: state.links.isFetching,
    addFormStatus: state.links.add,
    currentUser: state.currentUser
})

let mapDispatchToProps = (dispatch) => ({
    onRefreshClick: () => dispatch(Actions.fetchLinks()),
    addLink: {
        select: () => dispatch(Actions.tryAddLink()),
        cancel: () => dispatch(Actions.cancelAddLink()),
    },
})

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)