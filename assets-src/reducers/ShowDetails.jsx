import {types} from 'actions'
import {OPEN, WAITING, CLOSED} from 'constants'
import {closeAll, closeAllExcept} from 'utilities'

const linkDetailsReducer = (action) => (state) =>
{
    switch(action.type)
    {
        case types.SHOW_LINK_DETAILS:   return showLinkDetailsReducer(action, state)
        case types.HIDE_LINK_DETAILS:   return hideLinkDetailsReducer(action, state)
        default: return {...state}
    }
}


const showLinkDetailsReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        add: CLOSED,
        items: state.links.items.map(link =>
            link.id === action.link_id
                ? {...link, status: closeAllExcept(link.status, 'details', OPEN)}
                : {...link, status: closeAll(link.status)}
        ),
    }
})


const hideLinkDetailsReducer = (action, state) => ({
    ...state,
    links: {
        ...state.links,
        items: state.links.items.map(link =>
            ({...link, status: closeAll(link.status)})
        ),
    }
})

module.exports = {
    linkDetailsReducer
}