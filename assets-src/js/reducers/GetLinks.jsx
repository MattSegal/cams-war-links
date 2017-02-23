import {types} from 'actions'

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

module.exports = {
    requestLinksReducer,
    receiveLinksReducer,
}