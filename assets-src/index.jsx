"use strict";

import style from 'scss/style.scss'
import React from 'react';
import ReactDOM from 'react-dom'
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger  from 'redux-logger'

import ContentApp from 'components/Apps/ContentApp'
import HeaderApp from 'components/Apps/HeaderApp'

import reducer from 'reducers'
import {setupState} from 'utilities'

const loggerMiddleware = createLogger()

const middleware = applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
)


// Assume we have bootstrapData available
console.log('Loading bootstrap data', bootstrapData)
let initialState = setupState(bootstrapData)
console.log('Setting up bootstrap data', bootstrapData)

const store  = createStore(reducer, initialState, middleware)

// Initial render.
ReactDOM.render(
    <Provider store={store}>
        <HeaderApp/>
    </Provider>, 
    document.getElementById('react-app-header')
)

// Initial render.
ReactDOM.render(
    <Provider store={store}>
        <ContentApp/>
    </Provider>, 
    document.getElementById('react-app-content')
)