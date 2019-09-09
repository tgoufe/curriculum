---
title: 浏览器重绘(repaint)重排(reflow)
date: 2019-07-16 14:00:00
tags: JavaScript
categories: 开发技巧
---


浏览器重绘(repaint)重排(reflow)

<!--more-->

重排也叫回流（Reflow），重绘（Repaint），会影响到浏览器的性能，给用户的感觉就是网页访问慢，或者网页会卡顿，
不流畅，从而使网页访问量下降。

所以，想要尽可能的避免重排和重绘，就需要了解浏览器的渲染原理。



我们一起看下下面这张

浏览器工作流程
![浏览前渲染](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1563256777095.png)
上图我们可以看出，浏览器会解析三个模块：
1.HTML,SVG,XHTML，解析生成DOM树。
2.CSS解析生成CSS规则树。
3.JavaScript用来操作DOM API和CSSOM API，生成DOM Tree和CSSOM API。

解析完成后，浏览器会通过已经解析好的DOM Tree 和 CSS规则树来构造 Rendering Tree。
Rendering Tree 渲染树并不等同于DOM树，因为一些像Header或display:none的东西就没必要放在渲染树中了。

CSS 的 Rule Tree主要是为了完成匹配并把CSS Rule附加上Rendering。

Tree上的每个Element。也就是DOM结点，即Frame。然后，计算每个Frame（也就是每个Element）的位置，这又叫layout和reflow过程。
最后通过调用操作系统Native GUI的API绘制。

不同内核的浏览器渲染不同内核的浏览器渲染
![webkit浏览前渲染](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1563256777095.png)
上图是webkit内核的渲染流程，和总体渲染流程差不多，要构建HTML的DOM Tree，和CSS规则树，然后合并生成Render Tree，最后渲染。

![webkit浏览前渲染](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1563257066927.png)
这个是Mozilla的Gecko渲染引擎。
总体看来渲染流程差不多，只不过在生成渲染树或者Frame树时，两者叫法不一致，webkit称之为Layout，Gecko叫做Reflow。

![渲染顺序](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1563257131549.png)
当浏览器拿到一个网页后，首先浏览器会先解析HTML，如果遇到了外链的css，会一下载css，一边解析HTML。
当css下载完成后，会继续解析css，生成css Rules tree,不会影响到HTML的解析。
当遇到'script'标签时，一旦发现有对javascript的引用，就会立即下载脚本，同时阻断文档的解析，等脚本执行完成后，再开始文档的解析。

![渲染顺序小](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1563257190557.png)
当DOM树和CSS规则树已经生成完毕后，构造 Rendering Tree。
调用系统渲染页面。


什么情况会造成重排和重绘。


重排(reflow)：

概念： 当DOM的变化影响了元素的几何信息(DOM对象的位置和尺寸大小)，浏览器需要重新计算元素的几何属性，
将其安放在界面中的正确位置，这个过程叫做重排。
重排也叫回流,重排的过程以下面这种理解方式更清晰一些：

回流就好比向河里(文档流)扔了一块石头(dom变化)，激起涟漪，然后引起周边水流受到波及，所以叫做回流

重绘(repaint):
概念：
当一个元素的外观发生改变，但没有改变布局,重新把元素外观绘制出来的过程，叫做重绘。

重排比重绘大：
大，在这个语境里的意思是：谁能影响谁？

重绘：某些元素的外观被改变，例如：元素的填充颜色
重排：重新生成布局，重新排列元素。
就如上面的概念一样，单单改变元素的外观，肯定不会引起网页重新生成布局，但当浏览器完成重排之后，将会重新绘制受到
此次重排影响的部分。
比如改变元素高度，这个元素乃至周边dom都需要重新绘制。
也就是说："重绘"不一定会出现"重排"，"重排"必然会出现"重绘"

常见引起重排属性和方法

任何会改变元素几何信息(元素的位置和尺寸大小)的操作，都会触发重排，下面列一些栗子：

1.添加或者删除可见的DOM元素；
2.元素尺寸改变——边距、填充、边框、宽度和高度
3.内容变化，比如用户在input框中输入文字
4.浏览器窗口尺寸改变——resize事件发生时
5.计算 offsetWidth 和 offsetHeight 属性
6.设置 style 属性的值
7.移动DOM的位置，开启动画的时候。

如果当前网页含有一些动画，或者固定不动元素的网页时，由于滚动也会发生重排，一旦发生滚动，当前浏览器所承受的压力很大，就会造成网页的卡顿，掉帧等情况。

重排影响的范围：
由于浏览器渲染界面是基于流式布局模型的，所以触发重排时会对周围DOM重新排列，影响的范围有两种：

