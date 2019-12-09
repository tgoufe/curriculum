---
title: 认识SVG——实例悖论空间
date: 2019-06-20 16:30:00
tags: svg css
categories: svg css
---

本篇开始帮助大家了解SVG，和部分SVG的属性代码。并通过实例更进一步理解SVG能做些什么。

<!--more-->

### 了解SVG

svg 是代码里的艺术。



SVG已经存在很多年了。先前的SVG技术，由于缺乏浏览器厂商的和人们对这种技术的理解，曲折地发展了一段时间，但是现在它以优秀的兼容性重树威信，在开源社区拥有了很高的地位，以下是SVG的一些优点。

1、数据可视化

	可直观地表达真实的数据。
	
2、设备响应式

	SVG可用一张矢量缩放图来兼容各种设备。
	
3、性能表现

	正确地构建SVG，并减少路径点和简化图形细节（优化手段）
	
4、可制作的DOM结构

	拥有一体化DOM结构的SVG，意味着你的代码可以为屏幕阅读器提供更多的信息。


### 一、什么是SVG

可缩放矢量图（SVG）是一种图片格式，这种格式的优点有以下几点。

1、SVG图片是可绽放的。

2、矢量图，使用了数学方法绘制，图片文件有更好的质量和更小的体积。

> 注：矢量图与位图的区别

### 二、svg DOM语法

```xml
<svg x="0px" y="0px" width="450px" height="200px" viewBox="0 0 450 200">
  <rect x="10" y="5" fill="white" stroke="black" width="90" height="90"/>
  <circle fill="white" stroke="black" cx="170" cy="50" r="45"/>
  <ellipse fill="white" stroke="black" cx="80" cy="150" rx="70" ry="45"/>
  <polyline fill="none" stroke="black" points="170,150 210,170 180,120 240,130 270,190"/>
  <polygon fill="white" stroke="black" points="279,5 294,35 328,40 303,62 309,94 279,79 248,94 254,62 230,39 263,35"/>
  <line fill="none" stroke="black" x1="310" y1="195" x2="340" y2="106"/>
</svg>
```

这个SVG的结构，大部分标签对于我们来说都很熟悉。由于和HTML相通，SVG的语法也是简单易读。

#### viewBox


svg的viewBox是一个非常强大的属性，有它svg画布可以无限延伸。

viewBox 的四个参数分别代表：左上角横坐标；左上角纵坐标；宽度；高度。

一般前面两个值不需要修改，设置为0就可以，除非你需要视口在画布里发生位移。

viewBox的值没有带单位，这是因为svg可视空间并不是基于像素来设定的，而是一个可任意延伸的空间，这样就可以适应这么多不同的尺寸。

```xml
<svg x="0px" y="0px" 
    width="2560" height="1440"
    viewBox="0 0 2560 1440">
    <image x="0" y="0"
    width="2560" height="1440"
    xlink:href="136775470.jpg" />
</svg>
```

![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/136775470.jpg)

### 三、绘制图形

在上面的代码里，SVG定义了6种不同的形状。

rect 定义矩形或正方形，其中的x和y属性，相对于<svg>元素进行定位。fill填充色、stroke描边色。

circle 定义圆，cx,cy定义的圆的圆心坐标，r为圆的半径。

ellipse 定义椭圆，cx,cy跟定义圆一样，rx为椭圆水平半径，ry为椭圆垂直半径。

line 定义线，x1,y1为线的起点值，x2,y2为线的终点值。

polyline 定义折线，points属性指定了每个端点的坐标，坐标之间用逗号分隔，点之间用空格分隔。

polygon 定义多边形，points属性跟折线一样。
   
![图2](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/svg-test_1.png)


还有一种绘图方式 path 路径 这个会在之后详细来讲。



实例

### 悖论空间

#### 利用AI软件制作的悖论空间模板

![图3](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ant_ai.png)

svg的复杂图形绘制，离不开矢量绘图软件，单纯的以代码制做复杂图形是办不到的。

#### css模拟绘出悖论空间

![图4](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ant_css.png)

用css与js结合的悖论空间，只是利用三维数组x y z输出想要的图形块。

它只能简单的输出，不能做成绘图小工具。

#### svg与js结合的悖论空间生成小工具

![图5](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ant_svg.png)

通过ai工具，生成svg图片，再利用js对svg dom做path 路径 fill上色方法。



下节讲 svg图形 非常有意思的一个属性stroke(描边)。