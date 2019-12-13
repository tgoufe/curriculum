# 五分钟看懂Performance性能监控工具



> Chrome浏览器有很多强大的自带工具，Performance用于浏览器性能监控，无需安装，点开即用。

## 一、什么是Performance

Performance是网页性能监控的工具，打开`开发者模式`后，找到Performance标签即进入了初始化界面。

![初始化.png](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/Performance_1.png)


1. Performance标签进入
2. 更多配置，例如降低CPU、降低网速等配置
3. 主要功能按钮，前三个常用的分别是`开始监控`、`刷新并监控当前页加载完毕`、`清空全部log`

## 二、Performance一键使用

在页面上写10000个`div`标签，来看看Performance如何使用

上一盘简单栗子：
```javascript
    for (let i = 0; i < 10000; i++) {
    	document.write(`<div>我是第 ${i} 个div</div>`)
    }
```
看看监控结果：

![Performance.gif](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/Performance.gif)

就是这么简单的使用，可是，看不懂啊。


## 三、Performance简单上手

**划重点，注意颜色**


![监控结果.png](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/Performance_2.png)

因为点击的是只监控到页面加载完毕为止，所以时间栏只有部分结果，也可以选择监控按钮手动停止得到你想要的内容和对应时间段。

如何看懂这个结果呢

**看颜色**

1. Summary标签 —— 内容摘要

| 颜色 | 内容      | 概括             | 具体范围                                                     |
| ---- | --------- | ---------------- | ------------------------------------------------------------ |
| 蓝色 | Loading   | HTML解析时间     | 网络请求完毕事件；请求的响应数据到达事件；如果响应数据很大（拆包），可能会多次触发该事件；响应头报文到达时触发；发送网络请求时触发。 |
| 黄色 | Scripting | 脚本运行时间     | 一个定义好的动画帧发生并开始回调处理时触发；取消一个动画帧时触发；垃圾回收时触发；当页面中的DOM内容加载并解析完毕时触发；js事件；只有当浏览器进入到js引擎中时触发；创建计时器（调用setTimeout()和setInterval()）时触发；调用预定一个新帧；当清除一个计时器时触发；调用console.time()触发；调用console.timeEnd()触发；定时器激活回调后触发；当一个异步请求为就绪状态后触发；当一个异步请求完成加载后触发 |
| 紫色 | Rendering | 样式/布局 - 重排 | 当DOM更改导致页面布局失效时触发；页面布局计算执行时触发；Chrome重新计算元素样式时触发；内嵌的视窗滚动时触发 |
| 绿色 | Painting  | 重绘             | Chrome的渲染引擎完成图片层合并时触发；一个图片资源完成解码后触发；一个图片被修改尺寸后触发；合并后的层被绘制到对应显示区域后触发 |
| 深灰 | System    | 其他             | 含系统运行内容                                               |
| 浅灰 | Idle      | 空闲时间         | 触发事件前的微小等待时间会被算入                             |

从颜色上出发就可以看到，刚才的10000个`div`执行，在脚本和重排上花费了大量的时间，毕竟是循环一次，触发一次重排重绘。

2.` Bottom-Up`标签 —— 自下而上（事件冒泡）
类似于事件冒泡，从触发事件的具体方法/文件显示。

Self Time和Total Time以及Activity
- Self Time - 本身执行消耗时间
- Total Time - 所在环境执行+本身消耗时间总和
- Activity - 对应活动

Grouping - 筛选项



3. `Call Tree`标签 —— 自上而下（事件捕获）

类似于事件捕获，从外层逐步向下计算。

同上。

4. `Event Log`标签 —— 日志
    可以查找某一阶段或者之前监控的log


## 四、使用Performance检测改进结果

```javascript
    let html = '';
    for (let i = 0; i < 10000; i++) {
        html += `<div>我是第 ${i + 1} 个div</div>`
    }
    document.write(html)
```

![改进结果.png](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/Performance_3.png)

结果显示`Scripting`脚本执行时间大幅度的下降了，但是重排时间有所上升，因为一次性的写入了10000个标签，如果想继续优化，解决大批量重排的情况，可以阅读[高性能渲染十万条数据]([https://juejin.im/post/5db684ddf265da4d495c40e5](https://juejin.im/post/5db684ddf265da4d495c40e5)
)；

## 五、其他内容
1. 在时间进度条中有FPS、CPU、NET的数值监控，依次调整
2. 如果在手机端，CPU和NET的性能要有所下调，可以使用右上角`Network`和`CPU`下拉选项降低性能模拟。
3. 各个浏览器大致通用（火狐、IE11等），但因为每个人的浏览器安装的工具或多或少，可能会影响结果，在谷歌中，可以使用`Ctrl + Shift + N`进入无痕模式测试，降低偏差。