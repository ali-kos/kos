'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactRedux = require('react-redux');
var PropTypes = _interopDefault(require('prop-types'));
var redux = require('redux');
var ReactDOM = _interopDefault(require('react-dom'));

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/**
 * 包装dispatch
 * @param {function} dispatch dispath方法
 * @param {String} namespace 命名空间
 */
var wrapperDispatch = function wrapperDispatch(dispatch, namespace) {
  return function (action) {
    var type = action.type.indexOf('/') > -1 ? action.type : namespace + '/' + action.type;

    dispatch(_extends({}, action, {
      type: type
    }));
  };
};

/**
 * 获取参数，包括url后面的query和hashUrl后面的query
 */
function getParam() {
  var query = {};
  var search = [];

  if (window.location.search) {
    // eslint-disable-line
    search = search.concat(window.location.search.slice(1).split('&')); // eslint-disable-line
  }
  // 解析hash后面的query
  if (window.location.hash.indexOf('?') > -1) {
    // eslint-disable-line
    var hashSearch = window.location.hash.split('?')[1].split('&'); // eslint-disable-line
    search = search.concat(hashSearch);
  }
  search.forEach(function (equation) {
    var _equation$split = equation.split('='),
        _equation$split2 = slicedToArray(_equation$split, 2),
        key = _equation$split2[0],
        value = _equation$split2[1];

    if (value !== undefined) {
      query[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });
  return query;
}

/**
 *
 * @param {Object} action action
 */
function getActionType(actionType) {
  var _actionType$split = actionType.split('/'),
      _actionType$split2 = slicedToArray(_actionType$split, 2),
      namespace = _actionType$split2[0],
      type = _actionType$split2[1];

  if (!type) {
    return {
      namespace: null,
      type: namespace
    };
  }
  return {
    namespace: namespace, type: type
  };
}

var Util = /*#__PURE__*/Object.freeze({
  wrapperDispatch: wrapperDispatch,
  getParam: getParam,
  getActionType: getActionType
});

var _this = undefined;

var asyncMiddleware = (function (Model) {
  return function (store) {
    return function (next) {
      return function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(action) {
          var _getActionType, namespace, type, async, getState, dispatch;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _getActionType = getActionType(action.type), namespace = _getActionType.namespace, type = _getActionType.type; // action.type.split('/');

                  async = Model.getAsync(namespace, type);

                  if (!async) {
                    _context.next = 7;
                    break;
                  }

                  getState = function getState() {
                    return store.getState()[namespace];
                  };

                  dispatch = wrapperDispatch(store.dispatch, namespace);
                  _context.next = 7;
                  return async(dispatch, getState, action);

                case 7:
                  next(action);

                case 8:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }();
    };
  };
});

var func = PropTypes.func;


var createWrapperComponent = function createWrapperComponent(config) {
  return function (Component) {
    var _config$model = config.model,
        model = _config$model === undefined ? {} : _config$model,
        _config$autoLoad = config.autoLoad,
        autoLoad = _config$autoLoad === undefined ? true : _config$autoLoad;
    var namespace = model.namespace,
        initial = model.initial;


    var WrapperComponent = function (_PureComponent) {
      inherits(WrapperComponent, _PureComponent);

      function WrapperComponent(props) {
        classCallCheck(this, WrapperComponent);

        var _this = possibleConstructorReturn(this, (WrapperComponent.__proto__ || Object.getPrototypeOf(WrapperComponent)).call(this, props));

        _this.namespace = namespace;
        return _this;
      }

      createClass(WrapperComponent, [{
        key: 'getChildContext',
        value: function getChildContext() {
          var _this2 = this;

          return {
            dispatch: this.dispatch.bind(this),
            getNamespace: function getNamespace() {
              return _this2.namespace;
            },
            getState: function getState() {
              return _this2.props;
            }
          };
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.resetData();
        }
      }, {
        key: 'getParam',
        value: function getParam$$1() {
          var param = getParam();

          if (this.props.match && this.props.match.params) {
            // eslint-disable-line
            return _extends({}, param, this.props.match.params);
          }
          return param;
        }
      }, {
        key: 'dispatch',
        value: function dispatch(action) {
          wrapperDispatch(this.props.dispatch, this.namespace)(action); // eslint-disable-line
        }
      }, {
        key: 'resetData',
        value: function resetData() {
          this.dispatch({
            type: 'reset',
            payload: _extends({}, initial)
          });
          if (autoLoad) {
            this.dispatch({
              type: 'setup',
              payload: {
                param: this.getParam()
              }
            });
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var _this3 = this;

          return React__default.createElement(Component, _extends({}, this.props, {
            dispatch: wrapperDispatch(this.props.dispatch, this.namespace),
            getParam: function getParam$$1() {
              return _this3.getParam();
            }
          }));
        }
      }]);
      return WrapperComponent;
    }(React.PureComponent);

    WrapperComponent.childContextTypes = {
      dispatch: func,
      getState: func,
      getNamespace: func
    };

    return WrapperComponent;
  };
};

var createContainerComponent = function createContainerComponent(config) {
  return function (Component) {
    // 容器component
    var WrapperComponent = createWrapperComponent(config)(Component);

    var _config$model2 = config.model,
        model = _config$model2 === undefined ? {} : _config$model2;
    var namespace = model.namespace;


    var mapStateToProps = function mapStateToProps(state) {
      return state[namespace] || {};
    };

    // app component
    return reactRedux.connect(mapStateToProps)(WrapperComponent);
  };
};

var _Wrapper = (function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (Component) {
    return createContainerComponent(config)(Component);
  };
});

var DefaultReducers = {
  setState: function setState(state, action) {
    var payload = action.payload;


    if (!payload) {
      payload = _extends({}, action);
      delete payload.type;
    }

    return _extends({}, state, payload);
  },
  reset: function reset(state, action) {
    return _extends({}, action.payload);
  }
};

var Model = function () {
  function Model(model) {
    classCallCheck(this, Model);
    var namespace = model.namespace,
        asyncs = model.asyncs,
        reducers = model.reducers,
        setup = model.setup;

    this.namespace = namespace;
    Object.assign(model, {
      asyncs: _extends({
        setup: setup
      }, asyncs),
      reducers: _extends({}, DefaultReducers, reducers)
    });

    this.model = model;
  }

  createClass(Model, [{
    key: 'getNamespace',
    value: function getNamespace() {
      return this.namespace;
    }
  }, {
    key: 'getAsync',
    value: function getAsync(type) {
      return this.model.asyncs[type];
    }
  }, {
    key: 'getReducer',
    value: function getReducer(type) {
      return this.model.reducers[type];
    }
  }, {
    key: 'getInitial',
    value: function getInitial() {
      return this.model.initial;
    }
  }, {
    key: 'getAttr',
    value: function getAttr(attrName) {
      return this.model[attrName];
    }
  }, {
    key: 'getSetup',
    value: function getSetup() {
      return this.model.setup;
    }
  }]);
  return Model;
}();

var createModelFactory = function createModelFactory(model) {
  var namespace = model.namespace;


  if (!namespace) {
    console.error('namespace is undefined!', model); // eslint-disable-line
    throw new Error('namespace is undefined!');
  }
  map[namespace] = new Model(model); // eslint-disable-line
};

var map = {};
Object.assign(Model, {
  add: function add(model) {
    model = createModelFactory(model); // eslint-disable-line

    return model;
  },
  del: function del(namespace) {
    delete map[namespace];
  },
  get: function get$$1(namespace) {
    return map[namespace];
  },
  getInitial: function getInitial() {
    var initial = {};

    this.each(function (namespace, model) {
      initial[namespace] = model.getInitial();
    });

    return initial;
  },
  each: function each(callback) {
    for (var namespace in map) {
      // eslint-disable-line
      callback(namespace, map[namespace]);
    }
  },
  getReducer: function getReducer(namespace, type) {
    var model = this.get(namespace);
    return model ? model.getReducer(type) : null;
  },
  getAsync: function getAsync(namespace, type) {
    var model = this.get(namespace);
    return model ? model.getAsync(type) : null;
  },
  getSetup: function getSetup(namespace) {
    var model = this.get(namespace);

    return model && model.setup;
  }
});

var RootReducer = (function (Model) {
  return function (state, action) {
    var _action$type$split = action.type.split('/'),
        _action$type$split2 = slicedToArray(_action$type$split, 2),
        namespace = _action$type$split2[0],
        type = _action$type$split2[1];

    var modelState = state[namespace] || {};
    var newState = _extends({}, state);

    var reducer = Model.getReducer(namespace, type);

    if (reducer) {
      var modelNewState = reducer(modelState, action);

      if (modelNewState && modelNewState !== modelState) {
        newState[namespace] = modelNewState;
      } else {
        throw new Error('reducer must be return new state.', state, action);
      }
    }

    return newState;
  };
});

var store = null;
var middlewareList = [asyncMiddleware(Model)];

var initStore = function initStore() {
  if (!store) {
    var enchance = redux.applyMiddleware.apply(undefined, middlewareList);
    var initial = Model.getInitial();
    var rootReducer = RootReducer(Model);

    window.store = store = redux.createStore(rootReducer, initial, enchance); // eslint-disable-line
  }
};

var KOS = {
  Util: Util,
  splitActionType: getActionType,
  registeModel: function registeModel(model) {
    return Model.add(model);
  },
  removeModel: function removeModel(namespace) {
    Model.del(namespace);
  },
  getModel: function getModel(namespace) {
    return Model.get(namespace);
  },
  use: function use(middleware) {
    middlewareList.unshift(middleware);
  },

  Wrapper: function Wrapper(config) {
    return function (Component) {
      config.model = config.model || { namespace: [Symbol.iterator] }; // eslint-disable-line

      Model.add(config.model);

      var container = _Wrapper(config)(Component);

      return container;
    };
  },
  start: function start(Layout) {
    var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#main';

    initStore();

    ReactDOM.render(React__default.createElement(
      reactRedux.Provider,
      { store: store },
      React__default.createElement(Layout, null)
    ), document.querySelector(container)); // eslint-disable-line
  }
};

module.exports = KOS;
