---
title: css 伪类
date: 2019-09-07 16:30:00
tags: css css3
categories: css css3
---

今天开始讲css经常用的东西，选择器。

<!--more-->

### css选择器

我们知道比较常见的id、class、后代选择器这些基本的css选择器。但这并不是css的全部。今天用几个例子来加深了解选择器与css权重的重要性。

#### 1、选择器

##### 1-元素选择器

元素选择器通常都是 HTML 元素。（但也有例外，比如在XML文档）。

```css
html {color: black;}  
h1 {color: gray;}  
h2 {color: silver;}
```

##### 2-群组选择器

选择器之间以`,`（逗号）分隔。

```css
h2, p{color: red;}
```

##### 3-通配选择器

`*`匹配所有元素。

> 文档中所有元素都显示为红色。

```css
*{color: red;}
```

##### 4-类和ID选择器

除了元素，还有**类选择器**和 **ID 选择器**，它们允许以独立于文档元素的方式分配样式。 

```css
.warning {font-weight: bold;}
```

```
#first-para {font-weight: bold;}
```

### css权重(优先级)

优先级就是分配给指定的CSS声明的一个权重，它由匹配的选择器中的每一种选择器类型的数值决定。

> css权重关系到你的css规则是怎样显示的

#### CSS优先级

内联(style="") > 内联样式表(<style>) | 外链样式表(<link>) > 浏览器缺省

>  **内联样式表**和**外链样式表**取决于定义的位置顺序。 

#### 选择器优先级

ID选择器 > 类选择器 | 属性选择器 | 伪类选择器 > 元素选择器

>  **!important**: 当在一个样式声明中使用一个!important 规则时，此声明将覆盖任何其他声明

内联元素  1, 0, 0, 0

ID选择器  0, 1, 0, 0

类选择器，属性选择，伪类  0, 0, 1, 0

元素，伪元素  0, 0, 0, 1

#### 演示图

![图1](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/specificity.png)

### 实例

#### 属性选择器

![图2](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/selector_1.png)

 #### css兄弟选择器

![图3](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/selector_2.png)

[^]: 本示例采用cmui样式库，有兴趣可以访问下载

