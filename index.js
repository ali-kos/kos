import ReactDOM from "react-dom";
import React from "react";
import { Provider } from "react-redux";

import * as Util from "./src/util";
import Wrapper from "./src/wrapper";
import Model from "./src/model";

import Store from "./src/store";

// 全局的中间件
const middlewareList = [];

// 全局的Wrapper扩展属性
const wrapperProps = {};

const KOS = {
  Util,
  registeModel: model => Model.add(model),
  removeModel(namespace) {
    Model.del(namespace);
  },
  getModel(namespace) {
    return Model.get(namespace);
  },
  use(middleware) {
    middlewareList.push(middleware);
  },
  wrapperProps: props => {
    Object.assign(wrapperProps, props);
  },
  Wrapper: Wrapper()(wrapperProps),
  WrapperProvider: config => {
    const store = Store(middlewareList);
    return Wrapper(store)(wrapperProps)(config);
  },
  Provider(Layout) {
    const store = Store(middlewareList);

    return (
      <Provider store={store}>
        <Layout />
      </Provider>
    );
  },
  start(Layout, container = "#main") {
    ReactDOM.render(KOS.Provider(Layout), document.querySelector(container)); // eslint-disable-line
  }
};

export default KOS;
