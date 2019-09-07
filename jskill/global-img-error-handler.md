---
title: 设计一个全局处理页面中图片加载失败的模块
date: 2019-03-26 17:32:46
tags:
  - IoC
  - 控制反转
  - JavaScript
---

看到这个问题，我们应该先想一下通常是如何处理图片加载失败的

<!--more-->

如果图片加载失败时会触发 `error` 事件，那么就容易了，只要为每个 `img` 标签添加上内联事件 `onerror` 就可以了

```html
<img src="aaa.jpg" onerror="this.src='placeholder.jpg'">
```

但是不是还可以优化一下呢

```html
<img src="aaa.jpg" onerror="errorHandler(this, event)">
<script>
window.errorHandler = function(target, event){
	target.src = 'placeholder.jpg';
}
</script>
```

这似乎已经满足题目的要求，但是真的没有可优化的地方了么？

首先，这个做法的先决条件是要求每个 `img` 标签上都要求写上 `onerror` 内联事件，其它开发人员忘了写怎么办？

其次，在全局暴露了一个全局函数

以上两点在一些严格执行编码规范的团队中是不能接受的

那么有什么办法呢？

因为 `error` 事件无法冒泡，但是事件传播只有冒泡一种方式么，还有捕获

查规范可知，`error` 事件是可以捕获的，那么就可以实现如下代码

```javascript
function imgErrorHandler(){
	window.addEventListener('error', function(e){
		if( e.target.tagName === 'IMG' ){
			e.target.src = 'placeholder.jpg';
		}
	}, true);
}
```

这样就可以不用担心有人在 `img` 标签上漏写 `onerror` 内联事件了，因为根本不需要写了，也不会再暴露全局函数，只需要在页面渲染的过程中执行一下上面的函数就可以了

接下来可以扩展一下功能：

必然存在不同的场景下图片加载失败显示不同的占位图的需求，那么我们可以在 img 标签上添加一个 `data-placeholder` 属性，标明一下当前场景想要显示的占位图是什么

当完全断网的时候，必然什么图片都无法加载，必然导致错误处理被无限触发，可以标记一个计数器，当达到期望的数值时停止继续请求，改为提供一个 `Base64` 的图片路径

这样代码就扩展如下：
```javascript
const PLACE_HOLDER_IMG_LIST = {
		default: 'placeholder.jpg'
		, offline: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
		, avatar: 'userAvatar.jpg'
		, photo: 'photo.jpg'
	}
	;
 
function imgErrorHandler(){
	window.addEventListener('error', function(e){
		let {target} = e
			, {placeholder = 'default', timer = 0} = target.dataset
			;
		if( target.tagName === 'IMG' ){
			timer = parseInt( timer );
			if( timer < 3 ){
				target.src = PLACE_HODLDER_IMG_LIST[placeholder];
				target.dataset.timer = timer +1;
			}
			else{
				target.src = PLACE_HOLDER_IMG_LIST.offline;
			}
		}
	}, true);
}
```

扩展阅读

根据规范：
>Once the propagation path has been determined, the event object passes through one or more event phases. 

一旦确定了传播路径，事件对象就会通过一个或多个事件阶段。

即每个事件都会有捕获阶段，但不一定会有冒泡阶段。比如 `focus`、`blur` 事件都是不冒泡的，但是却是可以被捕获的

随着 `IE` 浏览器逐渐退出历史舞台，传统的以事件冒泡的开发方式也许会发生改变

尤其在移动端，一些 `touch` 事件库已经使用捕获的方式来执行

捕获阶段一定会在冒泡阶段之前，所以理论上能更快的响应