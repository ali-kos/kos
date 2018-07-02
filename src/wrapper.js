import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { wrapperDispatch, getParam } from './util';
import Model from './model';

const { func } = PropTypes;

const Wrapper = config => (Component) => {
  const { model = {}, autoLoad = true, namespace } = config;
  const WrapperComponent = class extends PureComponent {
    constructor(props) {
      super(props);

      this.autoLoad = props.autoLoad === false ? false : autoLoad;
      this.namespace = props.namespace || namespace || model.namespace;

      this.model = Model.add({
        ...config.model,
        namespace: this.namespace
      });
      this.dispatch = wrapperDispatch(props.dispatch, this.namespace);
    }
    getChildContext() {
      return {
        getNamespace: () => this.namespace,
        dispatch: this.dispatch.bind(this),
        getState: () => this.getState.bind(this)
      };
    }
    getState() {
      return Store().getState()[this.namespace];
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
    resetData() {
      const model = Model.get(this.namespace);

      this.dispatch({
        type: 'reset',
        payload: {
          ...model.getInitial(),
        },
      });

      if (this.autoLoad) {
        this.dispatch({
          type: 'setup',
          payload: {
            param: this.getParam(),
          },
        });
      }
    }
    componentDidMount() {
      this.resetData();
    }
    render() {
      const { ViewComponent } = this;

      return (<Component
        {...this.props}
        dispatch={this.dispatch}
        getParam={() => this.getParam()}
        getNamespace={() => this.namespace}
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


export default config => Component => {
  const WrapperComponent = Wrapper(config)(Component);
  const { model } = config;
  Model.add(model);

  const { namespace = '' } = model;
  const mapStateToProps = state => state[namespace] || {};
  return connect(mapStateToProps)(WrapperComponent);
};
