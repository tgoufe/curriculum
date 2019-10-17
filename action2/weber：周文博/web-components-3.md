---
title: Web Components 介绍（三）
date: 2019-10-17 11:23:25
tags:
  - 组件化
  - 框架
  - JavaScript
  - WebComponents
---

这次研究点新东西

<!--more-->

# Web Components 介绍（三）

## 自定义元素

上一篇讲了 `Shadow DOM`，其中提到支持创建 `Shadow DOM` 的 `HTML` 只有 18 个，但是它们都是标准中常规标签，本身的语义比较抽象，而且都说了组件化，你不可能每个组件都使用 `div` 或者 `section` 这样太常见的东西来实现，那么必然想到要自定义元素

在 `Web Components` 中，提供了 `customElements.define` 方法来创建自定义元素，参数如下：

|  名称  |  可选  |  描述  |
|:-----:|:-----:|:-----|
|  name  |    |  自定义元素名  |
|  constructor  |    | 自定义元素构造器 |
|  options  |  可选  |  控制元素如何定义  |

其中，`name` 必须用小写字母开头，并且至少有一个连字符，`options` 目前只有一个选项支持：`extends`，指定继承的已创建的元素，被用于创建自定义元素

重头戏就是 `constructor` 了，目前可以创建两种类型的自定义元素：

+ 自主定制元素：独立元素；它们不会从内置 `HTML` 元素继承，该构造器要继承 `HTMLElement` 对象
+ 自定义内置元素：这些元素继承自并扩展内置 `HTML` 元素，该构造器要继承 `HTMLParagraphElement` 对象

然后，仅仅只有构造器还是不行的，`Web Components` 为自定义元素提供了生命周期回调，是一些在自定义元素的类定义中的特殊回调函数，将会影响其行为：

+ `connectedCallback`，当自定义元素第一次被连接到文档 `DOM` 时被调用 
+ `disconnectedCallback`，当自定义定义元素与文档 `DOM` 断开连接时被调用
+ `adoptedCallback`，当自定义元素被移动到新文档时被调用
+ `attrbuteChangedCallback`，当自定义元素的一个属性被增加、移除或更改时被调用

// 我们需要两个东西：一个定义元素行为的类，以及一个告诉浏览器如何关联 DOM 元素标签和刚才那个类的定义