---
title: css 伪类
date: 2019-09-07 16:30:00
tags: css css3
categories: css css3
---

今天开始讲css3中一个比较重要部分css伪类。

<!--more-->

### css3伪类

伪类是什么可以称做"幽灵类"，它是选择器的一种。

#### 1、拼接伪类

#### 2、结构伪类

伪类大多数都是结构上的，即它们指代文档中的标记结构。

首先强调，伪类始终指代所**依附的元素**而不是后代元素。以**元素做为首要选择**，这些我们在后面会详细说明。

##### 1-选择根元素

:root伪类选择文档的根元素。

在html中，根元素就是html，只有xml语言中，会有所不同。

> 小技巧 :root权重高于html选择器。
>



##### 2-选择空元素

:empty伪类可以选择没有任何子代的元素，甚至连文本节点也没有（如果元素内有空格或回车符除外）。

> 小技巧 用于判断子元素为组件模块是否有效。而本元素样式含有margin，padding等影响页面布局的样式。
>
> 如果组件无效为空，作为组件的边距样式也变为无效。

<style>
.empty:empty{
	display:none;
}
</style>
<div class="empty" style="margin-top:20px;padding:20px;background:red">
	<templates v-if="false">组件</templates>
</div>

##### 3-选择唯一的子元素

它选择的元素是相对父元素的唯一子元素。

:only-child与:only-of-type，他们的用法一样。

:only-child与:only-of-type都是选择唯一子元素，区别在于:only-child是父元素的唯一元素，:only-of-type是父元素下同胞中唯一的元素。

> 小技巧 从他们的后缀单词的字面意思可以理解。
>
> type表示类型，一类元素，比如都是p元素或者div元素。child表示子元素，没有什么限制。

##### 4-选择第一个和最后一个子元素

:first-child

:last-child

> 小技巧 :only-child和:only-of-type可以用其它方法实现。

```css
:only-child{
	style
}
//等于
:first-child:last-child{
	style
}
```

```
:only-of-type{
	style
}
//等于
:first-of-type:last-of-type{
	style
}
```

