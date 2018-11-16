
import Model from './model';
import asyncMiddleware from './async-middleware';
import RootReducer from './root-reducer';
import { createStore, applyMiddleware } from 'redux';



let store = null;

export default (middlewareList) => {
  if (!store) {
    const ml = middlewareList.concat([asyncMiddleware]);

    const enchance = applyMiddleware(...ml);

    const initial = Model.getInitial();
    const rootReducer = RootReducer(Model);

    window.store = store = createStore(rootReducer, initial, enchance); // eslint-disable-line
  }

  return store
};
