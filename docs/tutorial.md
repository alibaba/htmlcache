# HTMLCache

存储HTML（渲染结果），而不是JSON数据。  
在HTML里执行（内联），而不是JS资源里。   
最好的骨架屏，HTMLCache——让二次访问的用户更快看到上次展示的内容。 

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
