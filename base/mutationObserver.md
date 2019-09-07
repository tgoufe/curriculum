---
title: 监听DOM加载完成及改变——MutationObserver应用
date: 2019-08-28 15:00:00
tags:
  - JavaScript
categories: JavaScript
---



> 准确的监听DOM渲染成功
<!--more-->


> 上节讲到[DOM的操作是"同步"还是"异步"](https://www.jianshu.com/p/76b0ede6690e)，怎么准确的监听DOM到底啥时候渲染成功了呢——MutationObserver。


## 一、什么是MutationObserver

> 接口提供了监视对DOM树所做更改的能力。它被设计为旧的MutationEvents功能的替代品，该功能是DOM3 Events规范的一部分。


[来源：MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)

**简单粗暴，就是监听DOM树的变动。**

那么，被代替的`MutationEvents`是什么？

## 二、MutationEvents

1. 首先明确：`MutationEvents `在MDN中也写到了，是被`DOM Event`承认在API上有缺陷，**反对使用**。
2. 缺陷的核心在于两点：**跨浏览器支持**和**性能问题**
3. `MutationEvents `的原理：**通过绑定事件监听DOM**
乍一看到感觉很正常，那列一下相关监听的事件：
```DOMAttrModified
DOMAttributeNameChanged
DOMCharacterDataModified
DOMElementNameChanged
DOMNodeInserted
DOMNodeInsertedIntoDocument
DOMNodeRemoved
DOMNodeRemovedFromDocument
DOMSubtreeModified
```

4. 甭记，这么多事件，各内核各版本浏览器想兼容怕是要天荒地老。
5. 具体说说性能问题（划重点）：
    - （1）事件多，可见的，监听多项就绑定多项。
    - （2）只要是绑定事件，离不开**冒泡**或**捕获**两种，而监听的意义，有可能是大量的、频繁的改动所作出的反应。况且，万一要监听多项呢？万一多层嵌套每层都要监听呢？万一父子兄弟祖宗全家桶呢？（写出来了维护一下试试？）
    - （3）绑定事件立即执行有可能中断DOM的余下变动，也就是没动完事件就触发了。

[原作者吐槽邮件](http://lists.w3.org/Archives/Public/public-webapps/2011JulSep/0779.html)

6. 接上，这些问题其实使用`观察者模式`就可以不错的搞定，所以，看`MutationObserver`名字就知道了。


## 三、一句话说明观察者模式

因为本篇主要介绍`MutationObserver`，作为`MutationObserver`的设计原理，简单理解就是

**A想看新闻，A就先在B这'交钱（订阅）'，以后有新闻B就给A送报纸，A挑想看的新闻**

- A - 订阅者 - 通过`MutationObserver`得到返回值(得到报纸) - 可以有无数的A来看B
- B - 被观察者 - `DOM` - 变更时发送新的内容(送新报纸) - B决定A

当然，更详细的观察者模式不久的将来都会有的。



## 四、MutationObserver的改进
针对上面`MutationEvents`的缺陷，来说一下`MutationObserver`的优势。

1.  浏览器兼容问题：
```
const mutationObserver = new MutationObserver(callback);
```
`MutationObserver`是构造函数，兼容难度低（ IE11以上才支持 ），值得说明的一点，移动端兼容性更佳。

2.  事件多问题：
```
const mutationObserver = new MutationObserver((mutations, observer) => {
	console.log(observer); // 观察者实例
	console.log(mutations); // 变动数组
	mutations.forEach(function(mutation) {
	    console.log(mutation);
	});
});
```

`callback`作为监听事件，返回两个固定参数`mutations`和`observer`。
`mutations` - 变动数组
`observer` - 观察者实例

具体要执行的函数呢，往下看


3. 立即触发/多次触发问题：
```
function editContent() {
    const content = document.getElementById('content');
    console.log(1);
    // --------------------------
    observer(); // 订阅
    // --------------------------
    content.style.background = 'lightblue';
    content.style.background = 'red';
    console.log(2);
    content.innerHTML = 4433;
    console.log(3);
    const newNode = document.createElement('p');
    newNode.innerHTML = 888888;
    content.appendChild(newNode);
    console.log(4);
}
```

执行结果：
```
// 1
// 2
// 3
// 4
// MutationObserver {}
// (4)[MutationRecord, MutationRecord, MutationRecord, MutationRecord]
```

- 异步执行，插入微任务队列，脚本执行后才会执行。（[微任务不能再清楚的帖子](https://juejin.im/post/5d5b4c2df265da03dd3d73e5)）
- `mutations`参数将监听的`DOM`的所有变更记录按`执行顺序`封装成为一个`数组`返回。
- 可以通过配置项，监听目标`DOM`下`子元素`的变更记录


## 五、MutationObserver的基础使用

上面已经看到如何通过`MutationObserver`构造函数创建一个实例对象。
下一步要绑定`被观察者`，以及需要观察哪些变动项。

##### 1. MutationObserver.observe(dom, options)
启动监听，接收两个参数。

 - 第一参数：被观察的`DOM`节点
 - 第二参数：配置需要观察的变动项options（记得`MutationEvents`茫茫多的事件吗，这里通过配置项完成）

```
mutationObserver.observe(content, {
    attributes: true, // Boolean - 观察目标属性的改变
    characterData: true, // Boolean - 观察目标数据的改变(改变前的数据/值)
    childList: true, // Boolean - 观察目标子节点的变化，比如添加或者删除目标子节点，不包括修改子节点以及子节点后代的变化
    subtree: true, // Boolean - 目标以及目标的后代改变都会观察
    attributeOldValue: true, // Boolean - 表示需要记录改变前的目标属性值
    characterDataOldValue: true, // Boolean - 设置了characterDataOldValue可以省略characterData设置
    // attributeFilter: ['src', 'class'] // Array - 观察指定属性
});
```

**注：**
1. `attributeFilter/attributeOldValue` 优先级高于 `attributes`
2. `characterDataOldValue` 优先级高于 `characterData`
3. `attributes/characterData/childList`（或更高级特定项）至少有一项为`true`；
4. 特定项存在, 对应选项可以`忽略`或必须为`true`

*附：[开发API原文](https://dom.spec.whatwg.org/#dom-mutationobserver-observe)*

##### 2. MutationObserver.disconnect()

停止观察。调用后不再触发观察器，解除订阅


##### 3. MutationObserver.takeRecords()
清除变动记录。即不再处理未处理的变动。该方法返回变动记录的数组，注意，该方法**立即生效**。

*附：takeRecords变更记录字段内容`MutationRecord`对象*
```
/*
MutationRecord = {
  type：如果是属性变化，返回"attributes"，如果是一个CharacterData节点（Text节点、Comment节点）变化，返回"characterData"，节点树变化返回"childList"
  target：返回影响改变的节点
  addedNodes：返回添加的节点列表
  removedNodes：返回删除的节点列表
  previousSibling：返回分别添加或删除的节点的上一个兄弟节点，否则返回null
  nextSibling：返回分别添加或删除的节点的下一个兄弟节点，否则返回null
  attributeName：返回已更改属性的本地名称，否则返回null
  attributeNamespace：返回已更改属性的名称空间，否则返回null
  oldValue：返回值取决于type。对于"attributes"，它是更改之前的属性的值。对于"characterData"，它是改变之前节点的数据。对于"childList"，它是null
}
*/
```


#### 六、MutationObserver的进阶应用

- 监听JS脚本创建的`DOM渲染完成`
- 监听图片/富文本编辑器/节点内容变化及处理
- 关于`vue`对于`MutationObserver`的应用

##### 1. 监听JS脚本创建的DOM渲染完成

之前有提到，`DOM渲染`遇到`脚本阻塞`时会发生类似于"异步"的情况，影响对DOM的后续操作。
虽然可以用触发回流的方式解决，但是在复杂业务场景中/过量数据场景中并不是十分优秀的选择。
既然`MutationObserver`能够监听到`DOM树`中`子节点`的变化，那么利用这一点，可以监听`document`或`父节点`的DOM树变化。

小巧的栗子：
```
// html
<div id="content">66666</div>

// js
let time = 4;
let arr = new Array(time);
let content = document.getElementById('content');
let mutationObserver = new MutationObserver(obsCallback); // 创建实例
obs(); // 绑定被观察者
obstruct(); // 执行阻塞

// 完成创建
function obsCallback(mutations, observer) {
    console.log(`创建完成!`);
    console.log(observer); // 观察者实例
    console.log(mutations); // 变动数组
}

function obs() {
    mutationObserver.observe(content, {
	    childList: true,
	    subtree: true,
    });
}

function obstruct() {
  for (let i = 0; i < arr.length; i++) {
		arr[i] = `<div>${i}</div>`;
	}

	arr.map((item, idx) => {
		for(let i = 0; i < 3000; i++) console.log(1)
		content.innerHTML += item;
	});
}

```

##### 2. 监听图片/富文本编辑器/节点内容变化及处理

之前有一篇讲到`contenteditable`属性，使`DOM`可编辑，做富文本编辑器等应用。
对于此类的应用，例如过滤关键字或内容，阻止编辑（内容复原），以及无法删除的图片水印等一系列操作都可以简单实现(*附1*)

阻止编辑的简陋栗子：

```
// html
<div id="content">66666</div>

// js
function obsCallback(mutations, observer) {
    console.log(observer); // 观察者实例
    console.log(mutations); // 变动数组
    mutations.forEach(mutation => {
        if (mutation.target.contentEditable === 'true') {
            mutation.target.setAttribute('contenteditable', 'false');
        }
    })
}

function obs() {
    mutationObserver.observe(content, {
        // attributes: true,
        attributeFilter: ['contenteditable']
        // characterData: true,
        // childList: true,
        // subtree: true,
    });
}
```

*附：[实现水印的不可删除](https://segmentfault.com/a/1190000014808628)*


##### 3. 关于`vue`对于`MutationObserver`的应用

- `vue`框架在vue2.0之前，对于`MutationObserver`的应用在于`nextTick `；
原理是利用了`MutationObserver`异步回调函数在微任务队列中排列。
具体操作呢，创建一个新节点并观察，随意的更新一下它的内容就可以了。

- 什么？为啥是2.0之前，现在用了`MessageChannel`，什么是`MessageChannel`？那是下一个话题。

- 为什么要用`MutationObserver`，或者说它和`Promise`与`setTimeout `的区别在哪里。
`vue`优先级是`Promise` 、 `MutationObserver`、 `setTimeout `。
当`Promise`不兼容时选择`MutationObserver`，从功能和性能角度来说两者基本一致，只是实现略有麻烦，要新建一个节点随便动一下。
 `setTimeout `最后为了兼容备选使用，原因如下。

- 原因：
`MutationObserver`与`Promise`属于微任务，`setTimeout `属于宏任务；
在浏览器执行机制里，每当宏任务执行结束都会进行重新渲染，微任务则在当前宏任务中执行，可以最快的得到最新的更新，如果有对应的DOM操作（回想一下上一篇），在宏任务结束时会一并完成。
但如果使用`setTimeout `宏任务，更新内容需要等待队列中前面的全部宏任务执行完毕，并且，如果其中更新内容中有DOM操作，浏览器会渲染两次。

- 被弃用的原因：
一个兼容性BUG。对于`iOS UIWebView`，页面运行一段时间会中断，目前原生的`MutationObserver`并没有良好的解决办法，如果将`IOS10 Safari`和其他运行环境分开，有些多此一举。（换一个更好的兼容就是了）
[原回复](https://github.com/vuejs/vue/issues/3771)




参考引用：
1. [https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
2. [https://segmentfault.com/a/1190000012787829](https://segmentfault.com/a/1190000012787829)
3. [http://javascript.ruanyifeng.com/dom/mutationobserver.html](http://javascript.ruanyifeng.com/dom/mutationobserver.html)
4. [https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/dn265032(v=vs.85)](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/dn265032(v=vs.85))
