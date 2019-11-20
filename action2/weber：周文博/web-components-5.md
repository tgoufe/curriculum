---
title: Web Components 介绍（五）
date: 2019-11-20 10:35:25
tags:
  - 组件化
  - 框架
  - JavaScript
  - WebComponents
---

扣点细节

<!--more-->

# Web Components 介绍（五）

## 一些很少见的方法

在查看 `MDN` 上示例代码的时候，注意到一个有趣的是，有时候代码中使用的是 `cloneNode()` 方法，有时候使用的是 `importNode()` 方法，查看 `importNode` 方法在 `MDN` 上的描述：

> 将外部文档的一个节点拷贝一份,然后可以把这个拷贝的节点插入到当前文档中

再看 `cloneNode` 方法的描述：

> Node.cloneNode() 方法返回调用该方法的节点的一个副本

这样看来最大的区别就是“外部文档”了，到底什么事外部文档，`MDN` 上给的示例是从 `iframe` 页面中复制 `DOM` 对象到页面中，但是在实际测试后，发觉和 `cloneNode` 方法并没有什么不同 

```html
<iframe id="iframe" src="./iframe.html" frameborder="0"></iframe>

<script>
document.getElementById('iframe').addEventListener('load', (e)=>{
	let cloneDom = e.target.contentDocument.getElementById('contentNode').cloneNode( true )
		, importDom = document.importNode(e.target.contentDocument.getElementById('contentNode'), true)
		;       

	document.body.appendChild( cloneDom );
	document.body.appendChild( importDom );
});
</script>
```

查找资料，每个节点都有一个 `ownerDocument` 属性，表示所属的文档。如果调用 `appendChild()` 方法时传入的节点属于不同的文档（`ownerDocument` 属性的值不一样），则会导致错误。但在调用 `importNode()` 时传入不同文档的节点则会返回一个新节点，这个新节点的所有权归当前文档所有

输出上面示例代码中 `cloneDom.ownerDocument` 和 `importDom.ownerDocument`，结果分别指向 `iframe` 中的 `document` 和当前页面的 `document`，目前还没有发现怎样操作才会出现错误。。。根据查到的资料，目前所有浏览器都不会报错，但是按照规范是应该报错的。。。

另外查资料，这个方法在 `HTML` 中并不常使用，在 `XML` 文档中使用的较多，毫无疑问 `XML` 的规范执行更严格。。。

与其类似的还有 `adoptNode()` 方法，该方法会从原文档删除这个节点，并使它的 `ownerDocument` 属性变成当前的 `document` 文档

## CSS 的作用域

作用域 `CSS` 是 `Shadow DOM` 最大特性之一：

* 外部页面的 `CSS` 选择器不应用与组件内部
* 组件内定义的样式不会影响页面的其它元素，它们的作用域是宿主元素

在之前，规范提出过，在 `&lt;style&gt;` 上添加 `scoped` 属性来实现 `CSS` 作用域功能，但是会引起其他问题，所以还无法使用。虽然 `Vue` 提供了 `scoped` 实现，但是我个人并不喜欢它的方式，而且有时候也并不灵活

`Shadow DOM` 是一个不错的实现 `CSS` 作用域的方式，虽然有点麻烦。。。

## CSS 伪类

* `:defined` 伪类

`Web Components` 提供了 `:defined` 伪类表示任何已定义的元素

```css
:defined p{
		color: green;
	}
:defined ul{
    color: cyan;
}
my-component:defined{
    color: blue;
}
```

可以使用这种方式来对自定义组件进行样式设置，也可以对 `slot` 元素的样式进行设置，另外 `MDN` 还提供了一个使用方法，在你有一个复杂的自定义元素需要一段时间才能加载到页面，或者延迟加载的时候，隐藏元素的实例直到定义完成为止：

```css
my-component:not(:defined){
  display: none;
}

my-component:defined{
  display: block;
}
```

* `:host` 伪类

使用 `:host` 伪类选择器，用来选择组件宿主元素中的元素（相对于组件模板内部的元素）

当涉及到 `:host` 选择器时，应该小心一件事：父页面中的规则具有比元素中定义的 `:host` 规则具有更高的优先级，这允许用户从外部覆盖顶级样式。而且 `:host` 只在影子根目录下工作，所以你不能在 `Shadow DOM` 之外使用它

* `:host()` 伪类函数

`:host()` 选择包含使用这段 `CSS` 的 `Shadow DOM` 的宿主（这样就可以从 `Shadow DOM` 中选择包括它的自定义元素）——但前提是该函数的参数与选择的阴影宿主相匹配，如：

```css
:host(my-component){
    font-weight: bolder;
}
```

* `:host-context()` 伪类函数

`:host-context()` 伪类的作用是选择 `Shadow DOM` 中 `shadow host`，这个伪类内可以写关于该 `shadow host`的 `CSS` 规则。 (我们可以从 `Shadow DOM` 中选择一个自定义元素 `custom element`) — 但前提是，在 `DOM` 层级中，括号中的选择器参数必须和 `shadow host` 的祖先相匹配，如：
```css
:host-context(div){
    color: cadetblue;
}
:host-context(p){
    color: chartreuse;
}
```

`:host` 伪类暂时没有想到使用场景，`:host()` 和 `:host-context()` 可以在将所用自定义组件的样式打包在一起时用来区分各个组件