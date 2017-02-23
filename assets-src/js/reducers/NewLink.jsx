import {types} from 'actions'

const requestNewLinkReducer = (action) => (state) => {
    switch(action.type)
    {
        default: return {...state}
    }
}

const receiveNewLinkReducer = (action) => (state) => {
    switch(action.type)
    {
        case types.RECEIVE_NEW_LINK:
        {
            return {
                ...state,
                links: {
                    ...state.links,
                    items: [
                        ...state.links.items,
                        action.link,
                    ]
                }
            }
        }
        default: return {...state}
    }
}

module.exports = {
    requestNewLinkReducer,
    receiveNewLinkReducer,
}