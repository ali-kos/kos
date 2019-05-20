import Store from "./store";

const DefaultReducers = {
  setState(state, action) {
    let { payload } = action;

    if (!payload) {
      payload = { ...action };
      delete payload.type;
    }

    return {
      ...state,
      ...payload
    };
  },
  reset(state, action) {
    return {
      ...action.payload
    };
  }
};

const Model = class {
  constructor(model) {
    const { namespace, asyncs, reducers, setup } = model;
    this.namespace = namespace;
    Object.assign(model, {
      asyncs: {
        setup,
        ...asyncs
      },
      reducers: {
        ...DefaultReducers,
        ...reducers
      }
    });

    this.model = model;
  }
  getNamespace() {
    return this.namespace;
  }
  getAsync(type) {
    return this.model.asyncs[type];
  }
  getReducer(type) {
    return this.model.reducers[type];
  }
  getInitial() {
    return this.model.initial;
  }
  getAttr(attrName) {
    return this.model[attrName];
  }
  getState() {
    const namespace = this.getNamespace();
    const state = Store().getState() || {};
    return state[namespace];
  }
  getSetup() {
    return this.model.setup;
  }
};

const createModelFactory = model => {
  const { namespace } = model;

  if (!namespace) {
    console.error("namespace is undefined!", model); // eslint-disable-line
    throw new Error("namespace is undefined!");
  }
  return new Model(model); // eslint-disable-line
};

const map = {};
Object.assign(Model, {
  add(model) {
    const { namespace } = model;
    let ins = map[namespace];
    if (!ins) {
      ins = createModelFactory(model); // eslint-disable-line
      map[namespace] = ins;
    }
    return ins;
  },
  del(namespace) {
    delete map[namespace];
  },
  get(namespace) {
    return map[namespace];
  },
  getInitial() {
    const initial = {};

    this.each((namespace, model) => {
      initial[namespace] = model.getInitial();
    });

    return initial;
  },
  each(callback) {
    for (const namespace in map) {
      // eslint-disable-line
      callback(namespace, map[namespace]);
    }
  },
  getReducer(namespace, type) {
    const model = this.get(namespace);
    return model ? model.getReducer(type) : null;
  },
  getAsync(namespace, type) {
    const model = this.get(namespace);
    return model ? model.getAsync(type) : null;
  },
  getSetup(namespace) {
    const model = this.get(namespace);

    return model && model.setup;
  }
});

export default Model;
