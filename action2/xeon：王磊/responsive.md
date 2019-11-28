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

在实现不同屏幕分辨率的终端上浏览网页的不同展示方式。通过响应式设计能使网站在手机和平板电脑上有更好的浏览阅读体验。

要实现响应布局

屏幕分类

目前主流屏幕尺寸分为三种

超小屏(移动端)、中小屏(PAD)、宽屏(PC端)

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
<link rel="stylesheet" type="text/css" href="css/css_980.css" media="screen and (min-width:980px) and (max-width:1200px)"/>
<link rel="stylesheet" type="text/css" href="css/css_640.css" media="screen and (min-width:640px) and (max-width:980px)"/>
<link rel="stylesheet" type="text/css" href="css/css_375.css" media="screen and (max-width:640px)"/>
```

二、使用@import导入

```javascript
@import url("css/css_980.css") all and (max-width:980px);
```

三、最常用的在css文件中使用

```css
@media screen and (max-width:980px ) {
   body{
     css样式
   }
}
```

3、Javascript响应式

方法很简单，是读取窗口宽度加载不同的css。

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