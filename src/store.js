
import Model from './model';
import asyncMiddleware from './async-middleware';
import RootReducer from './root-reducer';
import { createStore, applyMiddleware, compose } from 'redux';



let store = null;

export default (middlewareList) => {
  if (!store) {
    const ml = [...middlewareList, asyncMiddleware];

    const enchance = applyMiddleware(...ml);

    const initial = Model.getInitial();
    const rootReducer = RootReducer(Model);

    if (!window.__REDUX_DEVTOOLS_EXTENSION__) {
      window.store = store = createStore(rootReducer, initial, enchance); // eslint-disable-line
    } else {
      window.store = store = createStore(rootReducer, initial, // eslint-disable-line
        compose(enchance, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())); // eslint-disable-line
    }
  }

  return store
};
