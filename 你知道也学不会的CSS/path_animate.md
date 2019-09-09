---
title: svg 动画介绍（一）
date: 2019-08-07 16:30:00
tags: svg css
categories: svg css
---

今天讲svg的动画属性 animate、animateTransform、animateMotion（第一节）

<!--more-->

### SVG 动画元素

animate、animateTransform、animateMotion

#### 1、animate

基础动画元素。实现单属性的动画过渡效果。


| 属性   |      描述      |
|:----------:|:-------------:|
| attributeName |    要变化的元素属性名称。   |
| from | 动画的起始值。 |
| to | 指定动画的结束值。 | 
| dur | 常规时间值或indefinite无限。 | 
| repeatCount | 表示动画执行次数或indefinite无限。 | 

> 注：同一个图形元素可以设置单个或多个动画元素

```xml
<circle r="20" cx="50" cy="100">
    <animate attributeName="cx" from="50" to="220"
    dur="3s" repeatCount="indefinite"></animate>
    <animate attributeName="fill" from="black" to="red"
    dur="3s" repeatCount="indefinite"></animate>
    <animate attributeName="r" from="20" to="50"
    dur="3s" repeatCount="indefinite"></animate>
</circle>
```
![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/path-an_1.svg)

从代码上可以看到在circle图形设置了三个动画属性

1、圆心坐标cx从50到220

2、圆的填充颜色从黑到红过渡

3、圆的半径从20到50

统一设置过渡时间为3s，执行次数为无限次。

svg animate动画效果是叠加的，不是replace。

#### 1、animateTransform

实现transform变换动画效果的。

在这之前我们简单看一下transform的属性参数

| 属性   |      描述      |
|:----------:|:-------------:|
| translate(x-value, y-value) |    偏移。沿x轴方向偏移x-value个单位长度，沿y轴方向偏移y-value个单位长度。   |
| scale(x-value, y-value) |    缩放。x轴方向上的长度变为原来的x-value倍，y轴方向上的长度变为原来的y-value倍。   |
| rotate(angle,[centerX, centerY]) | 默认以坐标系中(0,0)原点为圆心，顺时针旋转angle度。 |
| skewX(angle) skewY(angle) | skewX和shewY可以使x轴和Y轴歪斜。 |

> 注：css中提供了一套与svg形变一致的transform属性

之后的课会讲如何用css3来实现svg动画

这是animateTransform属性参数

| 属性   |      描述      |
|:----------:|:-------------:|
| attributeName |    要变化的元素属性名称。   |
| attributeType |    支持三个固定参数，CSS/XML/auto. 用来表明attributeName属性值的列表。   |
| type | 选择transform属性。 |
| from | 动画的起始值。 |
| to | 指定动画的结束值。 |
| values | 用分号分隔的一个或多个值，可以看出是动画的多个关键值点。 |
| dur | 常规时间值或indefinite无限。 | 
| repeatCount | 表示动画执行次数或indefinite无限。 | 

![图2](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/path-an_2.svg)

```xml
<circle r="20" cx="50" cy="30">
    <animateTransform attributeType="XML" attributeName="transform" begin="0s" dur="2s" type="translate" values="0,0; 0,20; 200,20" repeatCount="indefinite"/>
</circle>
<circle r="20" cx="50" cy="80">
    <animateTransform attributeType="XML" attributeName="transform" begin="0s" dur="2s" type="scale" from="1" to="1.5" repeatCount="indefinite"/>
</circle>
<rect x="120" y="150" width="100" height="50">
    <animateTransform attributeType="XML" attributeName="transform" begin="0s" dur="2s" type="rotate" from="0 170 175" to="-180 170 175" repeatCount="indefinite"/>
</rect>
<rect x="60" y="260" width="100" height="50">
    <animateTransform attributeType="XML" attributeName="transform" begin="0s" dur="2s" type="skewX" from="0" to="20" repeatCount="indefinite"/>
</rect>
```

代码依次

1、圆先Y轴向下移到20再X轴向右移到200。

2、圆放大1.5倍。

3、以矩形为中心，旋转矩形。

3、矩形X轴的扭曲20。


下面我们看一个实例，来更好的了解一下。


![图3](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/city.svg)


上面的实例，用到svg的分组元素g和引用元素use

g元素（“group”的简写），用于给逻辑上相联系的图形元素分组。

use元素用于引用文档中其它位置定义的元素。你可以重用已有的元素。

```xml
<g transform="translate(0, 100)" id="car">
    <path d="..."></path>
    <path d="..."></path>
    <path d="..."></path>
</g>
<use xlink:href="#car" transform="translate(450,0)"/>
```

svg 动画部分还有很多更有意思的属性和事件，我们在之后的课程里陆续介绍给大家。

