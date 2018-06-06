import { SCROLL_JUMP } from 'constants'

const reducers = {
  REQUEST_SEARCH: (state, action) => mapSearch(state, action, search => ({
      items: search.items,
      updating: true
  })),
  RECEIVE_SEARCH: (state, action) => mapSearch(state, action, search => ({
      items: action.data.results,
      updating: false
  })),
  ERROR_SEARCH: (state, action) => mapSearch(state, action, search => ({
      items: [],
      updating: false
  })),
  SCROLL_LINKS_BOTTOM: (state, action) => ({
    // Slide scroll window down
    ...state,
    nav: {
      ...state.nav,
      scrollCount: state.nav.scrollCount + SCROLL_JUMP >= state.links.items.length
        ? state.links.items.length
        : state.nav.scrollCount + SCROLL_JUMP
    }
  }),
  REQUEST_LINKS: (state, action) => mapLinks(state, action, links => ({
    // Set link collection to 'updating' state
    ...links,
    updating: true
  })),
  RECEIVE_LINKS: (state, action) => mapLinks(state, action, links => ({
    // We are getting the first page of links back, which might contain some
    // data that we already have - so we merge the data in
    ...links,
    updating: false,
    items: mergeInLinks(links.items, action.links.results)
  })),
  RECEIVE_PAGED_LINKS: (state, action) => mapLinks(state, action, links => ({
    ...links,
    next: action.links.next,
    items: links.items.concat(action.links.results)
  })),
  ERROR_LINK_LIST: (state, action) => mapLinks(state, action, links => ({
    // Set link collection to 'not-updating' state
    ...links,
    updating: false
  })),
  RECEIVE_ADD_LINK: (state, action) => mapLinks(state, action, links => ({
    // Set link collection to 'not-updating' state
    ...links,
    items: [action.link, ...links.items],
    updating: false,
  })),
  REQUEST_LINK: (state, action) => mapLinks(state, action, links => ({
    // Set link to 'updating' state
    ...links,
    items: links.items.map(link =>
      link.id === action.link.id
        ? {...link, updating: true}
        : {...link}
    ),
  })),
  RECEIVE_EDIT_LINK: (state, action) => mapLinks(state, action, links => ({
    // Set edited link to 'not-updating' and update link contents
    ...links,
    items: links.items.map(link =>
      link.id === action.link.id
        ? {...link, ...(action.link), updating: false}
        : link
    ),
  })),
  ERROR_LINK_SPECIFIC: (state, action) => mapLinks(state, action, links => ({
    // Set specific link to 'not-updating'
    ...links,
    items: links.items.map(link =>
      link.id === action.link.id
        ? {...link, updating: false}
        : {...link}
    ),
  })),
  RECEIVE_DELETE_LINK: (state, action) => mapLinks(state, action, links => ({
    // Remove deleted link
    ...links,
    items: state.links.items.filter(link => link.id != action.link.id),
  })),
  REQUEST_BOOKMARK_LINK: (state, action) => ({
    // Set bookmarked link to 'updating'
    ...state,
    loggedInUser: {
      ...state.loggedInUser,
      bookmarks: setLinkUpdating(state.loggedInUser.bookmarks, action.link.id, true),
    },
    links: {
      ...state.links,
      items: setLinkUpdating(state.links.items, action.link.id, true),
    }
  }),
  RECEIVE_BOOKMARK_LINK: (state, action) => ({
    // Set bookmarked link to 'not-updating'
    // Update loggedInUser's bookmarks
    ...state,
    loggedInUser: action.user,
    links: {
      ...state.links,
      items: setLinkUpdating(state.links.items, action.link.id, false),
    }
  }),
  ERROR_BOOKMARK_LINK: (state, action) => ({
    // Set bookmarked link to 'not-updating'
    ...state,
    loggedInUser: {
      ...state.loggedInUser,
      bookmarks: setLinkUpdating(state.loggedInUser.bookmarks, action.link.id, false),
    },
    links: {
      ...state.links,
      items: setLinkUpdating(state.links.items, action.link.id, false),
    }
  }),
}



const mapLinks = (state, action, func) => ({
  ...state,
  links: func(state.links)
})

const mapSearch = (state, action, func) => ({
  ...state,
  search: func(state.search)
})

const setLinkUpdating = (links, link_id, is_updating) => links.map(link =>
  link.id === link_id ? {...link, updating: is_updating} : {...link}
)

const mergeInLinks = (currentLinks, newLinks) => {
  const currentIds = currentLinks.map(link => link.id)
  return newLinks
    .filter(link => !currentIds.includes(link.id))
    .concat(currentLinks)
}


module.exports =  (state, action) => {
  const func = reducers[action.type]
  if (!func) return {...state}
  return func(state, action)
}
