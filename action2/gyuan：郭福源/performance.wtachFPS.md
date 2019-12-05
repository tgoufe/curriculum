# 网页性能检测扩展（第二期）—— 检测浏览器FPS帧数



> 在[上一篇](https://www.jianshu.com/p/0867b7d551ca)中，了解了基础performance对象针对网页性能检测的使用方法，这一篇内容是专门针对较为精准的检测网页FPS帧数。



## 一、什么是FPS帧数

> FPS是图像领域中的定义，是指画面每秒传输帧数，通俗来讲就是指动画或视频的画面数。FPS是测量用于保存、显示动态视频的信息数量。每秒钟帧数越多，所显示的动作就会越流畅。

[百度百科](https://baike.baidu.com/item/FPS/3227416?fr=aladdin)



如果感觉这个解释不够亲民的话，那么可以看下面的直观版：

1. 帧率能够达到 `50 ～ 60` FPS 或更高，画面流畅；
2. 帧率在 `30 ～ 50` FPS 之间，舒适度略低；
3. 帧率在 `30` FPS 以下，明显的卡顿；
4. 帧率`波动很大`的动画，明显的卡顿。

在前端中主要是检测动画性能，静态内容帧数波动不会有太大变化。



## 二、计算FPS帧数前的准备

1. 公式：FPS（帧率） = 帧数 / 运行时间(毫秒)；
2. 浏览器帧数默认锁定为60FPS.（也就是最高60）；
3. 刷新率 = 1000 / 60；（刷新率即间隔多长时间在浏览器中监测一次 === 浏览器多长时间渲染一次）

因为要监测FPS的实时帧数，所以可以采用固定时间内获得的帧数得出FPS。

当然，还有其他思路。



## 三、计算FPS的方式
*引1：计算FPS的方式*
1. 固定时间，即在固定的时间内，一共得到了多少帧数。
2. 固定帧数，即达到固定帧数所需的时间。
3. 实时计算，每次渲染获得变量直接进行计算。
4. 平均计算，动画全部完成时所需的总时长与总帧数计算。
5. 精确采样计算，精确采取固定量个帧数，以及所需时间计算平均量。
6. 平均采样计算，通过精确采样，利用上一次结果与下一次结果平均。

各类方法对应业务场景不同，前端主要监控/采集动画帧率，所以暂时采取第一种方法，在浏览器的刷新率下得到上一帧的帧率。



## 四、直接食用的FPS监控


Chrome浏览器不出所料的自带一款本地监控当前网页的FPS的工具。

步骤：F12 => 菜单栏 => 选择More tools => 选择 Rendering => 选择下方 FPS meter => 查看屏幕左上角

如下图：

![F12 => 菜单栏 => 选择More tools => 选择 Rendering](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/QQ图片20191129152708.png)

![选择下方 FPS meter](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/QQ图片20191129152855.png)

![查看屏幕左上角](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/QQ图片20191129152859.png)

能够看到帧率和GPU使用情况。



不过，这个只是一个直观的数字反馈，这个工具存在一些缺点：
1. 需要手动调用，关闭开发者模式即失效。
2. 只有在页面渲染时才会有数值检测。
3. 无法进行数据记录和收集。
4. 

## 五、简单的计算帧率的栗子
先用`setTimeout()`来模拟一个试试。

1. 首先，需要声明三个要素，即“帧数”、“运行开始时间”、“运行结束时间”。
```javascript
	const checkObj = {
		_fpsCount: 0, // 帧数
		startTime: window.performance.now(), // 运行开始时间
		lastTime: window.performance.now(), // 运行结束时间
		start: start // 开始函数
	}
```
2. 通过控制`setTimeout()`的执行时间来模拟浏览器60HZ的刷新率。
```javascript
	function start() {
		setTimeout(() => {

		}, 1000 / 66)
	}
```

3. 刷新率搞定后，套用上面计算帧率的公式"帧数 / 运行时间"，帧数即在1s内，浏览器刷新次数；运行时间通过"结束时间 - 开始时间"
```javascript
    setTimeout(() => {
        this.lastTime = window.performance.now(); // 更新结束时间
        this._fpsCount++; // 记录帧数

        if (this.lastTime > (this.startTime + 1000)) {
            let fps = ((this._fpsCount * 1000) / (this.lastTime - this.startTime)).toFixed(2);
            console.log(`${new Date()} 1S内 FPS：`, fps);
            this._fpsCount = 0;
            this.startTime = this.lastTime;
        }
        this.start(); // 持续监测
    }, 1000 / 66)
```
4. 运行`checkObj.start()`开始。
  *实验网页地址：
  [数字时钟动画](https://www.html5tricks.com/html5-canvas-pixel-clock.html)
  [Canvas心电图动画](https://www.html5tricks.com/html5-canvas-electrocardiogram.html)*



**Q&A：**
Q: 为什么选择`setTimeout`而不是`setInterval`?

A: 本质上都可以，但是`setInterval`定时执行函数体内容，`setTimeout`延迟执行，定时器时间数值很小，很有可能出现延后执行，但是因为定时器本身是为了计算1000毫秒时的帧数，延后执行影响略小，`setInterval`容易出现叠加的情况，即上一个没有执行完直接抛出，与下一帧帧数叠加的情况。



Q：记录的FPS是否准确？

A：从小量的测试来看，基本能够贴近Chrome自带检测工具的数值，但js单线程，函数执行终究是有运行时间，定时器遇到大量的异步会导致时间拉长，所以不是完全准确。



Q: 存在什么问题？

A：**`setTimeout`记录的是模拟浏览器的刷新率，而不是动画帧数，且从公式可以看出，记录的是上一秒的FPS而不是当前时间，初次运行结果是0或1。**



Q: 只检测动画或重排重绘帧数怎么办？
A：下一篇，使用`requestAnimationFrame()`函数




*引用：*
1. [https://www.cnblogs.com/coco1s/p/8029582.html](https://www.cnblogs.com/coco1s/p/8029582.html)
2. [https://blog.svenhetin.com/jszhong-window-requestanimationframe-ji-xiang-guan-raf/](https://blog.svenhetin.com/jszhong-window-requestanimationframe-ji-xiang-guan-raf/)