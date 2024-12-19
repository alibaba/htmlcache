
# API
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