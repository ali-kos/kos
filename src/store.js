
import Model from './model';
import asyncMiddleware from './async-middleware';
import RootReducer from './root-reducer';
import { createStore, applyMiddleware } from 'redux';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


let store = null;

export default (middlewareList) => {
  if (!store) {
    const ml = [...middlewareList, asyncMiddleware];

    const enchance = applyMiddleware(...ml);

    const initial = Model.getInitial();
    const rootReducer = RootReducer(Model);

    window.store = store = createStore(rootReducer, initial, composeEnhancers(enchance)); // eslint-disable-line
  }

  return store
};
