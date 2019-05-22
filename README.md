# KOS

一款基于react-redux的数据流管理框架，简单轻量，目标是在多端体系下均能使用，与单页和多页方案无关，KOS配合脚手架生成的应用模板，来提供单页多页应用的使用场景




## KOS

#### KOS.use(middleware)

* **说明：** 新增middleware
* **参数：** 
 + **middleware：** redux中间件
* **返回值：** 无


#### KOS.start(App,Container='#main')

* **说明：** 启动应用，单页应用和多页应用均调用这个API
* **参数：** 
 + **App：** React.Component
 + **Container：** React.Component渲染到的DOM节点，默认是id为main的节点

* **说明：** 用于启动一个应用程序


#### KOS.Provider(App)

* **说明：** 获取Provider包裹的高阶组件，并完成store的初始化等动作
* **参数：** 
 + **App：** React.Component

#### KOS.wrapperProps(props)


* **说明：** 用于给Component注入初始化的props，使用在扩展场景，当前的Component会注入

```js
{
  dispatch,
  getNamespace,
  getParam,
}
```
* **参数：** 
 + **props：** Object，例如：
 ```js
 {
   getForm:(formName)=>{
    const namespace = this.getNamespace();
    return Form.getForm(namespace,formName);
   }
 }
 ```

 注意：此处的函数作用域指向是Component的`this.props`



#### KOS.Wrapper(config)(Component)

* **说明：** 将Component使用Wrapper组件进行包装后，挂在到connect下面，用户将Model和View进行包装
* **参数：**
 + **config.model：** 需要绑定的model，model说明详见 [Model](#)
 + **config.autoLoad：** 在执行到Wrapper的componentDidMount的时候，是否自动执行Model.setup方法
* **返回值：** 和Model结合之后的高阶组件
* **特别说明：**
在项目中，通常建议的使用方式是：

```js
import React from 'react';
import KOS form 'kos-core';
import model from './model';

@KOS.Wrapper({model})
const class App extends React.Component({
  render(){
    return <div></div>
  }
})
```

#### KOS.registerModel(mode)

* **说明：** 注册model，KOS.Wrapper高阶组件会调用
* **参数：** 
 + **model：** 需要注册的model
* **返回值：** 返回Model对象，注意：此处的Model对象非`KOS.Wrapper({model})`，时传入的model

#### KOS.getModel(namespace)

* **说明：** 根据namespace获取Model对象
* **参数：** 
 + **namepace：**


 ## Model


### 日常书写的Model包含如下概念：

 * **namespace：** 命名空间，不能重复，初始化时会作为key，将model的initial挂载到store的state下
 * **initial：** state初始化数据，建议层级不要太深
 * **reducers：** Redux的reducer合集，用于处理同步的action
 * **asyncs：** 异步合集，用于处理异步的action
 * **setup：** 初始化的action处理，异步处理

### 书写代码示例

```js
export default {
  initial:{
    name:'',
    list:[],
    params:{}
  },
  reducers:{
    setList(state,action){
      const {list,name,params} = state;
      const {payload} = action;

      return {
        ...state,
        ...payload.list
      };
    }
  },
  asyncs:{
    async loadList(dispatch,getState,action){
      const state = getState();
      const {list,name,params} = state;

      
    }
  }
}
```

#### API说明

#### Definition(@types/kos-core) change log
``` install: npm install @types/kos-core ```

2019-5-22: Update definitions to fit new version.

##### 1
```
interface Util {
    getActionType: (action: string) => { namespace: string | null; type: string };
}
```
to
```
interface Util {
    getActionType: (action: string) => { namespace: string | null; type: string };
    getParam: () => any;
}
```
##### 2
```
    setup?: (dispatch: KosDispatch, getState: GetKosState<T>) => void;
```
to
```
    setup?: (dispatch: KosDispatch, getState: GetKosState<T>, action: { payload: { param: any } }) => void;
```

2019-4-8: Update asyncs function's paramaters as unrequited to fit much more scenarios.
```
export interface KosModel<T = any> {
    ...;
    asyncs: {
        [key: string]: (dispatch: KosDispatch, getState: GetKosState<T>, action: Action) => void;
    };
    ...
```
to
```
export interface KosModel<T = any> {
    ...;
    asyncs: {
        [key: string]: (dispatch?: KosDispatch, getState?: GetKosState<T>, action?: { payload: T }) => void;
    };
    ...
```


2018-11-1:
change
```
export interface KosModel<T = any> {
    ...;
    asyncs: {
        [key: string]: (dispatch: KosDispatch, getState?: GetKosState<T>) => void;
    };
    ...
```
to
```
export interface KosModel<T = any> {
    ...;
    asyncs: {
        [key: string]: (dispatch: KosDispatch, getState: GetKosState<T>, action: Action) => void;
    };
    ...
```

