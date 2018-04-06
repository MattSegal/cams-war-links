import {types} from 'actions'

export const getLinksReducer = (action) => (state) =>
{
  switch(action.type)
  {
    case types.REQUEST_LINKS:           return requestLinksReducer(action, state)
    case types.RECEIVE_LINKS:           return receiveLinksReducer(action, state)
    case types.ERROR_LINKS:             return errorLinksReducer(action, state)
    case types.RECEIVE_PAGED_LINKS:     return pagedLinksReducer(action, state)
    default:                            return {...state}
  }
}

const requestLinksReducer = (action, state) => ({
  // Set link collection to 'updating' state
  ...state,
  links: {
    ...state.links,
    updating: true,
  }
})

const receiveLinksReducer = (action, state) => ({
  ...state,
  links: {
    ...state.links,
    updating: false,
    // We are getting the first page of links back, which might contain some
    // data that we already have - so we merge the data in
    items: mergeInLinks(state.links.items, action.links.results)
  }
})

const pagedLinksReducer = (action, state) => ({
  ...state,
  links: {
    ...state.links,
    next: action.links.next,
    items: state.links.items.concat(action.links.results)
  }
})

const errorLinksReducer = (action, state) => ({
  // Set link collection to 'not-updating' state
  ...state,
  links: {
    ...state.links,
    updating: false,
  }
})

const mergeInLinks = (currentLinks, newLinks) => {
  const currentIds = currentLinks.map(link => link.id)
  return newLinks
    .filter(link => !currentIds.includes(link.id))
    .concat(currentLinks)
}
