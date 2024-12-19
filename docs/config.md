# 配置对象
所有的配置都存储在window.htmlcache全局对象中。  
你应当在运行loader脚本之前就初始化这个对象，但也有部分仅与capture相关的内容可以后续传入。  
下表为支持的配置项及说明：

| Key         | 类型      | 默认值           | 说明                                       |
|-------------|---------|---------------|------------------------------------------|
| cacheKey    | string  | 必传            | 主Key，决定了本页面所有localStorage存储的前缀以防止冲突      |
| source      | string  | '#root'       | 页面内容根节点的选择器。缓存的内容为其innerHTML             |
| target      | DOM     | document.body | 挂载缓存数据的目标节点。                             |
| expire      | number  | 一周            | 缓存有效期(ms)                                |
| compress    | boolean | true          | 是否开启LZString压缩                           |
| shadow      | boolean | true          | 是否开启ShadowDOM隔离                          |
| styleFilter | boolean | true          | 是否过滤页面中未使用的样式                            |
| firstScreen | boolean | false         | 是否过滤非首屏元素                                |
| batchKey    | string  | -             | 多页模式的子页面Key（eg.影片ID）                     |
| validKey    | string  | -             | 用于验证缓存是否合法的Key（例：存储用户id，则用户id改变后缓存会自动失效） |
| on          | Object  | -             | 事件回调对象，见后文                               |

on对象支持的事件回调：

| Key         | 入参    | 返回值     | 说明                                                                                                           |
|-------------|-------|---------|--------------------------------------------------------------------------------------------------------------|
| autoCapture | -     | boolean | 如果传入该函数，则启用自动缓存模式。<br/>该函数会被反复调用直到返回true或抛出异常。<br/>返回true表示页面正常展示，缓存新内容。<br/>抛出异常表示页面有报错，仅销毁。<br/>返回false表示还在加载中。 |
| showCache   | root  | void    | 缓存展示后的回调。<br/>开发时在这里调debugger可以轻松确认缓存效果。<br/>可以在里面进行计时、执行DOM操作抹平展示差异等。<br/>你需要使用传入的root对象进行DOM操作以保证隔离。       |
| captured    | isHit | void    | 新页面被缓存后的回调。可用于性能上报。                                                                                          |
| error       | from  | void    | 内部出错时的回调。from代表错误发生的阶段(loader,capture)                                                                       |
