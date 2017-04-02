import {types} from 'actions'
import {ACTIVE, INACTIVE, WAITING} from 'constants'


const bookmarkLinkReducer = (action) => (state) =>
{
    switch(action.type)
    {
        case types.REQUEST_BOOKMARK_LINK:    return requestBookmarkLinkReducer(action, state)
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
            state.loggedInUser.bookmarks.includes(action.link_id)
                ? {...link, bookmark: WAITING}
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

const errorBookmarkLinkReducer = (action, state) => ({
    ...state
})



module.exports = {
    bookmarkLinkReducer
}