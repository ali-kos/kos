import React, { PureComponent } from "react";
import { connect, Provider } from "react-redux";
import PropTypes from "prop-types";
import { wrapperDispatch, getParam } from "./util";
import Model from "./model";

const { func } = PropTypes;

const NoNamespaceStateKey = "@@no-namespace-state-key";

const Wrapper = config => Component => {
  const {
    model = {},
    autoLoad = true,
    autoReset = true,
    namespace,
    WrapperProps // 用于扩展Component的Props
  } = config;

  const WrapperComponent = class extends PureComponent {
    constructor(props) {
      super(props);

      this.namespace = props.namespace || namespace;
      this.autoLoad = props.autoLoad === false ? false : autoLoad;
      this.autoReset = props.autoReset === false ? false : autoReset;
      this.model = Model.add({
        ...model,
        namespace: this.namespace
      });

      this.dispatch = wrapperDispatch(props.dispatch, this.namespace);
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

      if (this.props.match && this.props.match.params) {
        // eslint-disable-line
        return {
          ...param,
          ...this.props.match.params
        };
      }
      return param;
    }
    resetData() {
      const model = Model.get(this.namespace);

      this.dispatch({
        type: "reset",
        payload: {
          ...model.getInitial()
        }
      });

      if (this.autoLoad) {
        this.setup();
      }
    }
    setup() {
      this.dispatch({
        type: "setup",
        payload: {
          param: this.getParam()
        }
      });
    }
    componentWillMount() {
      // 如果connect的时候state中并不存在this.namespace的数据，为保证数据的一致性，设置上去
      if (this.props[NoNamespaceStateKey]) {
        const model = Model.get(this.namespace);
        model &&
          this.dispatch({
            type: "setState",
            payload: {
              ...model.getInitial()
            }
          });
      }
    }
    componentDidMount() {
      if (this.autoLoad) {
        this.setup();
      }
    }
    componentWillUnmount() {
      if (this.autoReset) {
        const model = Model.get(this.namespace);

        this.dispatch({
          type: "reset",
          payload: {
            ...model.getInitial()
          }
        });
      }
    }
    render() {
      return (
        <Component
          {...this.props}
          {...WrapperProps}
          dispatch={this.dispatch}
          getParam={() => this.getParam()}
          getNamespace={() => this.namespace}
        />
      );
    }
  };

  WrapperComponent.childContextTypes = {
    dispatch: func,
    getState: func,
    getNamespace: func
  };

  return WrapperComponent;
};

// const NamespaceMap = {};
/**
 * @param 第一阶函数的参数，用于扩展默认的Wrapper，WrapperProps 扩展的属性
 * @param config 高阶函数的config 用于和组件结合
 * @param Component 内容组件
 */
export default store => WrapperProps => config => Component => {
  return class WrapperConnect extends React.PureComponent {
    constructor(props) {
      super(props);
      const { model, wrapperLifeCycle } = config;

      let namespace =
        props.namespace ||
        config.namespace ||
        model.namespace ||
        Component.name;

      Model.add({
        ...model,
        namespace
      });

      const WrapperComponent = Wrapper({
        ...config,
        namespace,
        WrapperProps
      })(Component);

      const mapStateToProps = state =>
        state[namespace] || {
          ...model.initial,
          [NoNamespaceStateKey]: true
        };

      this.WrapperContainer = connect(mapStateToProps)(WrapperComponent);

      // merger上生命周期，可用于扩展
      Object.assign(this, wrapperLifeCycle);
    }
    render() {
      const { WrapperContainer } = this;

      return store ? (
        <Provider store={store}>
          <WrapperContainer {...this.props} />
        </Provider>
      ) : (
        <WrapperContainer {...this.props} />
      );
    }
  };
};
