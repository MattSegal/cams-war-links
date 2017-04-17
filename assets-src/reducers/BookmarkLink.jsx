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

const requestBookmarkLinkReducer = (action, state) => ({
  // Set bookmarked link to 'updating'
  ...state,
  links: {
    ...state.links,
    items: state.links.items.map(link =>
      link.id === action.link_id
        ? {...link, updating: true}
        : {...link}
    ),
  }
})

const receiveBookmarkLinkReducer = (action, state) => ({
  // Set bookmarked link to 'not-updating'
  // Update user + loggedInUs
  ...state,
  users: {
    ...(state.users),
    items: state.users.items.map(user =>
      user.id === action.user.id
        ? {...user, bookmarks: action.user.bookmarks}
        : {...user}
    ),
  },
  loggedInUser: {
    ...(state.loggedInUser),
    bookmarks: action.user.bookmarks,
  },
  links: {
    ...state.links,
    items: state.links.items.map(link =>
      link.id === action.link.id
        ? {...link, updating: false}
        : {...link}
    ),
  }
})

const errorBookmarkLinkReducer = (action, state) => ({
  // Set bookmarked link to 'not-updating'
  ...state,
  links: {
    ...state.links,
    items: state.links.items.map(link =>
      link.id === action.link_id
        ? {...link, updating: false}
        : {...link}
    ),
  }
})
