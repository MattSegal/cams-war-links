import {types} from 'actions'
import {OPEN, WAITING, CLOSED} from 'constants'
import {closeAll, closeAllExcept} from 'utilities'


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
                ? {...link, status: closeAllExcept(link.status, 'delete', OPEN)}
                : {...link, status: closeAll(link.status)}
        ),
    }
})


const cancelDeleteLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            ({...link, status: closeAll(link.status)})
        ),
    }
})
        

const requestDeleteLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            link.id === action.link_id
                ? {...link, status: closeAllExcept(link.status, 'delete', WAITING)}
                : {...link}
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

const errorDeleteLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            link.id === action.link_id
                ? {...link, status: {...link.status, delete: CLOSED}}
                : {...link}
        ),
    }
})

module.exports = {
    deleteLinkReducer
}