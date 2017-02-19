"use strict";

import React from 'react';
import ReactDOM from 'react-dom'
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk' // https://www.youtube.com/watch?v=Td-2D-_7Y2E#t=538.370979
import createLogger  from 'redux-logger'

import App from 'components/App'
import reducer from 'reducers'

const loggerMiddleware = createLogger()

const middleware = applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
)

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