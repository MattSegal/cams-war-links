"use strict";

import style from 'scss/style.scss'
import React from 'react';
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter, Link} from 'react-router-dom'

import { store } from 'state'
import Content from 'components/Content'
import HeaderContainer from 'containers/HeaderContainer'
import ScrollFooter from 'components/ScrollFooter'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <HeaderContainer/>
        <div className="headerSpacer" />
        <div className="contentWrapper">
          <Content/>
        </div>
        <ScrollFooter />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('react-app-root')
)
