---
title: css 选择器
date: 2019-10-27 16:30:00
tags: css css3
categories: css css3
---

今天开始讲css经常用的东西，选择器。

<!--more-->

# css选择器

我们知道比较常见的id、class、后代选择器这些基本的css选择器。但这并不是css的全部。今天用几个例子来加深了解选择器与css权重的重要性。

## 1-元素选择器

元素选择器通常都是 HTML 元素。（但也有例外，比如在XML文档）。

```css
html {color: black;}  
h1 {color: gray;}  
h2 {color: silver;}
```

## 2-群组选择器

选择器之间以`,`（逗号）分隔。

```css
h2, p{color: red;}
```

## 3-通配选择器

`*`匹配所有元素。

```css
*{color: red;}
```

## 4-类和ID选择器

除了元素，还有**类选择器**和 **ID 选择器**，它们允许以独立于文档元素的方式分配样式。 

```css
.warning {font-weight: bold;}
```

```css
#first-para {font-weight: bold;}
```

## 5-属性选择器

属性选择器有四种基本类型：简单属性选择器、准确属性值选择器、部分匹配属性选择器和特定属性选择器。

简单属性选择器

```css
h1[class] {color: silver;}
```
准确属性值选择器
```css
h1[class=="moons"] {color: silver;}
```
部分匹配属性选择器
| 类型           | 描述                                                         |
| :------------- | :----------------------------------------------------------- |
| `[foo~="bar"]` | 选择所有带有`foo`属性、且`foo`属性被空白分隔的单词列表中含有单词`bar`的元素。 |
| `[foo*="bar"]` | 选择所有带有`foo`属性、且`foo`属性值中含有子串`bar`的元素。  |
| `[foo^="bar"]` | 选择所有带有`foo`属性、且`foo`属性值以`bar`开头的元素。      |
| `[foo$="bar"]` | 选择所有带有`foo`属性、且`foo`属性值以`bar`结束的元素。      |
| `[foo|="bar"]` | 选择所有带有`foo`属性、且`foo`属性值以`bar`开头后接一个短线（`U+002D`）或者属性值是`bar`的元素。 |

基于部分属性值的选择器中的特定属性选择器
```css
*[lang|="en"] {color: white;}
```
这条规则会选择任何lang属性等于en或者以en-开头的元素。因此，下面的示例中前三个标签会被选中，而后两个则不会：
```html
<h1 lang="en">Hello!</h1>  
<p lang="en-us">Greetings!</p>  
<div lang="en-au">G'day!</div>  
<p lang="fr">Bonjour!</p> 
<h4 lang="cy-en">Jrooana!</h4>
```

在中括号关闭之前使用`i`允许选择器匹配属性值的时候忽略大小写，无视文档语言的规则。

```css
a[href$='.PDF' i]
```

# css权重(优先级)

优先级就是分配给指定的CSS声明的一个权重，它由匹配的选择器中的每一种选择器类型的数值决定。

> css权重关系到你的css规则是怎样显示的

## CSS优先级

内联(style="") > 内联样式表(&lt;style&gt;) | 外链样式表(&lt;link&gt;) > 浏览器缺省

>  **内联样式表**和**外链样式表**取决于定义的位置顺序。 

## 选择器优先级

ID选择器 > 类选择器 | 属性选择器 | 伪类选择器 > 元素选择器

>  **!important**: 当在一个样式声明中使用一个!important 规则时，此声明将覆盖任何其他声明

内联元素  1, 0, 0, 0

ID选择器  0, 1, 0, 0

类选择器，属性选择，伪类  0, 0, 1, 0

元素，伪元素  0, 0, 0, 1

## 演示图

![图1](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/specificity.png)

# 实例

## 属性选择器

![图2](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/selector_1.png)

 ## css兄弟选择器

![图3](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/selector_2.png)




[本示例代码下载](https://github.com/xeon225/animation)

[本示例采用cmui样式库，有兴趣可以访问下载](https://github.com/tgoufe/CyanMapleDesign)