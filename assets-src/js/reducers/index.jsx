import {types} from 'actions'

const activeUserReducer = (action) => (state) => {
    switch(action.type)
    {
        case types.SET_ACTIVE_USER:
        {
            let isSelectedUserAlreadyActive = state.users.activeUserId 
                ? state.users.activeUserId === action.user_id
                : false

            let activeUserId = isSelectedUserAlreadyActive ? -1 : action.user_id
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


const requestLinksReducer = (action) => (state) => {
    switch(action.type)
    {
        case types.REQUEST_LINKS: return {
            ...state,
            links: {
                ...state.links,
                isFetching: true,
            }
        }
        default: return {...state}
    }
}


const receiveLinksReducer = (action) => (state) => {
    switch(action.type)
    {
        case types.RECEIVE_LINKS:
        {
            return {
                ...state,
                links: {
                    items: action.links,
                    isFetching: false,
                }
            }
        }
        default: return {...state}
    }
}


// Lets us use pipe syntax eg. pipe(f,g,h)(x)
const _pipe = (f, g) => (...args) => g(f(...args))
const pipe = (...fns) => fns.reduce(_pipe)

const reducer = (state,action) =>
    pipe(
        receiveLinksReducer(action),
        requestLinksReducer(action),
        activeUserReducer(action)
    )(state)


module.exports = reducer