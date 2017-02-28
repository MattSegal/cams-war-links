import {types} from 'actions'
import {pipe} from 'utilities'
import {OPEN, WAITING, CLOSED} from 'constants'


const editLinkReducer = (action) => (state) =>
{
    switch(action.type)
    {
        case types.TRY_EDIT_LINK:        return tryEditLinkReducer(action, state)
        case types.CANCEL_EDIT_LINK:     return cancelEditLinkReducer(action, state)
        case types.REQUEST_EDIT_LINK:    return requestEditLinkReducer(action, state)
        case types.RECEIVE_EDIT_LINK:    return receiveEditLinkReducer(action, state)
        case types.ERROR_EDIT_LINK:      return errorEditLinkReducer(action, state)
        default: return {...state}
    }
}

const tryEditLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        add: CLOSED,
        items: state.links.items.map(link =>
            link.id === action.link_id
                ? {...link, status: {edit: OPEN, delete: CLOSED, details: CLOSED}}
                : {...link, status: {edit: CLOSED, delete: CLOSED, details: CLOSED}}
        ),
    }
})


const cancelEditLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            ({...link, status: {edit: CLOSED, delete: CLOSED, details: CLOSED}})
        ),
    }
})


const requestEditLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            link.id === action.link_id
                ? {...link, status: {edit: WAITING, delete: CLOSED, details: CLOSED}}
                : {...link, status: {edit: CLOSED, delete: CLOSED, details: CLOSED}}
        ),
    }
})


const receiveEditLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            link.id === action.link.id
            ? {...link, ...(action.link), status: {edit: CLOSED, delete: CLOSED, details: CLOSED}}
            : link
        ),
    }
})


module.exports = {
    editLinkReducer
}