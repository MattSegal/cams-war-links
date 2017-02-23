import {types} from 'actions'
import {pipe} from 'utilities'
import {OPEN, WAITING, CLOSED} from 'constants'

const tryDeleteLinkReducer = (action) => (state) => {
    switch(action.type)
    {
        case types.TRY_DELETE_LINK:
        {
            return {
                ...state,
                links: {
                    ...state.links,
                    items: state.links.items.map(link =>
                        link.id === action.link_id
                            ? {...link, status: {delete: OPEN, edit: CLOSED}}
                            : {...link, status: {delete: CLOSED, edit: CLOSED}}
                    ),
                }
            }
        }
        default: return {...state}
    }
}

const cancelDeleteLinkReducer = (action) => (state) => {
    switch(action.type)
    {
        case types.CANCEL_DELETE_LINK:
        {
            return {
                ...state,
                links: {
                    ...state.links,
                    items: state.links.items.map(link =>
                        ({...link, status: {delete: CLOSED, edit: CLOSED}})
                    ),
                }
            }
        }
        default: return {...state}
    }
}

const requestDeleteLinkReducer = (action) => (state) => {
    switch(action.type)
    {
        case types.REQUEST_DELETE_LINK:
        {
            return {
                ...state,
                links: {
                    ...state.links,
                    items: state.links.items.map(link =>
                        link.id === action.link_id
                            ? {...link, status: {delete: WAITING, edit: CLOSED}}
                            : {...link, status: {delete: CLOSED, edit: CLOSED}}
                    ),
                }
            }
        }
        default: return {...state}
    }
}

const receiveDeleteLinkReducer = (action) => (state) => {
    switch(action.type)
    {
        case types.RECEIVE_DELETE_LINK:
        {
            return {
                ...state,
                links: {
                    ...state.links,
                    items: state.links.items.filter(link =>
                        link.id != action.link_id
                    ),
                }
            }
        }
        default: return {...state}
    }
}

const deleteLinkReducer = (action) => (state) =>
    pipe(
        tryDeleteLinkReducer(action),
        cancelDeleteLinkReducer(action),
        requestDeleteLinkReducer(action),
        receiveDeleteLinkReducer(action),
    )(state)

module.exports = {
    deleteLinkReducer
}