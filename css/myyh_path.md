---
title: svg path属性与动画实例
date: 2019-07-22 16:30:00
tags: svg css
categories: svg css
---

今天讲svg的path属性与关于它的动画实例

<!--more-->

### svg path属性

path元素是SVG基本形状中最强大的一个，它不仅能创建其他基本形状，还能创建更多其他形状。你可以用path元素绘制矩形（直角矩形或者圆角矩形）、圆形、椭圆、折线形、多边形，以及一些其他的形状，例如贝塞尔曲线、2次曲线等曲线。

path元素的形状是通过属性d来定义的，属性d的值是一个“命令+参数”的序列。

每一个命令都用一个关键字母来表示，比如，字母“M”表示的是“Move to”命令，当解析器读到这个命令时，它就知道你是打算移动到某个点。跟在命令字母后面的，是你需要移动到的那个点的x和y轴坐标。比如移动到(10,10)这个点的命令，应该写成“M 10 10”。这一段字符结束后，解析器就会去读下一段命令。每一个命令都有两种表示方式，一种是用大写字母，表示采用绝对定位。另一种是用小写字母，表示采用相对定位。

| path指令   |      描述      |
|:----------:|:-------------:|
| M(M X,Y) |  将画笔移动到指定的坐标位置。 |
| L(L X,Y) |    画直线到指定的坐标位置。   |
| H(H X) | 画水平线到指定的X坐标位置。 |
| V(V Y) | 画垂直线到指定的Y坐标位置。 | 
| S(S X2,Y2,ENDX,ENDY) | 简单贝赛曲线。 | 
| Q(Q X,Y,ENDX,ENDY) | 二次贝赛曲线。 | 
| C(C X1,Y1,X2,Y2,ENDX,ENDY) | 三次贝赛曲线。 | 
| T(T ENDX,ENDY) | 映射。 |
| A(A RX,RY,XROTATION,FLAG1,FLAG2,X,Y) | 弧线。 | 
| Z | 关闭路径，从当前点画一条直线到路径的起点。 |

> 注：以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位。

d="M 10 10 L 120 10 V 100 H 60 Z"

![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/myyh_path.svg)

维基百科上对于贝塞尔曲线描述很赞的Gif动画如下：

![图2](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/myyh.webp)

### path的stroke实例

之前的css3课程，讲过二点间连线的方法。里面的ps4例子我们再拿过来看看。

![图3](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ps4.svg)

用css3在做这个图形，我们有讲到，css3是可以做除了曲线外的其它图形。而svg里path的自定义路径是css3无法做到的。

这个svg图片里图形有line ellipse path组成，在下面的例子，我将把图形标签转换成path。方便我们来做动画特效。

这个效果是path路径的stroke-dashoffset属性从它的真实长度到0的渐变。

如何拿到path路径的长度，这里svg提供一个api。

someElement.getTotalLength();

```javascript
var length = pathDom.getTotalLength();
```

同样的效果，换个xbox one来看看

![图4](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/xbox.svg)

最后我们来看个path路径绘制文字的实例

![图4](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/path-test_1.svg)

方法是同一个path路径复制两份。分别给每个path定义不同stroke-width、stroke再配合stroke-dashoffset动画效果。

path的复制，他们所在画布的位置也相同，这样就出现了不同的叠加效果。

下节我们讲path路径一些复杂的图形交互。