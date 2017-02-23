import {types} from 'actions'
import {NO_USER_SELECTED} from 'constants'

const activeUserReducer = (action) => (state) => {
    switch(action.type)
    {
        case types.SET_ACTIVE_USER:
        {
            let isSelectedUserAlreadyActive = state.users.activeUserId 
                ? state.users.activeUserId === action.user_id
                : false

            let activeUserId = isSelectedUserAlreadyActive ? NO_USER_SELECTED : action.user_id
            return {
                ...state,
                users: {
                    ...state.users,
                    activeUserId: activeUserId
                }
            }
        }
        default: return {...state}
    }
}

module.exports = {
    activeUserReducer
}