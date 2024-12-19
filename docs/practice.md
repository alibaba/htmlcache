
# 最佳实践
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
