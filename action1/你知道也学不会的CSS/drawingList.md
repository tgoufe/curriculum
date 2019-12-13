---
title: css3 数据图形之——雷达图的实现
date: 2019-05-17 16:30:00
tags: css
categories: css
---

这节课我们继续做css3数据图表——任意个数角的雷达图

<!--more-->

# css3 数据图形之——雷达图的实现

在制作之前，我们要做一些准备工作

1、css属性（clip-path）画多边形、（linear-gradient）画任意角度三角形。

2、图形方法：两点间连线、圆弧的终点。

3、实现雷达图展开动效、数据高亮切换效果。

### 一、雷达图的背景表与刻度表


![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_1.png)

看图，我们能知道这个是六角形，刻度为5等分。仔细看是5个等比缩放的六角形组合在一起。

实现上面的图形，要利用前几节课讲的。两点间连线方法和取圆弧的终点方法。来做出一个角就行，其余角用同样的方法旋转组成最后完整的多角形。


#### 这样我们来实现一个角图形方法 
![图2](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_2.png)

先看最外层的三角形

已知条件

画布 width:400px;  height:400px;

那么按圆弧的终点方法需要4个条件

圆心点 cx:200px  cy:200px

半径 200px

角度值  60度

圆弧终点坐标  x y

| 参数   |      说明      |
|:----------:|:-------------:|
| cx,cy    |  饼图圆心坐标 |
| R |    饼图半径   |
| rad | 饼图角度值 | 
| x,y | 饼图弧线终点坐标 | 

![图3](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_3.png)

#### 圆弧的终点坐标方法 0 - 180度
```javascript
pathChart:function(rad,x,y,r){
    var lx = x,
        ly = y,
        r = r,
        a = rad,
        aa = a*Math.PI/180,                     //角度转换
        sinLx = (lx+(Math.sin(aa)*r))+'px ',    //角弧度终点x
        cosLy = (ly-(Math.cos(aa)*r))+'px ',    //角弧度终点y
        item = {'left':sinLx,'top':cosLy}
        
    return item
}
```

通过计算方法，我们求出x y的坐标值。

然后我们要用两点间连接的方法

```javascript
pathLine:function(c1,c2){
  var c1 = c1,    //坐标起点 x y
      c2 = c2,    //坐标终点 x y
      width = '',   //斜线盒子width值
      height = '',  //斜线盒子height值
      top = '',   //斜线盒子top值
      left = '',    //斜线盒子left值
      border = '',  //如果坐标点之间有相等用border画
      px = 'px;',   //长度单位
      path = ''     //最后styles

  //取两个x坐标间距离
  width = 'width:' + Math.abs(c1.x - c2.x) + px;
  //取两个yx坐标间距离
  height = 'height:' + Math.abs(c1.y - c2.y) + px;
  //取两个y坐标最小值
  top = 'top:' + Math.min(c1.y,c2.y) + px;
  //取两个x坐标最小值
  left = 'left:' + Math.min(c1.x,c2.x) + px;
  //缩放展开所需要的偏移量
  // origin = 'transform-origin:' + origin + ';';

  //判断宽度为0或高度为0 设置border为1px实线
  border = (Math.abs(c1.x - c2.x) < 1) ? 'border:1px solid currentColor;' : (Math.abs(c1.y - c2.y) < 1) ? 'border:1px solid currentColor;' : '';

  //组成style
  path = top + left + width + height + border
  return path
}
```


先要得到需要连线之间的点坐标

![图4](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_4.png)

通过坐标可计算出三角形所占的dom大小

根据之前课里讲的两点连线方法画N条线就要有相对应数量的N个dom

这里个三角形，假设dom a b c，a 包含 b c。
  
a 高为半径长200px 宽为x坐标减去圆心点坐标x

b 宽同上 高为y坐标点到顶点的距离

c 宽同上 高为半径r减去 dom b 高度

三角形的竖线a为dom高 斜线b c 用css属性（linear-gradient）画出
```stylus
.linearGradientLeftTop{
    position: absolute;
    background: linear-gradient(to left top, transparent calc(50% - 0.5px), currentColor, transparent calc(50% + 0.5px));
}
.linearGradientTopRight{
    position: absolute;
    background: linear-gradient(to top right, transparent calc(50% - 0.5px), currentColor, transparent calc(50% + 0.5px));
}
```

