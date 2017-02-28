import {types} from 'actions'
import {OPEN, WAITING, CLOSED} from 'constants'


const deleteLinkReducer = (action) => (state) =>
{
    switch(action.type)
    {
        case types.TRY_DELETE_LINK:        return tryDeleteLinkReducer(action, state)
        case types.CANCEL_DELETE_LINK:     return cancelDeleteLinkReducer(action, state)
        case types.REQUEST_DELETE_LINK:    return requestDeleteLinkReducer(action, state)
        case types.RECEIVE_DELETE_LINK:    return receiveDeleteLinkReducer(action, state)
        case types.ERROR_DELETE_LINK:      return errorDeleteLinkReducer(action, state)
        default: return {...state}
    }
}


const tryDeleteLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        add: CLOSED,
        items: state.links.items.map(link =>
            link.id === action.link_id
                ? {...link, status: {delete: OPEN, edit: CLOSED, details: CLOSED}}
                : {...link, status: {delete: CLOSED, edit: CLOSED, details: CLOSED}}
        ),
    }
})


const cancelDeleteLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            ({...link, status: {delete: CLOSED, edit: CLOSED, details: CLOSED}})
        ),
    }
})
        

const requestDeleteLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            link.id === action.link_id
                ? {...link, status: {delete: WAITING, edit: CLOSED, details: CLOSED}}
                : {...link, status: {delete: CLOSED, edit: CLOSED, details: CLOSED}}
        ),
    }
})
        

const receiveDeleteLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.filter(link =>
            link.id != action.link_id
        ),
    }
})


module.exports = {
    deleteLinkReducer
}