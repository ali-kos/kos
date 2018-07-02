import { wrapperDispatch, getActionType } from './util';
import Model from './model';


export default store => next => async (action) => {
  const { namespace, type } = getActionType(action.type);// action.type.split('/');
  const async = Model.getAsync(namespace, type);
  if (async) {
    const getState = () => store.getState()[namespace];
    const dispatch = wrapperDispatch(store.dispatch, namespace);

    await async(dispatch, getState, action);
  }
  next(action);
};
