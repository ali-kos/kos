import React, { PureComponent } from 'react';
import { connect, Provider } from 'react-redux';
import { wrapperDispatch, getParam } from './util';
import PropTypes from 'prop-types';


const createWrapperComponent = (config) => (Component) => {
  const { model = {}, autoLoad = true } = config;
  const { namespace, initial } = model;

  const WrapperComponent = class extends PureComponent {
    constructor(props) {
      super(props);
      this.namespace = namespace;
    }
    getParam() {
      const param = getParam();

      if (this.props.match && this.props.match.params) {
        return {
          ...param,
          ...this.props.match.params,
        };
      }
      return param;
    }
    dispatch(action) {
      wrapperDispatch(this.props.dispatch, this.namespace)(action);
    }
    componentDidMount() {
      this.resetData();
    }
    resetData() {
      this.dispatch({
        type: 'reset',
        payload: {
          ...initial
        }
      });
      autoLoad && this.dispatch({
        type: 'setup',
        payload: {
          param: this.getParam()
        }
      })
    }
    getChildContext() {
      return {
        dispatch: this.dispatch.bind(this),
        getNamespace: () => {
          return this.namespace;
        },
        getState: () => {
          return this.props;
        }
      }
    }
    render() {
      const { dispatch } = this.props;

      return <Component {...this.props}
        dispatch={wrapperDispatch(this.props.dispatch, this.namespace)}
        getParam={() => { return this.getParam() }} />
    }
  }

  WrapperComponent.childContextTypes = {
    dispatch: PropTypes.func,
    getState: PropTypes.func,
    getNamespace: PropTypes.func
  };

  return WrapperComponent;
};

const createContainerComponent = (config) => (Component) => {
  // 容器component
  const WrapperComponent = createWrapperComponent(config)(Component);

  const { model = {}, autoLoad = true } = config;
  const { namespace, initial } = model;

  const mapStateToProps = (state) => {
    return state[namespace] || {};
  }

  // app component
  return connect(mapStateToProps)(WrapperComponent);
}



export default (config = {}) => (Component) => {
  return createContainerComponent(config)(Component);
};
