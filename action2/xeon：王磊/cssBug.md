---
title: css常见bug与解决方法 
date: 2019-12-17 16:30:00
tags: html css3
categories: html css3
---

今天讲css有那些常见bug。

<!--more-->

# css bug合集

总结了一些目前还存在的css bug，不过css最多的bug是针对IE浏览器，本篇不讲解IE下的css bug，有这方面兴趣的同学，可以自行百度。

## 常见bug

### 1、margin顶部塌陷问题

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

### 2、兄弟元素margin垂直距离重叠问题

方法一：将这两个兄弟元素放入不同的父元素中。（不推荐）

方法二：只使用一个外边距即可。

```html
<div class="floatBox">
		<div style="background-color: black;margin-bottom: 50px;height:100px;"></div>
		<div style="background-color: red; margin-top: 100px;height:100px;"></div>
</div>
```

### 3、浮动流无法被块级元素发现的问题

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

### 4、子div固定宽大于窗口宽度，右边不显示问题

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

### 5、图片下面空白问题

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

### 6、flex布局下，a元素为固定宽，b元素内容过宽导致a元素被挤压。

方法：为a元素设置样式flex-shrink:0。

```css
flex-shrink:0;
```

```html
<div class="flex-container">
  <div>icon</div>
  <div>内容内容内容内容内容内容内容...</div>
</div>
```



## 移动端bug

### 1、iphone端input框一些问题

#### input框自动填充内容背景颜色为黄色

方法：给input加一个最大边距的白色内阴影。

```css
input:-webkit-autofill { box-shadow: 0 0 0px 1000px white inset;}
```

#### 默认input框有阴影

方法：清除Input默认样式

```css
input {
  overflow: visible;
  outline:none;
  -webkit-appearance: none;
}
```

#### 默认input框有园角

方法：border-radius修改默认样式。

```css
input{
  border-radius:0;      
}
```

#### 去除input获取焦点时出现的默认边框

方法：去掉默认outline样式

```css
outline:none
```

### 2、点击元素时出现灰色阴影背景

方法：修改默认样式颜色。

```css
-webkit-tap-highlight-color:rgba(255,255,255,0);
```

### 3、页面的手机号码会被识别

方法：添加meta属性。

```html
<meta name="format-detection" content="telephone=no" />
```

### 4、部分Android手机圆角效果失效

方法：修改background-clip背景区域

```css
background-clip:padding-box;
```

### 5、0.5px边框问题

方法：利用伪类加缩放方法。

#### 单独一条边框

```css
.borderRadius{
	border:1px solid red;
	width:300px;
	height:100px;
	border-radius: 20px;
	position: relative;
}
.borderRadius:after{
	content: '';
	position: absolute;
	width:100%;
	border-top:1px solid black;
	transform: scaleY(0.5);
}
```

```html
<div class="borderRadius"></div>
```

#### 带圆角的四边框
```css
.borderRadius{
	border:1px solid red;
	width:300px;
	height:100px;
	border-radius: 20px;
	position: relative;
}
.borderRadius:after{
	content: '';
	position: absolute;
	width:200%;
	height: 200%;
	left:-50%;
	top:-50%;
	border-radius: 40px;
	border:1px solid black;
	transform: scale(0.5);
}
```
```html
<div class="borderRadius"></div>
```