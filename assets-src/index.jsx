"use strict";

import style from 'scss/style.scss'
import React from 'react';
import ReactDOM from 'react-dom'
import {applyMiddleware, createStore} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger  from 'redux-logger'
import {BrowserRouter, Link} from 'react-router-dom'
import initialiseState from 'init'

import reducer from 'reducers'
import {setupState} from 'utilities'
import Content from 'components/Content'
import HeaderContainer from 'containers/HeaderContainer'
import ScrollFooter from 'components/ScrollFooter'
import SideNavContainer from 'containers/SideNavContainer'


// Middleware
const loggerMiddleware = createLogger()

const middleware = applyMiddleware(
    thunkMiddleware,
    loggerMiddleware,
)

// Store - assume we have bootstrapData available
console.log('Loading bootstrap data', bootstrapData)
let initialState = initialiseState(bootstrapData)
console.log('Set up bootstrap data', bootstrapData)
const store  = createStore(reducer, initialState, middleware)


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <HeaderContainer/>
        <div className="headerSpacer" />
        <div className="contentWrapper">
          <Content/>
        </div>
        <SideNavContainer />
        <ScrollFooter />
      </div>
    </BrowserRouter>
  </Provider>, 
  document.getElementById('react-app-root')
)