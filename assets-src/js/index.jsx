"use strict";

import React from 'react';
import ReactDOM from 'react-dom'
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'

// logger from redux-logger
// axios from axios
// thunk from redux-thunk https://www.youtube.com/watch?v=Td-2D-_7Y2E#t=538.370979

import App from 'components/App'
import reducer from 'reducers'

const logger = (store) => (next) => (action) => {
    console.log("action fired", action)
    next(action)
}

const middleware = applyMiddleware(logger)

// Assume we have loaded bootstrapData
console.log('loading bootstrap data', bootstrapData)
const store  = createStore(reducer, bootstrapData, middleware)

// Add logging to store state changes
store.subscribe(() => {
    console.log("store changed",store.getState())
})


// Initial render.
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, 
    document.getElementById('react-app')
)