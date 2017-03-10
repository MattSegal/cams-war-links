import {types} from 'actions'
import {pipe} from 'utilities'
import {OPEN, WAITING, CLOSED} from 'constants'
import {closeAll, closeAllExcept} from 'utilities'


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
                ? {...link, status: closeAllExcept(link.status, 'edit', OPEN)}
                : {...link, status: closeAll(link.status)}
        ),
    }
})


const cancelEditLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            ({...link, status: closeAll(link.status)})
        ),
    }
})


const requestEditLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            link.id === action.link_id
                ? {...link, status: closeAllExcept(link.status, 'edit', WAITING)}
                : {...link}
        ),
    }
})


const receiveEditLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            link.id === action.link.id
            ? {...link, ...(action.link), status: closeAll(link.status)}
            : link
        ),
    }
})

const errorEditLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            link.id === action.link_id
                ? {...link, status: {...link.status, edit: CLOSED}}
                : {...link}
        ),
    }
})


module.exports = {
    editLinkReducer
}