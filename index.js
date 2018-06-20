import { createStore, applyMiddleware } from 'redux';
import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';

import * as Util from './src/util';
import asyncMiddleware from './src/async-middleware';
import Wrapper from './src/wrapper';
import Model from './src/model';
import RootReducer from './src/root-reducer';


let store = null;
const middlewareList = [asyncMiddleware(Model)];

const initStore = () => {
  if (!store) {
    const enchance = applyMiddleware(...middlewareList);
    const initial = Model.getInitial();
    const rootReducer = RootReducer(Model);

    window.store = store = createStore(rootReducer, initial, enchance); // eslint-disable-line
  }
};

const KOS = {
  Util,
  splitActionType: Util.getActionType,
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
  Wrapper: config => (Component) => {
    config.model = config.model || { namespace: [Symbol.iterator] }; // eslint-disable-line

    Model.add(config.model);

    const container = Wrapper(config)(Component);

    return container;
  },
  start(Layout, container = '#main') {
    initStore();

    ReactDOM.render((<Provider store={store}>
      <Layout />
    </Provider>), document.querySelector(container)); // eslint-disable-line
  },
};

export default KOS;
