import {types} from 'actions'

export const editLinkReducer = (action) => (state) =>
{
  switch(action.type)
  {
    case types.REQUEST_EDIT_LINK:    return requestEditLinkReducer(action, state)
    case types.RECEIVE_EDIT_LINK:    return receiveEditLinkReducer(action, state)
    case types.ERROR_EDIT_LINK:      return errorEditLinkReducer(action, state)
    default: return {...state}
  }
}

const requestEditLinkReducer = (action, state) => ({
  // Set edited link to 'updating'
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

const receiveEditLinkReducer = (action, state) => ({
  // Set edited link to 'not-updating'
  // Update link contents
  ...state,
  links: {
    ...state.links,
    items: state.links.items.map(link =>
      link.id === action.link.id
        ? {...link, ...(action.link), updating: false}
        : link
    ),
  }
})

const errorEditLinkReducer = (action, state) => ({
  // Set edited link to 'not-updating'
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
