export default (Model) => (state, action) => {
  const [namespace, type] = action.type.split('/');
  const modelState = state[namespace] || {};
  const newState = { ...state };

  const reducer = Model.getReducer(namespace, type);

  if (reducer) {
    const modelNewState = reducer(modelState, action);

    if (modelNewState && modelNewState !== modelState) {
      newState[namespace] = modelNewState;
    } else {
      throw new Error('reducer must be return new state.', state, action);
    }
  }

  return newState
}
