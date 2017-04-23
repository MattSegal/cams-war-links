import {types} from 'actions'

export const getLinksReducer = (action) => (state) =>
{
  switch(action.type)
  {
    case types.REQUEST_LINKS:     return requestLinksReducer(action, state)
    case types.RECEIVE_LINKS:     return receiveLinksReducer(action, state)
    case types.ERROR_LINKS:       return errorLinksReducer(action, state)
    default:                      return {...state}
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
    items: (
      action.links 
        ? action.links
        : state.links.items
    ),
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