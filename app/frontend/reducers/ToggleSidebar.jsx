import {types} from 'actions'
import {setupLinkState} from 'utilities'

export const toggleSidebarReducer = (action) => (state) =>
{
  switch(action.type)
  {
    case types.TOGGLE_SIDEBAR:    
      return {
        ...state,
        nav: {
          ...state.nav,
          sidebar: !state.nav.sidebar,
        }
      }
    default: return {...state}
  }
}
