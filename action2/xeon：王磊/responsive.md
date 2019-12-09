---
title: 响应式布局
date: 2019-11-07 16:30:00
tags: html css3
categories: html css3
---

今天讲页面的响应式布局。

<!--more-->

# 响应式布局

## 什么是响应式布局设计

根据维基百科及其参考文献，理论上，响应式界面能够适应不同的设备。描述响应式界面最著名的一句话就是“Content is like water”，翻译成中文便是“如果将屏幕看作容器，那么内容就像水一样”。

## 为什么要设计响应式界面

为了让页面在不同分辨率的屏幕上，都有做到很好的显示效果。

目前主流屏幕尺寸分为三种

超小屏(移动端)、中小屏(PAD)、宽屏(PC端)

页面要在不同的大小和比例上看起来都应该是舒适，在不同分辨率上看都应该是合适的，在不同的操作方式上（鼠标和触屏），体验应该是统一的。在不同的设备，交互方式应该是符合习惯的。

## 响应式的设计过程

1、设置Meta标签

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

2、响应式设计的核心—css媒体查询

css媒体查询有三种方法。

一、使用link连接，media属性用于设置查询方式。

```html
<link rel="stylesheet" type="text/css" href="css/css.css" />
	<link rel="stylesheet" type="text/css" href="css/css_980.css" media="screen and (min-width:680px) and (max-width:980px)"/>
	<link rel="stylesheet" type="text/css" href="css/css_680.css" media="screen and (min-width:500px) and (max-width:679px)"/>
	<link rel="stylesheet" type="text/css" href="css/css_500.css" media="screen and (max-width:499px)"/>
```

二、使用@import导入

```javascript
@import url("css/css_980.css") all and (max-width:980px);
```

三、最常用的在css文件中使用

```css
@media screen and (min-width:680px ) and (max-width:980px ) {
   body{
     css样式
   }
}
```

3、Javascript响应式

方法很简单，是读取窗口宽度加载不同的css。

## 响应式界面的基本规则

1、**可伸缩的内容区块**：内容区块的在一定程度上能够自动调整，以确保填满整个页面

![图2](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/responsive_2.jpg)

**2、可自由排布的内容区块**：当页面尺寸变动较大时，能够减少/增加排布的列数

![图3](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/responsive_3.jpg)

**3、适应页面尺寸的边距**：到页面尺寸发生更大变化时，区块的边距也应该变化

![图4](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/responsive_4.jpg)

**4、能够适应比例变化的图片**：对于常见的宽度调整，图片在隐去两侧部分时，依旧保持美观可用

![图5](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/responsive_5.jpg)

**5、能够自动隐藏/部分显示的内容**：如在电脑上显示的的大段描述文本，在手机上就只能少量显示或全部隐藏

![图6](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/responsive_6.jpg)

**6、能自动折叠的导航和菜单**：展开还是收起，应该根据页面尺寸来判断

![图7](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/responsive_7.jpg)

**7、放弃使用像素作为尺寸单位**


## 响应式与自适应的区别与特点

![图1](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/responsive.jpeg)

响应式设计就是一个网站能够兼容多个终端—而不是为每个终端做一个特定的版本。（改变布局）

自适应设计指能使网页自适应显示在不同大小终端设备上新网页设计方式及技术。（布局不动）

### 区别

自适应通过窗口分辨率，比如上面提到的三种尺寸，分别开发对应的适配。（页面和设计）

响应式只需要出一套页面和设计。（但是在设计上要考虑的内容要比自适应复杂的多）

### 优点与缺点

响应式可以面对不同的分辨率设备灵活性强。

但是仅适用布局，信息，框架并不复杂的页面。兼容性低，效率不高。

自适应对网站的复杂程度兼容性大，代码更高效，运营相对精准。

开发成本高，需求变动时，会改动多套代码。



无论那种设计理念都会有优缺点，具体选择还是要以团队和需求出发。