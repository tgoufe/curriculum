---
title: svg 动画介绍（二）
date: 2019-08-22 16:30:00
tags: svg css
categories: svg css
---

今天继续讲svg的动画属性 animate、animateTransform、animateMotion（第二节）

<!--more-->

### SVG animation 时间值

首先来一发大师金句，迪士尼动画大师格里穆·乃特维克曾经说过：

动画的一切皆在于时间点和空间幅度。

在这先说一下，我们的课太会讲太深奥和与本篇无关的内容。

但是会简单的说明一下一些东西和概念，如果对动画有兴趣的同学可以去baidu一下。

动画制作和动效设计是本质相通的，我们需要为用户建立一种“视觉的真实”，即动作是可信的。这就需要物理学。

#### 牛顿第一定律和牛顿第二定律

OK  理论知识到这---

#### 时间值有那些属性

1、begin, end 开始时间

```xml
<circle r="20" cx="50" cy="30">
    <animateTransform attributeType="XML" attributeName="transform" 
        id="x" 
        begin="0s" 
        dur="2s" 
        type="translate" 
        from="0,0" 
        to="0,100"/>
    <animateTransform attributeType="XML" attributeName="transform" 
        begin="x.end" 
        dur="2s" 
        type="translate" 
        from="0,100" 
        to="100,100"/>
</circle>
```

![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/path-an_3.svg)

可以看到circle元素有两个动画元素。第二个动画里的begin值为x.end. x.end中的x就是上面一个animateTransform元素的id值，而end是动画元素都有的一个属性，动画结束的时间。因此，begin="x.end"意思就是，当id为x的元素动画结束的时候，执行动画。

2、calcMode, keyTimes, keySplines 时间速率

calcMode有那些属性

| 属性   |      描述      |
|:----------:|:-------------:|
| linear |   animateMotion元素以外元素的calcMode默认值。动画从头到尾的速率都是一致的。  |
| paced |通过插值让动画的变化步调平稳均匀。设置keyTimes属性无效|
| spline | 插值定义贝塞尔曲线。spline点的定义在keyTimes属性中，每个时间间隔控制点由keySplines定义。 |

keyTimes属性是分号分隔的时间值列表，用于控制动画的速率。列表中的每一个时间值对应于values属性列表中的一个值，并定义何时在动画中使用该值。每keyTimes列表中的每个时间值都被指定为介于0和1（含）之间的浮点值，表示与动画元素的持续时间成比例的偏移量。

keySplines属性值是一组三次贝塞尔控制点（默认0 0 1 1）每个控制点使用4个浮点值表示：x1 y1 x2 y2，值范围0~1。

```xml
<circle r="20" cx="50" cy="30">
    <animateTransform attributeType="XML" attributeName="transform" 
        dur="4s" type="translate" 
        values="0; 80; 200" 
        repeatCount="indefinite" 
        calcMode="linear"/>
</circle>
<circle r="20" cx="50" cy="80">
    <animateTransform attributeType="XML" attributeName="transform" 
        dur="4s" 
        type="translate" 
        values="0; 80; 200" 
        repeatCount="indefinite" 
        keyTimes="0; .8; 1" 
        calcMode="linear"/>
</circle>
<circle r="20" cx="50" cy="130">
    <animateTransform attributeType="XML" attributeName="transform" 
        dur="4s" 
        type="translate" 
        values="0; 80; 200" 
        repeatCount="indefinite" 
        calcMode="paced"/>
</circle>
<circle r="20" cx="50" cy="180">
    <animateTransform attributeType="XML" attributeName="transform" 
        dur="4s" 
        type="translate" 
        repeatCount="indefinite" 
        calcMode="spline" 
        values="0; 80; 200" 
        keyTimes="0; .8; 1"
        keySplines=".5 0 .5 1; 0 0 1 1"/>
</circle>
```

![图2](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/path-an_4.svg)

四组贝塞尔曲线图

![图5](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/svg-keySplines.png)

实际上就是values, keyTimes, keySplines三个人之间事情。values确定动画的关键位置，keyTimes确定到这个关键点需要的时间，keySplines确定的是每个时间点段之间的贝塞尔曲线，也就是具体的缓动表现。

3、click 元素点击

```xml
<circle r="50" cx="100" cy="80" id="x">
</circle>
<animate 
    begin="x.click" 
    dur="1s" 
    attributeName="fill" 
    from="black" 
    to="red"/>
```

![图3](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/path-an_5.svg)

最后我们再看一下实例

![图4](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/city.svg)