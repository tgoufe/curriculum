---
title: css3 数据图形之——折线图等
date: 2019-06-03 16:30:00
tags: css
categories: css
---

这节课我们继续做css3数据图表，折线图、散点图、柱形图、面积图。

<!--more-->

# css3 数据图形之——折线图等

今天我们做折线图、散点图、柱形图、面积图。

他们有一个共同的特性，图形都是在X，Y轴的DOM结点上。

![图1](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/img-lineChart_1.png)

### 一、数据刻度表

在数据表制做前要先做刻度表

![图2](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/img-lineChart_2.png)

看图，刻度表分三部分

1、刻度表格

2、x轴刻度值

3、y轴刻度值

从图上，可以知道，想表现10个0-100之间的值。

这里的重点，刻度表格没有采用div table 配合border样式。而是只用一个dom来实现。

#### 重复线性渐变——网格
```stylus
.linearGradient{
    background-image: 
    repeating-linear-gradient(to top,red 0%, red 1px, rgba(0, 0, 0, 0) 1px, rgba(0, 0, 0, 0) 10%),
    repeating-linear-gradient(to right,red 0%, red 1px, rgba(0, 0, 0, 0) 1px, rgba(0, 0, 0, 0) 10%);
}
```
第一行css代码意思是向上渐变也就是X轴线。红色从0px开始到1px高度，然后透明色从1px到dom高的10%高度，后面依次循环。

第二行是向右渐变方法跟上面一样。

这样一个刻度表都出来了，这么做的好处是简单，易修改。做动态刻度表更是方便。

下面图是通过修改x y轴数量，来改变网格。

![图3](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/img-lineChart.gif)

```stylus
.linearGradient{
    background-image: 
    repeating-linear-gradient(to top,currentColor 0%, currentColor 1px, rgba(0, 0, 0, 0) 1px, rgba(0, 0, 0, 0) ' + 100 / y + '%),
    repeating-linear-gradient(to right,currentColor 0%, currentColor 1px, rgba(0, 0, 0, 0) 1px, rgba(0, 0, 0, 0) ' + 100 / x + '%);
}
```
x y 轴刻度值

跟制作网格方法一样

宽度或高度 / x或y轴数量  横向排列或者纵向排列


### 二、数据图形

#### 散点图

假如随机10个0-100的数

[71, 83, 50, 91, 53, 67, 17, 2, 37, 94]

### 将数据转换成x y轴坐标点。

> 注：这组数据也会后面的数据图表用到。

```javascript
dataNew(){
    var d = this.dItems,  //随机数
        dNew = [],        //坐标点数据
        top = '',         //css top 对应y轴
        left = '';        //css left 对应x轴
    d.forEach((item,index)=>{
      //    (随机数上限 - item) * 画布dom高度 / 随机数上限
      top = (this.max - item) * this.Height / this.max;
      //     index * 画面dom宽度 / x轴刻度数量
      left = index * this.Width / this.xDegree
      dNew.push({'y':top,'x':left})
    })
    return dNew
}
```
OK 坐标点数据有了，我们可以做散点图了
```javascript
scatter(){
    var d = this.dataNew,    //坐标点数据
        dNew = [],           //散点图数据
        px = 'px;',          //像素单位
        style = '';          
    d.forEach((item,index)=>{
      style = 'top:' + item.y + px + 'left:' + item.x + px;
      dNew.push(style)
    })
    return dNew
}
```
上面方法直接把x y坐标点改成css top和left属性值，再分给每个dom。



生成的dom结构

```html
<div class="clipPath pos-a top0 right0 left0 bottom0 text-black" style="width: 100%; height: 100%;">
    <div class="dian" style="top: 116px; left: 0px;"></div>
    <div class="dian" style="top: 68px; left: 40px;"></div>
    <div class="dian" style="top: 200px; left: 80px;"></div>
    <div class="dian" style="top: 36px; left: 120px;"></div>
    <div class="dian" style="top: 188px; left: 160px;"></div>
    <div class="dian" style="top: 132px; left: 200px;"></div>
    <div class="dian" style="top: 332px; left: 240px;"></div>
    <div class="dian" style="top: 392px; left: 280px;"></div>
    <div class="dian" style="top: 252px; left: 320px;"></div>
    <div class="dian" style="top: 24px; left: 360px;"></div>
</div>
```
再加上效果点的样式
```stylus
.dian{
    width:8px;
    height:8px;
    position: absolute;
}
.dian:before{
    content: '';
    width:100%;
    height:100%;
    position: absolute;
    left:-50%;
    top:-50%;
    border-radius: 50%;
    background: currentColor;
}
```
最后下图呈现

