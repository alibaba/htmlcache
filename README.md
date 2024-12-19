# HTMLCache

存储HTML（渲染结果），而不是JSON数据。  
在HTML里执行（内联），而不是JS资源里。   
最好的骨架屏，HTMLCache——让二次访问的用户更快看到上次展示的内容。  
LiveDemo+文档：https://alibaba.github.io/htmlcache/

## 使用场景  
适合使用一般的接口缓存方案的页面都可以使用HTMLCache。  
但是需要注意的是，HTMLCache缓存的本质上还是一个静态页面。如果有必须使用JS完成的动画等逻辑，则需要在缓存内容展示时自行抹平。  

## 开始使用  
首先安装依赖
```shell
npm install --save htmlcache.js
```  
然后在你需要使用HTMLCache的页面模板(即HTML)中，在`<body>`的最后加入以下代码
```html
<script>
  window.htmlcache={
    cacheKey:'HTMLCacheTestPage',
    source:'#root',
    on:{
      autoCapture:()=> {
        if (document.querySelector('.element-exists-when-loaded')) return true;
      },
    }
  }
  const t = document.createElement('script');
  t.type = 'text/javascript';
  t.text = localStorage.HTMLCacheLoader;
  document.body.appendChild(t);
</script>
```
将`'#root'`替换成你页面内容的根节点选择器。  
将`'.element-exists-when-loaded'`替换成一个数据返回后必定会显示出来的元素的选择器用于确定卸载HTMLCache的时机（可以先这样试试，有替代方法）  

最后，将以下代码加入到你的页面主JS代码中(index.js)
```javascript
import 'htmlcache.js';
```
之后刷新页面2次。你应该会发现加载时页面不再白屏，而是直接展示了缓存的页面内容。  

## 配置对象
所有的配置都存储在window.htmlcache全局对象中。  
你应当在运行loader脚本之前就初始化这个对象，但也有部分仅与capture相关的内容可以后续传入。  
下表为支持的配置项及说明：

| Key         | 类型      | 默认值           | 说明                                  |
|-------------|---------|---------------|-------------------------------------|
| cacheKey    | string  | 必传            | 主Key，决定了本页面所有localStorage存储的前缀以防止冲突 |
| source      | string  | '#root'       | 页面内容根节点的选择器。缓存的内容为其innerHTML        |
| target      | DOM     | document.body | 挂载缓存数据的目标节点。                        |
| expire      | number  | 一周            | 缓存有效期(ms)                           |
| compress    | boolean | true          | 是否开启LZString压缩                      |
| shadow      | boolean | true          | 是否开启ShadowDOM隔离                     |
| styleFilter | boolean | true          | 是否过滤页面中未使用的样式                       |
| firstScreen | boolean | false         | 是否过滤非首屏元素                           |
| batchKey    | string  | -             | 多页模式的子页面Key（eg.影片ID）                |
| on          | Object  | -             | 事件回调对象，见后文                          |

on对象支持的事件回调：

| Key         | 入参    | 返回值     | 说明                                                                                                           |
|-------------|-------|---------|--------------------------------------------------------------------------------------------------------------|
| autoCapture | -     | boolean | 如果传入该函数，则启用自动缓存模式。<br/>该函数会被反复调用直到返回true或抛出异常。<br/>返回true表示页面正常展示，缓存新内容。<br/>抛出异常表示页面有报错，仅销毁。<br/>返回false表示还在加载中。 |
| showCache   | root  | void    | 缓存展示后的回调。<br/>开发时在这里调debugger可以轻松确认缓存效果。<br/>可以在里面进行计时、执行DOM操作抹平展示差异等。<br/>你需要使用传入的root对象进行DOM操作以保证隔离。       |
| captured    | isHit | void    | 新页面被缓存后的回调。可用于性能上报。                                                                                          |
| error       | from  | void    | 内部出错时的回调。from代表错误发生的阶段(loader,capture)                                                                       |

## API
以下API均可通过import直接引入使用。  
```
import { captureHtmlCache } from 'htmlcache.js';
```
### captureHtmlCache
如果不使用autoCapture的话，可以调用这个函数进行手动捕获。  
推荐将它放在页面接口数据获取成功的回调中，它会自动进行新页面内容的缓存并清理页面上的缓存内容。
autoCapture在回调返回true时就是调用这个函数。

### removeHtmlCache
如果不使用autoCapture的话，可以调用这个函数销毁缓存内容。  
推荐在展示报错页的时候执行这个函数，它会销毁DOM和localStorage中所有的缓存内容。  
autoCapture在回调抛出异常时就是调用这个函数。

### replayClick
手速较快的用户，可能会尝试在HTMLCache上进行点击操作——当然，这是没有用的。  
在页面加载完成后，直接调用这个函数，可以重放用户的最后一次点击操作，使得你的缓存内容看上去可以交互。

### storageSense 
这是一个辅助功能，直接调用会对用户的localStorage使用情况进行统计，并返回结果对象，供自定义上报使用。

## 最佳实践
使用这个工具库的用户肯定是关注性能的，所以在此给出一个结合自定义性能上报的最佳实践。  

首先，我们将上文HTMLCache接入的代码分为两个部分，一个是Loader（script标签部分）一个是主包（import）  
然后，这两部分又可以分别分为两个部分，一部分是公用代码，一部分是页面独立代码。  

对于页面独立的部分，很显然应该放在老地方，也就是对应页面的模板和JS文件里。  
对于公用Loader的部分，你可以抽出一个单独的Snippet进行代码复用：
```html
<!-- htmlcache.ejs -->
<script>
  (()=>{
    // 扩展已有的HTMLCache对象加入公用逻辑
    if(window.htmlcache){
      window.htmlcache.on=window.htmlcache.on||{};
      const showCache=window.htmlcache.on.showCache;
      window.htmlcache.on.showCache=(root)=>{
        showCache&&showCache(root);
        // 记录自定义性能打点
        window.my_performance_timestamp = [['htmlcache', Date.now()]];
      }
    }
    // 挂载并执行Loader
    const t = document.createElement('script');
    t.type = 'text/javascript';
    t.text = localStorage.HTMLCacheLoader;
    document.body.appendChild(t);
  })();
</script>
```
对于主包的公用部分，你也可以在执行Capture之前，对全局配置再进行一次修改以加入通用的逻辑，例如报错处理和自定义性能上报：
```js
import { storageSense } from 'htmlcache.js';
import { sendPerf } from 'my-monitor-lib';
if(window.htmlcache){
  window.htmlcache.on = {
    captured: () => {
      if (window.htmlcache.isHit) {
        __bl.sum('HTMLCACHE-HIT'); // arms
        sendPerf('htmlcache', { mark: 'htmlcache' });
      }else{
        __bl.sum('HTMLCACHE-MISS'); // arms
      }
      const storage = storageSense('HTMLCACHE-HIT', true);
      __bl.avg('StorageSense', storage.total);
    },
    error: (_, e) => {
      const storage = storageSense();
      __bl.error({ message: e.stack + '\n' + storage.message });
      __bl.sum('sum', 'HTMLCACHE-ERROR');
    },
    ...(window.htmlcache.on || {}),
  };
}
export * from 'htmlcache.js';
```
业务代码直接引入你封装之后的这个文件，把它当做`htmlcache.js`使用即可。
