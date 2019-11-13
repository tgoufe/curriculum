---
title: html语义规范与css规范
date: 2019-11-07 16:30:00
tags: html css3
categories: html css3
---

今天讲html语义规范和css规范。

<!--more-->

# html语义化

我们之前讲css3的选择器，选择器是一种模式，尤其伪类选择器更是提高了样式优化。

不过这些都要基于良好的html格式规范。了解学习html语义化，会帮助你更好的编写管理html文档。

## 为什么要语义化

用最适合的标签来标记内容。

> 在没有css的情况下，页面也能呈现出很好的内容结构和代码结构。

通俗点讲去掉css样式，然后看页面是否还具有很好的可读性。

如果有做过md文档的话，会有很深的理解。

## 语义化优点

1.没有css样式，页面也能呈现出很好的内容结构和代码结构。。

2.利于浏览器解析和SEO搜索引擎优化。

3.语义化HTML会使HTML结构变的清晰，有利于维护代码和添加样式。

4.方便其他设备解析，以意义的方式来渲染网页。

5.使用语义化结构会节省开发成本。

6.对响应式布局的作用很大。

## 写HTML代码是应注意什么

尽可能少的使用无语义的标签div和span。

需要强调的文本，可以包含在strong或者em标签中，strong默认样式是加粗（不要用b），em是斜体（不用i）。

使用表格时，table语义化。

表单语义化，利用fieldset与legend标签说。

每个input标签对应的说明文本都需要使用label标签，并且通过为input设置id属性。

## html5主体结构

![图1](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/html5_1.png)



&lt;header&gt;定义文档或者文档的部分区域的页眉，应作为介绍内容或者导航链接栏的容器。

&lt;nav&gt;描述一个含有多个超链接的区域，该区域包含跳转到其他页面或页面内部其他部分的链接列表。

> 在一个文档中，可定义多个&lt;nav&gt;元素。

&lt;main&gt;定义文档的主要内容，该内容在文档中应当是独一无二的，不包含任何在文档中重复的内容，比如侧边栏，导航栏链接，版权信息，网站logo，搜索框（除非搜索框作为文档的主要功能）。

> 需要注意的是在一个文档中不能出现多个&lt;main&gt;标签。

&lt;article&gt;元素表示文档、页面、应用或网站中的独立结构，是可独立分配的、可复用的结构，如在发布中，它可能是论坛帖子、杂志或新闻文章、博客、用户提交的评论、交互式组件，或者其他独立的内容项目。

&lt;aside&gt;元素表示一个和其余页面内容几乎无关的部分，被认为是独立于该内容的一部分且可以被单独的拆分出来而不会影响整体。通常表现为侧边栏或嵌入内容。

&lt;footer&gt;定义最近一个章节内容或者根节点元素的页脚。一个页脚通常包含该章节作者、版权数据或者与文档相关的链接等信息。

&lt;section&gt;表示文档中的一个区域（或节），比如，内容中的一个专题组。

# css规范

## CSS属性书写顺序

（1）.文档流相关属性（display, position, float, clear, visibility, table-layout）

（2）.盒模型相关属性（width, height, margin, padding, border）

（3）.排版相关属性（font, line-height, text-align, text-indent, vertical-align）

（4）.装饰性相关属性（color, background, opacity, cursor）

（5）.文字排版（font, line-height, letter-spacing, color- text-align）

（6）.生成内容相关属性（background, border）

按照上述的顺序书写，可减少浏览器reflow(回流)，提升浏览器渲染dom的性能。

但上面只是列出部分属性，并不一定必须严格要求规范，因为一个最佳实践，与标准和性能无关，并且有些属性难以归类。

作者从事css很多年，也做不到以上书写顺序。不过目前有css顺序工具，有兴趣可以了解csscomb或在线工具。

# html页面开发流程

根据以上介绍，我们整理一下html页面的开发流程。

1、设计开发页面的设计稿，或原型图。

![图1](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/html5_1.png)

2、根据设计稿和是否需要响应式布局搭建html框架结构。

```html
<body>
	<header>
		<h1></h1>
		<nav></nav>
	</header>
	<article>
		<section></section>
		<section></section>
		...
	</article>
	<footer></footer>
</body>
```

3、再对应设计稿每个部分编辑html，并加入文档或图片。

```html
<body>
	<header>
		<h1>冰山工作室</h1>
		<nav>
			<ul>
				<li>首页</li>
				<li>陪你读书</li>
				<li>全部文章</li>
				<li>冰山社团</li>
				<li>联系我们</li>
			</ul>
		</nav>
	</header>
	<article>
		<section>
			<h2>陪你读书</h2>
			<ul>
				<li>script的历史</li>
				<li>在html中使用script</li>
				<li>基础知识</li>
				<li>数据类型</li>
			</ul>
		</section>
   ...
  </article>
  <footer>
		icp备案：123123123
	</footer>
</body>
```

4、调整html标签元素，在没有css样式情况下，可以浏览html内空。

![图3](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/html5_3.png)

5、加入css样式，逐步调整达到设计稿的样式需求。



## 总结

画页面原型 —— html结构 —— 加入文档 —— css渲染 —— 最后的修改调整 —— 页面OK

