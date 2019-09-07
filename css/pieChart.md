---
title: css3 数据图形之——饼状图的实现
date: 2019-05-07 16:30:00
tags: css
categories: css
---

从这期开始，会用几期时间来讲一个前端比较重要的东西——数据图表

<!--more-->

# css3 数据图形之——饼状图的实现

大家知道web页的数据图表基本上都是由canvas或svg配合javaScript来实现。

图形表大致有 饼图、雷达图、对比图、折线图、条形图、曲线图、面积图、柱形图、圆环图、气泡图

![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/map.jpg)

在前面几期，讲了几个css图形制做方法。
- clip-path 裁剪路径

- border三角形

- 利用linear-gradientg线性渐变——两点间的连线

那今天再讲一个新图形制做技巧

## 圆弧的终点坐标

那为什么要讲这个，因为把以上四个css图形技巧结合起来，就能用css开发绝大部分数据图表。（除了曲线图表）

> 注：本篇第一张图显示的数据图表，都能开发。
  
OK，那现在就用 **圆弧的终点坐标** 方法制作一个数据图形表——饼图。

![图2](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/1.png)

目前网上能搜到的用css开发饼图，绝大部分方法的核心思想是。

先在dom做一个两色平分圆图形。左侧颜色为背景色或透明色，右侧为饼图色

再用一个dom元素或伪类元素用同样方法做图形，左右都是跟第一个dom一样的背景色，然后覆盖整个dom。

最后通过旋转元素实现饼图，如果显示的饼图超过半圆大小，则改变元素左右颜色。

[详细方法请看此链接](https://blog.csdn.net/weixin_33936401/article/details/87134761)

这个方法缺点只能做简单或单纯的饼图，优点是它可以实现饼图的展开动效。

下面来看圆弧的终点坐标方法的实现

它的核心思想取弧线的终点坐标 x,y 。

如图

![图3](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/test_1.png)

具体方法如下：

```javascript
function cssCircle(rad,x,y,r){
    var rad = document.getElementById("rad").value || 0;
    if (rad <= 0 || rad > 360) {
        alert('请输入有效角度值');
        document.getElementById("rad").value = '';
        return
    }
    var x = x,
        y = y,
        r = r,
        a = rad,
        aa = a*Math.PI/180,                     //角度转换
        lx = x,
        ly = y,
        sinLx = (lx+(Math.sin(aa)*r))+'px ',    //角弧度终点x
        cosLy = (ly-(Math.cos(aa)*r))+'px ',    //角弧度终点y

        center = '50% 50%, ',                     //画布中心点
        top = '50% 0, ',                          //画布top点
        topRight = '100% 0, ',                    //画布topRight点
        right = '100% 50%, ',                     //画布right点
        rightBottom = '100% 100%, ',              //画布rightBottom点
        bottom = '50% 100%, ',                    //画布bottom点
        bottomLeft = '0 100%, ',                  //画布bottomLeft点
        left = '0 50%, ',                         //画布left点
        leftTop = '0 0, ',                        //画布leftTop点


        dd = center + top,      //图形起始点

        dd_90 = dd + topRight, //小于90度图形起始点
        dd_180 = dd + topRight + right + rightBottom, //大于90度小于180图形起始点
        dd_270 = dd + topRight + right + rightBottom + bottom + bottomLeft, //大于180度小于270图形起始点
        dd_360 = dd + topRight + right + rightBottom + bottom + bottomLeft + left + leftTop; //大于270度小于360图形起始点

        
        if(a>270){
            dd = dd_360;
        }else if(a>180){
            dd = dd_270;
        }else if(a>90){
            dd = dd_180;
        }else{
            dd = dd_90;
        }

        dd += sinLx + cosLy
        dd = 'clip-path: polygon('+dd+');'

        var styles = '.circle{' +dd+'}';
        var style = document.createElement('style');
        style.type="text/css";
        style.appendChild(document.createTextNode(styles));
        document.body.appendChild(style);

    return dd
}
```
> 这个方法的实现原理是用css3属性 clip-path:polygon()切出一个饼图
  
首页在一个的画布里做饼图，我们要先了解几个已知关键属性：

| 参数   |      说明      |
|:----------:|:-------------:|
| cx,cy    |  饼图圆心坐标 |
| R |    饼图半径   |
| rad | 饼图角度值 | 
| x,y | 饼图弧线终点坐标 | 

在这些参数中前三个，我们都能轻松拿到。

而饼图弧线终点坐标这个是如何得到的？



利用数学公式

**x = cx + R * Math.sin (rad * Math.PI / 180)**

**y = cy - R * Math.cos (rad * Math.PI / 180)**

OK 现在已经拿到能画出饼图的所有属性值了

- 那现在的条件是 宽、高为400px的画布
    ```css
      .circle{
        width:400px;
        height:400px;
      }
    ```
- 圆心坐标
  
  cx:200px，cy:200px
  
- 饼图的半径
  
    R:200px
- 角度值

    rad:60度
    
    取到的圆弧终点 x,y（四舍五入）
    
    x:373.2px
    
    y:100px

再将已知得到的参数换成坐标放入clip-path之前，我们要先知道，画饼图需要那些点。

![图4](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/test_2.png)

图上这9个点是画饼图能用到的。其中圆心点、top点、topRight三个点， 是必用到的。

那我们按上面的得到的参数来画饼图。



首先饼图起始点是圆心点，再是top点

那为什么要向上到top点，这是根据圆弧计算公式起始两点是12点钟方向为0度。角度值按顺时针方向。

注：角度值可顺时也可逆时，在饼图里我们只做顺时计算。



那么最后的坐标值

clip-path:polygon(50% 50%, 50% 0, 100% 0, 373.2px 100px )

![图5](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/test_4.png)

换个方式显示clip-path:polygon(圆心点, top点, topRight点, 373.2px 100px )


![图6](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/1.png)

一个60度的饼图就实现了

那么如果不加右上角的topRight点，会是什么样的？

![图7](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/test_3.png)



少了一点，则变成了一个等边三角形。

所以在取不同角度的饼图，除了圆心点、top点和圆弧终点。其它点是怎么应用的。

这是在没有border-radius:50%情况下

![图8](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/90.png)

<=90度  圆心点、top点、topRight点。加上圆弧终点共4个点

![图9](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/180.png)

 .>90度 <=180度  圆心点、top点、topRight点、bottomRight点。加上圆弧终点共5个点

![图10](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/270.png)

.>180度 <=270度  圆心点、top点、topRight点、bottomRight点、leftBottom点。加上圆弧终点共6个点

![图11](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/360.png)

.>270度 <=360度  圆心点、top点、topRight点、bottomRight点、leftBottom点、leftTop点。加上圆弧终点共7个点

这样就能实现任意角度饼图。

## 最后

大家可以思考一下。

这种方法除了做饼图，还能做那些目前数据表图形。

我们下节课介绍别一个数据图表，是用本篇饼图的方法与上节课的两点的连线结合开发。


任意数据个数——雷达图

![图12](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1557210920975.png)

