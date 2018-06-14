import { wrapperDispatch, getActionType } from './util';

export default (Model) => (store) => next => async action => {
  const { namespace, type } = getActionType(action.type);// action.type.split('/');
  const async = Model.getAsync(namespace, type);
  if (async) {
    const getState = () => {
      return store.getState()[namespace];
    }
    const dispatch = wrapperDispatch(store.dispatch, namespace);

    await async(dispatch, getState, action);
  }
  next(action);
}
