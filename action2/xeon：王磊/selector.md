---
title: css 伪类
date: 2019-09-07 16:30:00
tags: css css3
categories: css css3
---

今天开始讲css经常用的东西，选择器。

<!--more-->

### css选择器

我们知道比较常见的id、class、后台选择器这些基本的css选择器。但这并不是css的全部。下面向大家系统的解析css中30个最常用的选择器，包括我们最头痛的浏览器兼容性问题。掌握了它们，才能真正领略css的巨大灵活性。

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

:first-child与first-of-type

:last-child与last-of-type

> 小技巧 :only-child和:only-of-type可以用其它方法实现。

```css
:only-child{
	style
}
//等于
:first-child:last-child{
	style
}
```

```
:only-of-type{
	style
}
//等于
:first-of-type:last-of-type{
	style
}
```

##### 5-选择每第n个子元素或某种元素

:nth-child与:nth-of-type(an+b)	首先查找当前所有匹配的兄弟元素，

:nth-last-child与:nth-last-of-type(an+b)	他们的用法跟上面一样，不过顺序是倒序开始。

#### 2、否定伪类

:not()选择不匹配的东西

> 小技巧 列表导航优化代码
```html
<ul>
	<li>首页</li>
	<li>新闻</li>
	<li>关于</li>
	<li>分享</li>
	<li>联系</li>
</ul>
```
```css
li{
  border-bottom:1px solid blue
}
li:last-child{
  border-bottom:0;
}
```
:not()属性
```css
li:not(:last-child){
	border-bottom:1px solid blue
}
```

:not()伪类不能嵌套，可以串联使用。

#### 3、伪元素选择符

:before与:after在元素之前或之后插入某些内容。

伪元素要配合content属性一起使用。

content属性可以直接利用attr获取元素的属性。

```css
img:after{
  content:attr(alt);
}
```

> 小技巧 这里会有一个被问到最多的问题，那就是伪类与伪元素的区别。

**伪类**

字面意思假的类。伪类其实是弥补了CSS选择器的不足，用来更方便地获取信息。

**伪元素**

字面意思假的元素。伪元素本质上是创建了一个虚拟容器(元素)，我们可以在其中添加内容或样式。

> 小技巧 伪元素单冒号与双冒号的区别。

比如 :before与::before

1. 二者写法是等效的，都表示伪元素。
2. :before是CSS2的写法，::before是CSS3的写法。
3. :before的兼容性比::before兼容性好，但是H5开发中建议使用::before

综合实例

分页

```html
<template>
    <div class="page flex-container center margint20">
        <div pageName="上一页"></div>
        <p v-for="($index,item) in 5" v-text="$index" :page="$index === 3 && 'current'"></p>
        <div pageName="下一页"></div>
    </div>
</template>
<style>
.page{
  .current{
    background: red;
    color:white;
  }
  &>*{
    border:1px solid red;
    margin:0 5px;
  }
  text-align: center;
  font-size: 12px;
  color:red;
  &>div{
    width:60px;
    height:30px;
    line-height: 30px;
    border:1px red solid;
    &:first-of-type{
      border-radius:30px 2px 2px 30px;
      &:after{
        content:'上一页'
      }
    }
    &:last-of-type{
      border-radius:2px 30px 30px 2px;
      &:after{
        content:'下一页'
      }
    }
  }
  &>p{
    border-radius:2px;
    width:30px;
    height:30px;
    line-height: 30px;
    &[page='current']{
      @extend .current;
    }
    &:only-of-type{
      @extend .current;
      // @at-root .page>div{
      //   display:none;
      // }
    }

  }
  &>*:hover{
    @extend .current;
  }
}
</style>
```

时间树

```html
<template>
	<div class="timeTree margint50">
        <div class="times" v-for="item in 3">
            <div class="clearfix">
                <div><img src="../../assets/bingshanbear.svg" width="30" alt=""></div>
                <div>
                    <h1>标题</h1>
                    <p class="text-dark">内容</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.timeTree{
  position: relative;
  &:before,&:after{
    position:absolute;
    content: '';
    width:40px;
    height:40px;
    z-index: 1;
    left: 50%;
    margin-left: -20px;
  }
  &:before{
    top: -30px;
    background: url('../../assets/start.svg') no-repeat;
    background-size: 100% auto;
  }
  &:after{
    bottom:10px;
    background: url('../../assets/end.svg') no-repeat;
    background-size: 100% auto;
  }
  &:after{}
  .times{
    position:relative;
    padding:50px;
    &:after,&:before{
      position:absolute;
      content: '';
      width:50%;
      height:100%;
      border:10px solid currentColor;
      top:0;
    }
    &:before{
      border-width:20px;
    }
    &:nth-of-type(odd){
      .clearfix div:first-child{
        float:left;
      }
      .clearfix div:last-child{
        float:right;
      }
      &:after,&:before{
        left:0;
        border-top-left-radius:50px;
        border-bottom-left-radius:50px;
        border-right:0;
      }
    }
    &:nth-of-type(even){
      .clearfix div:first-child{
        float:right;
      }
      .clearfix div:last-child{
        float:left;
      }
      &:after,&:before{
        right:0;
        border-top-right-radius:50px;
        border-bottom-right-radius:50px;
        border-left:0;
      }
    }
    &:not(:first-of-type){
      margin-top:-20px;
    }
    &:nth-of-type(1){
      color:rgba(255,0,0,.5);
    }
    &:nth-of-type(2){
      color:rgba(0,0,255,.5);
    }
    &:nth-of-type(3){
      color:rgba(0,128,0,.5);
    }
    &:nth-of-type(4){
      color:orange;
    }
  }
  
}
</style>
```

[^]: 本示例采用cmui样式库，有兴趣可以访问下载
