import {types} from 'actions'
import {pipe} from 'utilities'
import {OPEN, WAITING, CLOSED, INACTIVE} from 'constants'
import {closeAll} from 'utilities'


const addLinkReducer = (action) => (state) =>
{
    switch(action.type)
    {
        case types.TRY_ADD_LINK:        return tryAddLinkReducer(action, state)
        case types.CANCEL_ADD_LINK:     return cancelAddLinkReducer(action, state)
        case types.REQUEST_ADD_LINK:    return requestAddLinkReducer(action, state)
        case types.RECEIVE_ADD_LINK:    return receiveAddLinkReducer(action, state)
        case types.ERROR_ADD_LINK:      return errorAddLinkReducer(action, state)
        default: return {...state}
    }
}

const tryAddLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        add: OPEN,
        items: state.links.items.map(link =>
            ({...link, status: closeAll(link.status)})
        ),
    }
})


const cancelAddLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        add: CLOSED,
    }
})

    
const requestAddLinkReducer = (action, state) =>  ({
    ...state,
    links: {
        ...state.links,
        add: WAITING,
    }
})


const receiveAddLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: [...state.links.items, {
            ...action.link,
            status: closeAll(false),
            bookmark: INACTIVE // TODO: Fix this
        }],
        add: CLOSED,
    }
})

const errorAddLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        add: CLOSED,
    }
})

module.exports = {
    addLinkReducer,
}