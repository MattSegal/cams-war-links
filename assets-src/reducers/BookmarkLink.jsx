import {types} from 'actions'

export const bookmarkLinkReducer = (action) => (state) =>
{
  switch(action.type)
  {
    case types.REQUEST_BOOKMARK_LINK:    return requestBookmarkLinkReducer(action, state)
    case types.RECEIVE_BOOKMARK_LINK:    return receiveBookmarkLinkReducer(action, state)
    case types.ERROR_BOOKMARK_LINK:      return errorBookmarkLinkReducer(action, state)
    default: return {...state}
  }
}

const setLinkUpdating = (links, link_id, is_updating) => links.map(link =>
    link.id === link_id ? {...link, updating: is_updating} : {...link}
  )

const requestBookmarkLinkReducer = (action, state) => ({
  // Set bookmarked link to 'updating'
  ...state,
  loggedInUser: {
    ...state.loggedInUser,
    bookmarks: setLinkUpdating(state.loggedInUser.bookmarks, action.link_id, true),
  },
  links: {
    ...state.links,
    items: setLinkUpdating(state.links.items, action.link_id, true),
  }
})

const receiveBookmarkLinkReducer = (action, state) => ({
  // Set bookmarked link to 'not-updating'
  // Update loggedInUser's bookmarks
  ...state,
  loggedInUser: action.user,
  links: {
    ...state.links,
    items: setLinkUpdating(state.links.items, action.link_id, false),
  }
})

const errorBookmarkLinkReducer = (action, state) => ({
  // Set bookmarked link to 'not-updating'
  ...state,
  loggedInUser: {
    ...state.loggedInUser,
    bookmarks: setLinkUpdating(state.loggedInUser.bookmarks, action.link_id, false),
  },
  links: {
    ...state.links,
    items: setLinkUpdating(state.links.items, action.link_id, false),
  }
})
