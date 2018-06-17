import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { wrapperDispatch, getParam } from './util';

const { func } = PropTypes;

const createWrapperComponent = config => (Component) => {
  const { model = {}, autoLoad = true } = config;
  const { namespace, initial } = model;

  const WrapperComponent = class extends PureComponent {
    constructor(props) {
      super(props);
      this.namespace = namespace;
    }
    getChildContext() {
      return {
        dispatch: this.dispatch.bind(this),
        getNamespace: () => this.namespace,
        getState: () => this.props,
      };
    }
    componentDidMount() {
      this.resetData();
    }
    getParam() {
      const param = getParam();

      if (this.props.match && this.props.match.params) { // eslint-disable-line
        return {
          ...param,
          ...this.props.match.params,
        };
      }
      return param;
    }
    dispatch(action) {
      wrapperDispatch(this.props.dispatch, this.namespace)(action); // eslint-disable-line
    }
    resetData() {
      this.dispatch({
        type: 'reset',
        payload: {
          ...initial,
        },
      });
      if (autoLoad) {
        this.dispatch({
          type: 'setup',
          payload: {
            param: this.getParam(),
          },
        });
      }
    }
    render() {
      return (<Component
        {...this.props}
        dispatch={wrapperDispatch(this.props.dispatch, this.namespace)}
        getParam={() => this.getParam()}
      />);
    }
  };

  WrapperComponent.childContextTypes = {
    dispatch: func,
    getState: func,
    getNamespace: func,
  };

  return WrapperComponent;
};

const createContainerComponent = config => (Component) => {
  // 容器component
  const WrapperComponent = createWrapperComponent(config)(Component);

  const { model = {} } = config;
  const { namespace } = model;

  const mapStateToProps = state => state[namespace] || {};

  // app component
  return connect(mapStateToProps)(WrapperComponent);
};


export default (config = {}) => Component => createContainerComponent(config)(Component);