![图4](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/img-lineChart_3.png)

散点图就OK了

#### 折线图

然后是折线图，还是用上面的刻度表和生成好的坐标点数据。

利用之前所用到的两点间直接的方法。

```javascript
lineList(){
    var d = this.dataNew,    //坐标点数据
        dNew = [],           //折线图数据
        next = 0,            //坐标终点初始化下标
        px = 'px;',          //像素单位
        linear = false,      //判定斜线方向
        style = '';
    for (var i = 1; i < d.length; i++){
        //10个点能生成的9条连接折线  i-1起点   i终点
        style = this.pathLine(d[i-1],d[i])          //两点间连线方法
        linear = this.linearGradient(d[i-1],d[i])   //判定斜线方向方法
        dNew.push([style,linear])
    }
    return dNew
}
```
这个地方两点间连线组成的折线图形，有一个规律。
#### 线的个数比点的个数少一个。

判定斜线方向方法
```javascript
linearGradient:function(c1,c2){
    var c1 = c1,    //坐标起点 x y
        c2 = c2,    //坐标终点 x y
        linearGradient = false; //线性渐变的方向 false从左下到右上，true 从左上到右下 
    linearGradient = (c1.x>c2.x === c1.y>c2.y);
    return linearGradient
}
```

两点间连线方法
```javascript
pathLine:function(c1,c2){
    var c1 = c1,    //坐标起点 x y
        c2 = c2,    //坐标终点 x y
        width = '',   //斜线盒子width值
        height = '',  //斜线盒子height值
        top = '',   //斜线盒子top值
        left = '',    //斜线盒子left值
        border = '',
        px = 'px;',
        path = ''

    //取两个x坐标间距离
    width = 'width:' + Math.abs(c1.x - c2.x) + px;
    //取两个yx坐标间距离
    height = 'height:' + Math.abs(c1.y - c2.y) + px;
    //取两个y坐标最小值
    top = 'top:' + Math.min(c1.y,c2.y) + px;
    //取两个x坐标最小值
    left = 'left:' + Math.min(c1.x,c2.x) + px;
    //判断宽度为0或高度为0 设置border为1px实线
    border = (Math.abs(c1.x - c2.x) < 1) ? 'border:1px solid currentColor;' : (Math.abs(c1.y - c2.y) < 1) ? 'border:1px solid currentColor;' : '';
    //组成style
    path = top + left + width + height + border
    return path
}
```
最后style分给dom，生成出折线图

![图5](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/img-lineChart_4.png)

#### 柱形图

继续用刻度表和坐标点数据

柱形图的制作用到了散点图的方法。在生成css top和left属性的同时，dom添加柱形style。

```javascript
pillarList(){
    var d = this.dataNew,         //坐标点数据
        w = 'width:20px;',        //柱形的宽度
        dNew = [],
        px = 'px;',
        style = '';
    d.forEach((item,index)=>{
        style = 'top:' + item.y + px + 'left:' + item.x + px + w + 'bottom:0;background:currentColor';
        dNew.push(style)
    })
    return dNew
}
```
它比散点图的style多了background、width、bottom属性

```stylus
.style{
  background:red;
  width:20px;
  bottom:0;
}
```
感觉很简单，呵呵

![图6](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/img-lineChart_5.png)

#### 面积图

面积图是用clip-path的polygon带入坐标点数据，再加上第一条数据的x轴最底部坐标和最后一条数据x轴最底部坐标。

最后生成面积图

```javascript
areaChartClip(){
    var d = this.dataNew,       //坐标点数据
        first = '0 100%,',      //第一条数据x轴最底部坐标
        last = (100 - (100 / this.xDegree)) + '% 100%',   //最后一条数据x轴最底部坐标
        bgColor = 'background:currentColor',      //面积图颜色
        style = '';
    d.forEach((item,index)=>{
        style += item.x + 'px ' + item.y + 'px,';
    })
    style = 'clip-path:polygon(' + first + style + last + ');' + bgColor
    return style
}
```

![图7](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/img-lineChart_6.png)

以上就是在画布X，Y轴的DOM结点上的数据图表

### 三、其它数据图

仔细发现，他们还可以组合使用。

散点+折线、折线+面积+散点、数据呈现更清晰。

通过上面这些数据图，还可以做扩展。比如下图

![图7](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/map.jpg)

css的图形部分就讲到这里，下节课开始，我们进入svg的图形世界。谢谢大家
