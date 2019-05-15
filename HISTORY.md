# 版本更新记录

## v1.0.0

* 为保证数据一致性，在connect时如果state中没数据，componentDidMount后将数据进行回填

## v1.1.0
* kos.Wrapper({model,autoLoad,autoReset})：组件销毁时，增加autoReset配置，默认为true，为true时自动重置数据

## v2.0.0
* 修复middleware顺序错误，v1.x的时候，kos.use的middleware执行顺序为先use，后执行；v2.x以后修改为先use先执行


## v2.3.0
* 提供namespace自动生成能力
* namespace支持多实例能力
