import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { wrapperDispatch, getParam } from './util';
import Model from './model';
import Store from './store';

const { func } = PropTypes;

const Wrapper = config => (Component) => {
  const { model = {}, autoLoad = true, namespace } = config;
  const WrapperComponent = class extends PureComponent {
    constructor(props) {
      // const _namespace = props.namespace || namespace;

      // Model.add({
      //   namespace,
      //   ...model
      // });

      // if (_namespace !== namespace) {
      //   props = Store().getState()[_namespace] || {};
      // }
      super(props);

      this.namespace = props.namespace || namespace;;
      this.autoLoad = props.autoLoad === false ? false : autoLoad;

      this.model = Model.add({
        ...config.model,
        namespace: this.namespace
      });

      this.dispatch = wrapperDispatch(props.dispatch, this.namespace);

    }
    dispatch(action) {
      const { dispatch } = this.props;
      return wrapperDispatch(dispatch, this.namespace)(action);
    }
    getChildContext() {
      return {
        getNamespace: () => this.namespace,
        dispatch: this.dispatch.bind(this),
        getState: () => this.props
      };
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
  const { model } = config;
  config.namespace = config.namespace || model.namespace;

  Model.add({
    ...model,
    namespace: config.namespace
  });


  return class WrapperConnect extends React.PureComponent {
    constructor(props) {
      super(props);
      const namespace = props.namespace || config.namespace || model.namespace;
      if (namespace !== config.namespace) {
        Model.add({
          ...model,
          namespace
        });
      }

      const WrapperComponent = Wrapper({
        ...config,
        namespace
      })(Component);

      const mapStateToProps = state => state[namespace] || {}
      this.WrapperContainer = connect(mapStateToProps)(WrapperComponent);
    }
    render() {
      const { WrapperContainer } = this;

      return (<WrapperContainer {...this.props}/>);
    }
  };
};
