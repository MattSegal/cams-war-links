/*
    State Tree

    store {
        search {
            items: [link]
            updating: bool,
        }
        links {
            items: [link]
            updating: bool
        }
        loggedInUser: {
            id: int
            username: string
            bookmarks: [int]
        }
        nav {
            scrollCount: int
        }
    }

    link {
        id: int
        created: string
        description: string
        title: string
        url: string
        username: string
        updating: bool
    }
*/
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger  from 'redux-logger'

import {SCROLL_COUNT_INITIAL} from 'constants'
import reducer from './reducer'
import actions from './actions'

const loggerMiddleware = createLogger()
const middleware = applyMiddleware(thunkMiddleware, loggerMiddleware)

const initialiseState = bootstrap => ({
  loggedInUser: bootstrap.loggedInUser,
  nav: {scrollCount: SCROLL_COUNT_INITIAL},
  search: {
    items: [],
    updating: false,
  },
  links: {
    ...(bootstrap.links),
    updating: false,
    items: bootstrap.links.items.map(link => ({
      ...link,
      updating: false,
    })),
  },
})

// Store - assume we have bootstrapData available
console.log('Loading bootstrap data', bootstrapData)
const initialState = initialiseState(bootstrapData)
console.log('Set up initial state', initialState)
const store = createStore(reducer, initialState, middleware)
module.exports = { store, actions }
