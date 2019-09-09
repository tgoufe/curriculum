---
title: svg stroke属性与动画实例
date: 2019-07-05 16:30:00
tags: svg css
categories: svg css
---

今天讲svg的stroke属性与关于它的动画实例

<!--more-->

### SVG stroke属性

SVG支持多个笔画stroke属性

它可以作用在所有图形属性

| Stroke类型   |      描述      |
|:----------:|:-------------:|
| stroke    |  属性定义了给定图形元素的外轮廓的颜色。它的默认值是none。 |
| stroke-width |    定义任何元素的文本，线条或轮廓的粗细   |
| stroke-opacity | 指定了当前对象的轮廓的不透明度。它的默认值是1。 |
| stroke-linecap | 定义不同类型的结束行或任何路径的轮廓。butt、round、square、inherit | 
| stroke-dasharray | 用于创建实线与虚线 |
| stroke-dashoffset | 相对于绘制的起点偏移的量，正值(向左或者逆时针)/负值(向右或者顺时针)偏移设置参数的大小 | 

#### stroke-dasharray 实线虚线

参数必须大于0才能达到虚实线的效果。

stroke-dasharray如果参数个数是单数是默认会复制一份参数，比如1 2 3 将会变成1 2 3 1 2 3六个参数

实线和虚线超过线段的等长将会隐藏。

```xml
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 200 200">  `<line stroke="black" stroke-width="1" style="stroke-dasharray:100;stroke-dashoffset:0" stroke-linecap="butt" x1="0" y1="20" x2="100" y2="20"/>
  <line stroke="black" stroke-width="1" style="stroke-dasharray:20;stroke-dashoffset:0" stroke-linecap="butt" x1="0" y1="20" x2="100" y2="20"/>
  <line stroke="black" stroke-width="1" style="stroke-dasharray:20 10;stroke-dashoffset:0" stroke-linecap="butt" x1="0" y1="40" x2="100" y2="40"/>
  <line stroke="black" stroke-width="1" style="stroke-dasharray:2 2 5;stroke-dashoffset:0" stroke-linecap="butt" x1="0" y1="60" x2="100" y2="60"/>
  <line stroke="black" stroke-width="1" style="stroke-dasharray:1 1 2 1 4 1 2 1;stroke-dashoffset:0" stroke-linecap="butt" x1="0" y1="80" x2="100" y2="80"/>
  <line stroke="black" stroke-width="1" style="stroke-dasharray:1 1 2 1 3 1 4 1 5 1 6 1 7 1 8 1 9 1 10 1 11 1 12 1 13 1;stroke-dashoffset:0" stroke-linecap="butt" x1="0" y1="100" x2="100" y2="100"/>
</svg> 
```



![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/img-myyh_1.png)

#### stroke-dashoffset 实线虚线的起点偏移量

stroke-dashoffset如果使用了一个 <百分比> 值， 那么这个值就代表了当前viewport的一个百分比。

stroke-dashoffset是闭包循环

正值是逆时针，负值是顺时针

```xml
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 200 200">
    <line stroke="red" stroke-width="1" style="stroke-dasharray:100%;stroke-dashoffset:0" stroke-linecap="butt" x1="0" y1="30" x2="100" y2="30"/>
    <line stroke="black" stroke-width="1" style="stroke-dasharray:100;stroke-dashoffset:0" stroke-linecap="butt" x1="0" y1="50" x2="100" y2="50"/>
    <line stroke="green" stroke-width="1" style="stroke-dasharray:100%;stroke-dashoffset:0" stroke-linecap="butt" x1="0" y1="90" x2="200" y2="90"/>
</svg>
```
![图2](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/img-myyh_2.png)

stroke-dasharray在svg其它图形属性的表现

![图3](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/svg-test_3.svg)


实例stroke-dasharray与stroke-dashoffset的无指针钟

![图4](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/svg-test_4.svg)

下一节，我们继续研究stroke在path路径下的应用

![图5](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/myyh.svg)