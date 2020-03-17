
/**
 * 包装dispatch
 * @param {function} dispatch dispath方法
 * @param {String} namespace 命名空间
 */
export const wrapperDispatch = (dispatch, namespace) => (action) => {
  const type = action.type.indexOf('/') > -1 ? action.type : `${namespace}/${action.type}`;

  return dispatch({
    ...action,
    type,
  });
};

/**
 * 获取参数，包括url后面的query和hashUrl后面的query
 */
export function getParam() {
  const query = {};
  let search = [];

  if (window.location.search) { // eslint-disable-line
    search = search.concat(window.location.search.slice(1).split('&')); // eslint-disable-line
  }
  // 解析hash后面的query
  if (window.location.hash.indexOf('?') > -1) { // eslint-disable-line
    const hashSearch = window.location.hash.split('?')[1].split('&'); // eslint-disable-line
    search = search.concat(hashSearch);
  }
  search.forEach((equation) => {
    const [key, value] = equation.split('=');
    try {
      if (value !== undefined) {
        query[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    } catch (error) {
      console.error(error.message || `Error happened when decodeURIComponent ${value}`)
    }
  });
  return query;
}

/**
 *
 * @param {Object} action action
 */
export function getActionType(actionType) {
  const [namespace, type] = actionType.split('/');
  if (!type) {
    return {
      namespace: null,
      type: namespace,
    };
  }
  return {
    namespace, type,
  };
}
