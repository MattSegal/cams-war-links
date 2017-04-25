import {types} from 'actions'

export const deleteLinkReducer = (action) => (state) =>
{
  switch(action.type)
  {
    case types.REQUEST_DELETE_LINK:    return requestDeleteLinkReducer(action, state)
    case types.RECEIVE_DELETE_LINK:    return receiveDeleteLinkReducer(action, state)
    case types.ERROR_DELETE_LINK:      return errorDeleteLinkReducer(action, state)
    default: return {...state}
  }
}

const requestDeleteLinkReducer = (action, state) => ({
  // Set deleted link to 'updating'
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
        
const receiveDeleteLinkReducer = (action, state) => ({
  // Remove deleted link
  ...state,
  links: {
    ...state.links,
    items: state.links.items.filter(link =>
      link.id != action.link_id
    ),
  }
})

const errorDeleteLinkReducer = (action, state) => ({
  // Set deleted link to 'not-updating'
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
