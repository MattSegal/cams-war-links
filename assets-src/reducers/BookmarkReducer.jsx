import {types} from 'actions'
import {ACTIVE, INACTIVE} from 'constants'


const deleteLinkReducer = (action) => (state) =>
{
    switch(action.type)
    {
        case types.REQUEST_BOOKMARK_LINK:    return requestBookmarkLinkReducer(action, state)
        case types.REQUEST_UNBOOKMARK_LINK:  return requestUnBookmarkLinkReducer(action, state)
        case types.RECEIVE_BOOKMARK_LINK:    return receiveBookmarkLinkReducer(action, state)
        case types.ERROR_BOOKMARK_LINK:      return errorBookmarkLinkReducer(action, state)
        default: return {...state}
    }
}
        

const requestBookmarkLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            link.id === action.link_id
            state.currentUser.bookmarks
                ? {...link, status: {...link.status, bookmark: ACTIVE}}
                : {...link}
        ),
    }
})


const requestUnBookmarkLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            link.id === action.link_id
                ? {...link, status: {...link.status, bookmark: INACTIVE}}
                : {...link}
        ),
    }
})
        

const receiveBookmarkLinkReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.filter(link =>
            link.id != action.link_id
        ),
    }
})


module.exports = {
    bookmarkLinkReducer
}