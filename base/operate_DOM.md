---
title: JS中操作DOM是"同步"还是"异步"?
date: 2019-08-08 17:55:00
tags:
  - JavaScript
categories: JavaScript
---


很多时候"不得已"使用js操作DOM，这个操作过程到底是"同步"的还是"异步"呢？
<!--more-->




> 很多时候"不得已"使用js操作DOM，这个操作过程到底是"同步"的还是"异步"呢？



### 一、操作DOM的栗子


按理说，在js的执行中，对于DOM的操作都是同步执行的，

```
<body></body>

<script>
    var body = document.querySelector('body');
    console.log(`1`);
    var cDiv = document.createElement('div');
    console.log(cDiv)
    console.log(`2`);
    body.appendChild(cDiv)
    console.log(body);
</script>

```

以上结果目前和我们预想的结果是一致的，自上而下依次同步执行，这里划重点，`js引擎线程`。

接下来做一点修改
```
<style>
	.easy {
		width: 200px;
		height: 200px;
		background: lightgoldenrodyellow;
	}
	.hard {
		background: lightsalmon;
		transition: 2s all;
	}
</style>

<body></body>

<script>
	var body = document.querySelector('body');
	console.log(`1`);
	var cDiv = document.createElement('div');
	console.log(cDiv);
	console.log(`2`);
	body.appendChild(cDiv)
	console.log(body);
	cDiv.classList.add('easy')
	console.log(`3`);
 // ======================
    for(var i = 0;i<3000000000;i++);
	cDiv.classList.add('hard')
	console.log(cDiv)
 // ======================
</script>

```

既然是同步执行，那我在添加第二个样式`hard`之前阻塞一下，理论上在阻塞的情况下`<div>`应该的背景色是淡黄色吧？不过跑一下完全不对劲啊，出来的很慢不说，竟然直接就橘色了。这里划重点，`GUI渲染线程`


### 二、捋一捋问题

1. 有阻塞，在阻塞时没有显示已有样式，究竟是不是同步执行的？
2. `console.log()`的内容并不是空，只是返回的很慢，看着像异步执行？
3. 过度样式被忽略了，但背景色覆盖执行了，是什么原因？


### 三、依次解题

1. `js`执行顺序不在这里细说，常见能够改变执行队列的`Promise`、`setTimeout`、`<script>标签`等等都没有在这里出现，所以确认是同步执行无疑。

2. 既然同步执行为什么会有"异步"的效果，这里要说到上文划重点内容: `js引擎线程`与`GUI渲染线程`。也就是说，**js引擎线程与GUI渲染线程互斥**，这是线程之间的"同步"造成的操作DOM时的"异步"效果。

3. `<div>`的样式为什么没有生效呢？明明有一个过渡效果。原因是：**浏览器的渲染时会执行优化策略，即将多个同一DOM下的样式合并后渲染。**


### 四、 总结

1. `js引擎线程`与`GUI渲染线程`线程间的互斥，引起了对`js`操作DOM的"异步"问题。
2. `GUI渲染线程`在能够执行的情况下的优化策略，渲染出的是最终得到的样式结果。

具体的渲染线程的内容，不在这次讨论范围之内嘛。

虽然原因找到了，不过问题好像还在。

### 五、 解决问题

如果产品一定要从js创建出来的div拥有炫酷的特效（比如上面的过度样式）。
呵呵呵呵

直接整理一下来自[知乎](https://www.zhihu.com/question/337189395)各方大佬的解题思路，
这里不仅仅是过度样式，类似问题依然有效。

分析问题：
1. 过度效果是至少由A变B，也就是至少存有两个不同状态；
2. 由于上文所讲的`GUI渲染线程`与`js引擎`的互斥会造成一种"同步"执行的效果，所以创建`<div>`本身已经被滞后了，缺少A。
3. 又由于`GUI渲染线程`优化策略，最后结果B将覆盖可以覆盖的所有。缺少了A（被覆盖），之后被渲染出现在`document`内。
4. 本身已经是B，且没有A状态，过度效果无效。

*解决方向就是使`<div>`拥有一个初始状态A就搞定了。（提前将生成的DOM渲染到document上）*

-----

解决方法一：
```
	cDiv.classList.add('easy')
	// for(var i = 0;i<3000000000;i++);
	setTimeout(() => {
		cDiv.classList.add('hard')
	}, 0)
```


思路： 利用`setTimeout`方法，改变执行队列。也就是手动将`js引擎`滞后，使`js引擎`结束，被挂起的`GUI渲染线程`执行，拥有了初始状态A后，在执行过度效果就OK了。


解决方法二（推荐）：
```
	cDiv.classList.add('easy')
	cDiv.clientLeft; // 任一触发页面回流的方法皆可
	cDiv.classList.add('hard')
```
思路：既然可以让`js引擎`滞后，那也可以让`GUI渲染线程`提前，用立即触发回流的任意方法，使之前在渲染队列中的状态A生效。
相对优点在于，同样是触发回流，方法二从代码可读性或操作性上都略胜一筹，优秀团队有这种追求也是自然而然的。