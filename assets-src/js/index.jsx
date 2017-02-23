"use strict";

import React from 'react';
import ReactDOM from 'react-dom'
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger  from 'redux-logger'

import App from 'components/App'
import reducer from 'reducers'

const loggerMiddleware = createLogger()

const middleware = applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
)


// // hack
// import {CLOSED} from 'constants'
// bootstrapData.links.items = bootstrapData.links.items.map(link =>
//     ({...link, status: {delete: CLOSED, edit: CLOSED}})
// )
// Assume we have loaded bootstrapData
console.log('Loading bootstrap data', bootstrapData)

const store  = createStore(reducer, bootstrapData, middleware)

// Initial render.
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, 
    document.getElementById('react-app')
)