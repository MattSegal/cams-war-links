import {types} from 'actions'

export const getLinksReducer = (action) => (state) =>
{
  switch(action.type)
  {
    case types.REQUEST_LINKS:           return requestLinksReducer(action, state)
    case types.RECEIVE_LINKS:           return receiveLinksReducer(action, state)
    case types.ERROR_LINKS:             return errorLinksReducer(action, state)
    case types.RESET_LINKS_PAGINATION:  return resetLinksReducer(action, state)
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
    next: action.links.next,
    items: (state.links.next === state.links.start) 
      ? action.links.results
      : state.links.items.concat(action.links.results)
  }
})

resetLinksReducer

const resetLinksReducer = (action, state) => ({
  ...state,
  links: {
    ...state.links,
    next: state.links.start,
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