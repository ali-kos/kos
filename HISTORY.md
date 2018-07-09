# 版本更新记录

## v1.0.0

* 为保证数据一致性，在connect时如果state中没数据，componentDidMount后将数据进行回填

## v1.1.0
* kos.Wrapper({model,autoLoad,autoReset})：组件销毁时，增加autoReset配置，默认为true，为true时自动重置数据

