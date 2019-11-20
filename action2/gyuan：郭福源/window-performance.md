# 网页性能检测-performance



> 上一篇讲到看懂[Chrome浏览器自带的Performance性能监控](https://www.jianshu.com/p/9b056d33d190),但很多时候我们希望的是主动收集客户端的数据，浏览器的调试工具就有些无法满足了。



推荐使用`window.performance`对象。



## 一、performance是什么

> 允许网页访问某些函数来测量网页和Web应用程序的性能，包括 [Navigation Timing](https://developer.mozilla.org/en-US/docs/Navigation_timing) API和高分辨率时间数据。

来源：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/performance)



实质上来说`performance`对象就是专门用于性能监测的对象，内置了几乎所有常用前端需要的性能参数监控。



**注意：performance对象的所有API，都是只读的。**

例如：
- 自输入网址回车开始到某一特定时间
- 解析dom树耗时
- 白屏时间
- domready时间
- onload时间
- 重定向耗时
- request请求耗时

还有：
- 当前网页的全部对象统计信息
- 用户行为信息
- 

## 二、performance的兼容性



`performance`的监控前端性能推出，让几乎所有浏览器都舒服了一把。
(~~`IE9`以下除外~~)
并且各大浏览器都在尽力的做向下兼容。


不能盲目乐观：
1.  `performance`的内置方法的返回结果各内核浏览器不一致，例如：获取所有所有http请求列表时，Firefox返回结果包括失败和成功全部内容，Chrome浏览器则只返回成功请求。
2.  `performance`很多内置API是基于浏览器实现，因此在移动端或客户端上有所限制。(如`getEntries()`等)




## 三、performance的API



performance`的API比较多，但有几个尤为实用。



### 1. performance.now()方法
`performance.now()`返回`performance.navigationStart`至当前的毫秒数。
`performance.navigationStart`是下文将介绍到的可以说是浏览器访问最初的时间测量点。

值得注意的两点：
- 测量初始点是浏览器访问最初测量点，或者理解为在地址栏输入URL后按回车的那一瞬间。
- 返回值是毫秒数，但带有精准的多位小数。



用`performance.now()`检测for循环的执行时间(毫秒)
```
    var st = performance.now();
    for (var o = 0; o < 10000; o ++)  console.log(o)
    var end = performance.now();

    console.log(`for时间${end - st}`); // for时间1155.9950000373647
```



### 2. performance.navigation属性



performance.navigation`负责纪录用户行为信息，只有两个属性。



```
console.log(performance.navigation);
// PerformanceNavigation {type: 1, redirectCount: 0}
```
- type：表示网页的加载来源，可能有4种情况
    - 0：网页通过点击链接、地址栏输入、表单提交、脚本操作等方式加载，相当于常数
    - 1：网页通过“重新加载”按钮或者location.reload()方法加载
    - 2：网页通过“前进”或“后退”按钮加载
    - 255：任何其他来源的加载
- redirectCount：表示当前网页经过了多少次重定向跳转。



### 3. performance.timing对象



作为`performance`最为重要的属性之一，`timing`内包含了几乎所有时间节点。(*附1*)



整理的常用时间点计算如下：直接复制粘贴取用。
```
window.onload = function() {
  var timing  = performance.timing;
  console.log('准备新页面时间耗时: ' + timing.fetchStart - timing.navigationStart);
  console.log('redirect 重定向耗时: ' + timing.redirectEnd  - timing.redirectStart);
  console.log('Appcache 耗时: ' + timing.domainLookupStart  - timing.fetchStart);
  console.log('unload 前文档耗时: ' + timing.unloadEventEnd - timing.unloadEventStart);
  console.log('DNS 查询耗时: ' + timing.domainLookupEnd - timing.domainLookupStart);
  console.log('TCP连接耗时: ' + timing.connectEnd - timing.connectStart);
  console.log('request请求耗时: ' + timing.responseEnd - timing.requestStart);
  console.log('白屏时间: ' + timing.responseStart - timing.navigationStart);
  console.log('请求完毕至DOM加载: ' + timing.domInteractive - timing.responseEnd);
  console.log('解释dom树耗时: ' + timing.domComplete - timing.domInteractive);
  console.log('从开始至load总耗时: ' + timing.loadEventEnd - timing.navigationStart);
}
```
值得注意的一点：放在`window.onload`中执行，最主要的原因是渲染完成后能拿到大部分`timing`属性，也可以放入`定时器中`执行。



### 4. performance.mark(markName)方法
标记在自定义的时间点，对应的方法是`peformance.clearMarks(markName) / performance.clearMarks();`
实测兼容性并不是很理想。。。（或者可能我用的不对）



### 5. performance.memory属性



`performance.memory`用于显示当前的内存占用情况；



```
console.log(performance.memory);
/* MemoryInfo {
  totalJSHeapSize: 11735319,
  usedJSHeapSize: 9259919,
  jsHeapSizeLimit: 2197815296
} */
```
- usedJSHeapSize表示：JS 对象（包括V8引擎内部对象）占用的内存数
- totalJSHeapSize表示：可使用的内存
- jsHeapSizeLimit表示：内存大小限制



通常，`usedJSHeapSize`不能大于`totalJSHeapSize`，如果大于，有可能出现了内存泄漏。




### 6. performance.getEntries()方法
浏览器获取网页时，会对网页中每一个对象（脚本文件、样式表、图片文件等等）发出一个HTTP请求。performance.getEntries方法以数组形式，返回一个PerformanceEntry列表，这些请求的时间统计信息，有多少个请求，返回数组就会有多少个成员。

`name`：资源名称，是资源的绝对路径或调用mark方法自定义的名称
`startTime`:开始时间
`duration`：加载时间
`entryType`：资源类型，entryType类型不同数组中的对象结构也不同！具体见下
`initiatorType`：谁发起的请求，具体见下



**entryType**的值:

| 值         | 该类型对象                  | 描述                                                         |
| ---------- | --------------------------- | ------------------------------------------------------------ |
| mark       | PerformanceMark             | 通过mark()方法添加到数组中的对象                             |
| measure    | PerformanceMeasure          | 通过measure()方法添加到数组中的对象                          |
| paint      | PerformancePaintTiming      | 值为first-paint'首次绘制、'first-contentful-paint'首次内容绘制。 |
| resource   | PerformanceResourceTiming   | 所有资源加载时间，用处最多                                   |
| navigation | PerformanceNavigationTiming | 现除chrome和Opera外均不支持，导航相关信息                    |
| frame      | PerformanceFrameTiming      | 现浏览器均未支持                                             |

也可参见：[MDN](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry/entryType)



**initiatorType**的值：

| 发起对象                             | 值                               | 描述                                                   |
| ------------------------------------ | -------------------------------- | ------------------------------------------------------ |
| a Element                            | `link`/`script`/`img`/`iframe`等 | 通过标签形式加载的资源，值是该节点名的小写形式         |
| a CSS resourc                        | `css`                            | 通过css样式加载的资源，比如background的url方式加载资源 |
| a XMLHttpRequest object              | `xmlhttprequest`/`fetch`         | 通过xhr加载的资源                                      |
| a PerformanceNavigationTiming object | `navigation`                     | 当对象是PerformanceNavigationTiming时返回              |

**1. 只能在浏览器中使用**
**2. 该方法返回的数组第一项是HTML页面信息**



## 四、如何将performance的信息传递出去



1. `sendBeacon`方法
2. 动态`<img>`标签
3. web wroker

这些都是后话啦。。。

-----------------------------

引用：
1. [https://developer.mozilla.org/zh-CN/docs/Web/API/Window/performance](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/performance)
2. [https://developer.mozilla.org/en-US/docs/Web/API/Navigation_timing_API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_timing_API)
3. [http://javascript.ruanyifeng.com/bom/performance.html](http://javascript.ruanyifeng.com/bom/performance.html)
4. [https://www.cnblogs.com/bldxh/p/6857324.html](https://www.cnblogs.com/bldxh/p/6857324.html)

-----------------------------


*附1：*
| 属性名                     | 含义                                                         |
| :------------------------- | :----------------------------------------------------------- |
| navigationStart            | 浏览器窗口的前一个网页关闭时发生unload事件时的Unix时间戳，属于最前的测量时间点 |
| unloadEventStart           | 前网页与当前网页同属一个域名时，返回前一个网页的unload事件发生时的Unix时间戳 |
| unloadEventEnd             | 前网页与当前网页同属一个域名时，返回前一个网页unload事件的回调函数结束时的Unix时间戳 |
| redirectStart              | 返回第一个HTTP跳转开始时的Unix时间戳                         |
| redirectEnd                | 返回最后一个HTTP跳转结束时的Unix时间戳                       |
| fetchStart                 | 返回浏览器准备使用HTTP请求读取文档等资源时的Unix时间戳，在网页查询本地缓存之前发生 |
| domainLookupStart          | 返回域名查询开始时的Unix时间戳。如果使用持久连接，或者信息是从本地缓存获取的，则返回值等同于fetchStart属性的值 |
| domainLookupEnd            | 返回域名查询结束时的Unix毫秒时间戳。如果使用持久连接，或者信息是从本地缓存获取的，则返回值等同于fetchStart属性的值 |
| connectStart               | 返回HTTP请求开始向服务器发送时的Unix毫秒时间戳。如果使用持久连接（persistent connection），则返回值等同于fetchStart属性的值 |
| connectEnd                 | 返回浏览器与服务器之间的连接建立时的Unix毫秒时间戳。如果建立的是持久连接，则返回值等同于fetchStart属性的值。连接建立指的是所有握手和认证过程全部结束 |
| secureConnectionStart      | 返回浏览器与服务器开始安全链接的握手时的Unix毫秒时间戳。如果当前网页不要求安全连接，则返回0 |
| requestStart               | 返回浏览器向服务器发出HTTP请求时（或开始读取本地缓存时）的Unix毫秒时间戳 |
| responseStart              | 返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的Unix毫秒时间戳 |
| responseEnd                | 返回浏览器从服务器收到（或从本地缓存读取）最后一个字节时（如果在此之前HTTP连接已经关闭，则返回关闭时）的Unix毫秒时间戳 |
| domLoading                 | 返回当前网页DOM结构开始解析时（即Document.readyState属性变为“loading”、相应的readystatechange事件触发时）的Unix毫秒时间戳 |
| domInteractive             | 返回当前网页DOM结构结束解析、开始加载内嵌资源时（即Document.readyState属性变为“interactive”、相应的readystatechange事件触发时）的Unix毫秒时间戳 |
| domContentLoadedEventStart | 返回当前网页DOMContentLoaded事件发生时（即DOM结构解析完毕、所有脚本开始运行时）的Unix毫秒时间戳 |
| domContentLoadedEventEnd   | 返回当前网页所有需要执行的脚本执行完成时的Unix毫秒时间戳     |
| domComplete                | 返回当前网页DOM结构生成时（即Document.readyState属性变为“complete”，以及相应的readystatechange事件发生时）的Unix毫秒时间戳 |
| loadEventStart             | 返回当前网页load事件的回调函数开始时的Unix毫秒时间戳。如果该事件还没有发生，返回0 |
| loadEventEnd               | 返回当前网页load事件的回调函数运行结束时的Unix毫秒时间戳。如果该事件还没有发生，返回0 |