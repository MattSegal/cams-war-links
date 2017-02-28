import {NO_USER_SELECTED, OPEN, CLOSED} from 'constants'

// Lets us use pipe syntax eg. pipe(f,g,h)(x)
const _pipe = (f, g) => (...args) => g(f(...args))
const pipe = (...fns) => fns.reduce(_pipe)

const setupState = (state) => ({
    ...state,
    currentUser: state.currentUser ? state.currentUser : {id: NO_USER_SELECTED},
    links: setupLinkState(state.links),
    users: setupUserState(state.users),
})

const setupLinkState = (links) => ({
    ...links,
    add: CLOSED,
    items: links.items.map(link =>
        ({...link, status: {edit: CLOSED, delete: CLOSED, details: CLOSED}})
    ),
})

const setupUserState = (users) => ({
    ...users,
    activeUserId: NO_USER_SELECTED,
})


module.exports = {
    pipe,
    setupState,
}