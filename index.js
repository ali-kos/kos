// import { createStore, applyMiddleware } from 'redux';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

import * as Util from './src/util';
// import asyncMiddleware from './src/async-middleware';
import Wrapper from './src/wrapper';
import Model from './src/model';
// import RootReducer from './src/root-reducer';

import Store from './src/store';

const middlewareList = [];
const KOS = {
  Util,
  registeModel: model => Model.add(model),
  removeModel(namespace) {
    Model.del(namespace);
  },
  getModel(namespace) {
    return Model.get(namespace);
  },
  use(middleware) {
    middlewareList.unshift(middleware);
  },
  
  Wrapper: Wrapper,

  start(Layout, container = '#main') {
    Store(middlewareList);

    ReactDOM.render((<Provider store={store}>
      <Layout />
    </Provider>), document.querySelector(container)); // eslint-disable-line
  },
};

export default KOS;
