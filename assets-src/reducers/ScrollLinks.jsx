import {types} from 'actions'
import {SCROLL_JUMP} from 'constants'

export const scrollLinksReducer = (action) => (state) =>
{
  switch(action.type)
  {
    case types.SCROLL_LINKS_BOTTOM:    return scrollBottomReducer(action, state)
    default: return {...state}
  }
}
    
const scrollBottomReducer = (action, state) =>  ({
  // Slide scroll window down
  ...state,
  nav: {
    ...state.nav,
    scrollCount: state.nav.scrollCount + SCROLL_JUMP >= state.links.items.length
      ? state.links.items.length
      : state.nav.scrollCount + SCROLL_JUMP
  }
})
