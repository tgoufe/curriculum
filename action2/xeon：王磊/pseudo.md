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

css允许伪类串联在一起。

```css
a:link:hover{color:red;}
```

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
```html
<style>
.empty:empty{
	display:none;
}
</style>
<div class="empty" style="margin-top:20px;padding:20px;background:red">
	<templates v-if="false">组件</templates>
</div>
```
##### 3-选择唯一的子元素

它选择的元素是相对父元素的唯一子元素。

:only-child与:only-of-type，他们的用法一样。

:only-child与:only-of-type都是选择唯一子元素，区别在于:only-child是父元素的唯一元素，:only-of-type是父元素下同胞中唯一的元素。

> 小技巧 从他们的后缀单词的字面意思可以理解。
>
> type表示类型，一类元素，比如都是p元素或者div元素。child表示子元素，没有什么限制。

后面介绍的伪类选择器后缀是child，of-type意思都是一样的。

##### 4-选择第一个和最后一个子元素

:first-child与first-of-type

:last-child与last-of-type

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

##### 5-选择每第n个子元素或某种元素

:nth-child与:nth-of-type(an+b)	首先查找当前所有匹配的兄弟元素，

:nth-last-child与:nth-last-of-type(an+b)	他们的用法跟上面一样，不过顺序是倒序开始。

#### 3、动态伪类

##### 1-超链接伪类

定义了两个只能在超链接上的伪类。

:link 未访问的链接	 :visited 已访问的链接

##### 2-用户操作伪类

:focus 获得输入焦点的元素。

:hover 鼠标指针悬停在元素或超链接上。

:active 用户单击超链接按下鼠标的那段时间。

#### 4、UI状态伪类

| 伪类           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| :enabled       | 指代启用的用户界面元素（比如表单元素），即接受输入的元素。   |
| :disabled      | 指代禁用的用户界面元素（比如表单元素），即接受输入的元素。   |
| :checked       | 指代由用户或文档默认选中的单选按钮或复选框。                 |
| :indeterminate | 指代既没有选中也没有未选中的单选按钮或复选框，这个状态只能由DOM脚本设定。 |
| :default       | 指代默认选中的单选按钮、复选框或选项。                       |
| :valid         | 指代满足所有数据有效性语义的输入框。                         |
| :invalid       | 指代不满足所有数据有效性语义的输入框。                       |
| :in-range      | 指代输入的值在最大值和最小值之间的输入框。                   |
| :out-of-range  | 指代输入的值不在最大值和最小值之间的输入框。                 |
| :required      | 指代必须输入值的输入框。                                     |
| :optional      | 指代不需要一定输入值的输入框。                               |
| :read-write    | 指代可由用户编辑的输入框。                                   |
| :read-only     | 指代不能由用户编辑的输入框。                                 |

虽然UI元素的状态可由用户操作而改变，但是UI状态伪类不是单纯动态的，因为它们还受文档结构或DOM脚本的影响。

#### 5、否定伪类

:not()选择不匹配的东西

> 小技巧 优化代码
```html
<ul>
	<li>首页</li>
	<li>新闻</li>
	<li>关于</li>
	<li>分享</li>
	<li>联系</li>
</ul>
```
```css
li{
  border-bottom:1px solid blue
}
li:last-child{
  border-bottom:0;
}
```
用not()属性
```css
li:not(:last-child){
	border-bottom:1px solid blue
}
```

:not()伪类不能嵌套，可以串联使用。

#### 6、:target伪类

#### 7、:lang伪类

#### 8、伪元素选择符

:before与:after在元素之前或之后插入某些内容。

伪元素要配合content属性一起使用。

content属性可以直接利用attr获取元素的属性。

```css
img:after{
  content:attr(alt);
}
```

> 小技巧 这里会有一个被问到最多的问题，那就是伪类与伪元素的区别。

**伪类**

字面意思假的类。伪类其实是弥补了CSS选择器的不足，用来更方便地获取信息。

**伪元素**

字面意思假的元素。伪元素本质上是创建了一个虚拟容器(元素)，我们可以在其中添加内容或样式。

##### before与after伪元素



综合实例

分页