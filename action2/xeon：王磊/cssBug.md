---
title: html语义规范与css规范
date: 2019-12-17 16:30:00
tags: html css3
categories: html css3
---

今天讲css有那些常见bug。

<!--more-->

# css bug合集

总结了一些目前还存在的css bug，不过css最多的bug是针对IE浏览器，本篇不讲解IE下的css bug，有这方面兴趣的同学，可以自行百度。

## 1、margin顶部塌陷问题

方法一：给父元素加一个顶边框。（不推荐）

方法二：块级格式化（BFC）,父元素触发BFC，改变div内部的渲染规则。（这么做，说白了就是内部div不会影响外部div）

浮动元素，float 除 none 以外的值； 
定位元素，position（absolute，fixed）； 
display 为以下其中之一的值 inline-block，table-cell，table-caption； 
overflow 除了 visible 以外的值（hidden，auto，scroll）；

```html
<div style="height: 200px; background:black; margin-top:20px;">
		<div style="width: 50%; height: 100px; background:red; margin-top:50px;">
</div>
```



## 2、兄弟元素margin垂直距离重叠问题

方法一：将这两个兄弟元素放入不同的父元素中。（不推荐）

方法二：只使用一个外边距即可。

```html
<div class="floatBox">
		<div style="background-color: black;margin-bottom: 50px;height:100px;"></div>
		<div style="background-color: red; margin-top: 100px;height:100px;"></div>
</div>
```

## 3、浮动流无法被块级元素发现的问题

方法一：在浮动元素下方添加一个块元素并添加清除浮动的样式，由于添加了多余的结构。（不推荐）

方法二：给父元素的伪元素添加清除浮动的样式，伪元素为行元素需要转换成块元素才能使用clear。

```css
.boxOne {
	float: left;
	background-color: pink;
	height: 100px;
	width: 200px;
}
.boxTwo {
	float: left;
	background-color: skyblue;
	height: 100px;
	width: 200px;
}
.floatBox::after {
		content: '';
		display: block;
		clear: both;
}
```

```html
<div class="floatBox">
		<div class="boxOne"></div>
		<div class="boxTwo"></div>
</div>
```

## 4、子div固定宽大于窗口宽度，右边不显示问题

方法一：在父div加入min-width属性，值与子div宽度一样。

```css
.chrome{
		background:red;
		min-width: 1000px;
}
.chrome div{
		width:1000px;
}
```

```html
<div class="chrome">
		<div>浏览器</div>
</div>
```

## 5、图片下面空白问题

方法一：将img变成块级元素，display:block。

方法二：将img的vertical-align默认属性改成，vertical-align: middle。

方法三：把img元素的底部外边距改成负值。（不推荐）

方法四：把img的父元素font-size设成0。（不推荐）

方法五：把img的父元素line-height设成0。（不推荐）

```html
<div style="background:red">
		<img src="bingshanbear.svg" alt="">
</div>
```