全局范围：从根节点html开始对整个渲染树进行重新布局。
局部范围：对渲染树的某部分或某一个渲染对象进行重新布局
全局范围重排：
````html
<body>
  <div class="hello">
    <h4>hello</h4>
    <p><strong>Name:</strong>BDing</p>
    <h5>male</h5>
    <ol>
      <li>coding</li>
      <li>loving</li>
    </ol>
  </div>
</body>
````
当p节点上发生reflow时，hello和body也会重新渲染，甚至h5和ol都会收到影响。

局部范围重排：
用局部布局来解释这种现象：把一个dom的宽高之类的几何信息定死，然后在dom内部触发重排，就只会重新渲染该dom内部的
元素，而不会影响到外界。

尽可能的减少重排的次数、重排范围：

重排需要更新渲染树,性能花销非常大:

它们的代价是高昂的，会破坏用户体验，并且让UI展示非常迟缓，我们需要尽可能的减少触发重排的次数。

重排的性能花销跟渲染树有多少节点需要重新构建有关系：

所以我们应该尽量以局部布局的形式组织html结构，尽可能小的影响重排的范围。

而不是像全局范围的示例代码一样一溜的堆砌标签，随便一个元素触发重排都会导致全局范围的重排。

所以我们在监听resize事件时，一般我们都会做防抖和节流。


这里有一个小例子我们看一下;
````javascript
var s = document.body.style;
s.padding = "2px"; // 回流+重绘
s.border = "1px solid red"; // 再一次 回流+重绘
s.color = "blue"; // 再一次重绘
s.backgroundColor = "#ccc"; // 再一次 重绘
s.fontSize = "14px"; // 再一次 回流+重绘
// 添加node，再一次 回流+重绘
document.body.appendChild(document.createTextNode('abc!'));
````
聪明的浏览器
从上个实例代码中可以看到几行简单的JS代码就引起了6次左右的回流、重绘。而且我们也知道回流的花销也不小，
如果每句JS操作都去回流重绘的话，浏览器可能就会受不了。所以很多浏览器都会优化这些操作，浏览器会维护1个队列，
把所有会引起回流、重绘的操作放入这个队列，等队列中的操作到了一定的数量或者到了一定的时间间隔，
浏览器就会flush队列，进行一个批处理。这样就会让多次的回流、重绘变成一次回流重绘。
虽然有了浏览器的优化，但有时候我们写的一些代码可能会强制浏览器提前flush队列，这样浏览器的优化可能就起不到作用了。当你请求向浏览器请求一些 style信息的时候，就会让浏览器flush队列，比如：

offsetTop, offsetLeft, offsetWidth, offsetHeight
scrollTop/Left/Width/Height
clientTop/Left/Width/Height
width,height
请求了getComputedStyle(), 或者 IE的 currentStyle
当你请求上面的一些属性的时候，浏览器为了给你最精确的值，需要flush队列，因为队列中可能会有影响到这些值的操作。
即使你获取元素的布局和样式信息跟最近发生或改变的布局信息无关，浏览器都会强行刷新渲染队列。






如何减少重排和重绘

1.尽量避免style的使用，对于需要操作DOM元素节点，重新命名className，更改className名称。
2.如果增加元素或者clone元素，可以先把元素通过documentFragment放入内存中，等操作完毕后，再appendChild到DOM元素中。
3.不要经常获取同一个元素，可以第一次获取元素后，用变量保存下来，减少遍历时间。
4.尽量少使用dispaly:none，可以使用visibility:hidden代替，dispaly:none会造成重排，visibility:hidden会造成重绘。
5.不要使用Table布局，因为一个小小的操作，可能就会造成整个表格的重排或重绘。
6.使用resize事件时，做防抖和节流处理。
7.对动画元素使用absolute / fixed属性。
8.批量修改元素时，可以先让元素脱离文档流，等修改完毕后，再放入文档流。






常见引起重排属性和方法
width
height
margin
padding
display
border
position
overflow
clientWidth
clientHeight
clientTop
clientLeft
offsetWidth
offsetHeight
offsetTop
offsetLeft
scrollWidth
scrollHeight
scrollTop
scrollLeft
scrollIntoView()
scrollTo()
getComputedStyle()
getBoundingClientRect()
scrollIntoViewIfNeeded()


常见的引起重绘的属性:

color
border-style
visibility
background
text-decoration
background-image
background-position
background-repeat
outline-color
outline
outline-style
border-radius
outline-width
box-shadow
background-size

参考文件  

+ [重绘和回流](https://www.html.cn/archives/4996/)