这里要注意一下，斜线的方向有两种，左上到右下、左下到右上。

可以用方法来判断方向。

#### 点c1的x,y同时大于或同时小于点c2的x,y。那么方向是左上到右下，反之是左下到右上

```javascript
linearGradient:function(c1,c2){
    var c1 = c1,    //坐标起点 x y
        c2 = c2,    //坐标终点 x y
        linearGradient = false; //线性渐变的方向 false从左下到右上，true 从左上到右下 
    linearGradient = (c1.x>c2.x === c1.y>c2.y);
    return linearGradient
}
```


![图5](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_5.png)

dom a 再加style 定位属性 top:0px，left:200px。

#### 这样一个60度角的等腰三角形就出来了


再用同样的方法我们来做刻度，是根据半径的值大小，其它参数不变。

这里我做了刻度数组  [1,0.8,0.6,0.4,0.2] 

1就是我们生成最外层的三角形 其它4个是对半径的百分比。也是对画布的百分比。

> 注：任何图形最好都在画布上开展，不做也不会有影响，只是为了更好的区分、管理和可读性。

通过css的浮动层将五个画布（dom）叠加一起，绝对居中。就是上图所显示的雷达图的一角。


那么其它5组角都是同理生成，不过在每组三角形dom合集。加上css旋转属性 transform: rotate()

![图6](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_6.png)


一个完整的多角图表出来了。但是会发现有些线会重叠，我们可以到生成线的地方做些判断去重。

#### 既然图表可以动态生成，那么来做一个根据数据个数生成角的个数。


需要条件

| 参数   |      说明      |
|:----------:|:-------------:|
| round    |  圆360度 |
| data |    [item1,item2,item3,...]每组数据代表一个角   |

```javascript
data:[
    item1,item2,item3,item4,item5
]
```
数据个数为5 那么角也得是5个。

rad = round / data.length  角度为72度

用上面的方法计算生成

![图7](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_7.png)


如果是数据个数据为8

![图8](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_8.png)


### 二、数据的多边形展示

假设现有6组数据 0-100的随机数

data:[
    100, 30, 70, 80, 50, 60
]

用圆弧的终点方法，随机数做为半径值，角度值rad为60度 * （数据索引 + 1）

#### 圆弧的终点坐标与裁切方法 0 - 360 度
```javascript
cssCircle:function(num,x,y,r){
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


    return dd   
}
```

得到坐标

![图9](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_9.png)

sinLx = (lx+(Math.sin(aa)*r))+'px ',    //角弧度终点x

cosLy = (ly-(Math.cos(aa)*r))+'px ',    //角弧度终点y

A1：373.205px 100px

A2：251.962px 230px

A3：200px 340px

A4：61.4359px 280px

A5：113.397px 150px

A6：200px 80px

x,y坐标其实转换成css属性显示就是对应 top,left

再用css属性clip-path
##### clip-path:polygon(373.205px 100px, 251.962px 230px, 200px 340px, 61.4359px 280px, 113.397px 150px, 200px 80px)。

添加一个背景色就是最基本的数据展示图

![图10](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_10.png)

到这雷达图的重要部分已经都完成了

### 三、数据图形完善和显示动效

为了让数据显示的那加精确和清晰，我们继续优化。

继续用生成的坐标点数据 A1,A2,...A6

可以用上面的两点之间的连线方法，给数据图形加个外框

![图11](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_11.png)

继续，给每个坐标点加样式效果，如图红点

在坐标的位置上，生成一个红圆点dom

![图12](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_12.png)

最后配文字说明，将数据表更加完整。


![图13](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/ld_gif.gif)

动效可制作一个点击展示数据效果。

用css属性transition过渡。在展开前设置6个默认点，位置全部在圆心点。

clip-path:polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)。

为什么要设置6个默认点，这是clip-path:polygon属性在过渡和动画效果，坐标点个数必须相等，才能显示动效。

OK，雷达图的制做就到这了。

这节课，主要用到两点间连线和圆弧的终点坐标方法。掌握它们，除了曲线数据表不能做，其它数据表都可以。

下节课，会把其它表大致的讲解一下，比如拆线图，柱状图等。