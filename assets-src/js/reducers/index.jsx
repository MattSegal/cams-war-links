import {combineReducers} from 'redux'

const activeUserReducer = (users = [], action) => {
    let isActive = user => user.isActive ? false : user.name === action.username
    return users.map(user => ({
        ...user,
        isActive: isActive(user)
    }))
}

const activeUserLinkReducer  = (links = [], action) => {
    let isActive = link => link.isActive ? false : link.user === action.username
    return links.map(link => ({
        ...link,
        isActive: isActive(link)
    }))
}

// Reducers take state, action 
const reducer = (state,action) =>
{
     switch(action.type)
     {
        case 'SET_ACTIVE_USER': return {
            users: activeUserReducer(state.users, action),
            links: activeUserLinkReducer(state.links, action),
        }
        default: return {...state}
     }
}

module.exports = reducer