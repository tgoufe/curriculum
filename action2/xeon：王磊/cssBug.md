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


