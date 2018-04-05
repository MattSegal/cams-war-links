import {types} from 'actions'
import {NO_USER_SELECTED, CLOSED, SCROLL_COUNT_INITIAL} from 'constants'


export const activeUserReducer = (action) => (state) =>
{
  switch(action.type)
  {
    case types.SET_ACTIVE_USER:   return setActiveUserReducer(action, state)
    default:                      return {...state}
  }
}

const setActiveUserReducer = (action, state) => ({
  ...state,
  users: {
    ...state.users,
    activeUserId: state.users.activeUserId === action.user_id
      ? NO_USER_SELECTED
      : action.user_id
  },
  nav: {
    ...state.nav,
    scrollCount: SCROLL_COUNT_INITIAL,
  }
})
