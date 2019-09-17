---
title: HTML ruby标签从入门到应用
date: 2019-05-23 14:00:00
tags:
  - JavaScript
categories: JavaScript
---

ruby标签
<!--more-->

> HTML 5 发布时新增了一款偏门标签<ruby>，用来对文字(主要是东亚地区)(也就是汉字)的发音做标注的标签，<ruby>标签是父级标签，具体有'内容'`<rb>`/'标注'`<rt>`/‘备选’`<rp>`



### 一、<ruby>是什么
一句话加上一张简单效果图应该就可以让你搞懂这个标签究竟是做什么的。

为文字标注发音。

上图：
![图1.png](https://upload-images.jianshu.io/upload_images/4128599-3b754287b1164e7a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

汉字 + 汉语拼音(不局限于汉语拼音)。


### 二、<ruby>怎么用

导语部分介绍了`<ruby>`下三个主要子标签`<rb> <rt> <rp>`, 
`<rb>` - 下方内容主体，
`<rt>` - 上方标注内容
`<rp>` - 当浏览器不兼容时备选显示内容

简单的栗子：
```
<ruby>
    <rb>英雄</rb>
    <rt>えいゆう</rt>
    <rp>(えいゆう)</rp>
</ruby>
```
示例图：
![图2.png](https://upload-images.jianshu.io/upload_images/4128599-395c0948da61a0af.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

当然，对应汉语拼音与其他任何语言标注，都可以简单的处理

```
<ruby>
    <rb>冰山工作室</rb>
    <rt>bing shan gong zuo shi</rt>
</ruby>
```
![图3.png](https://upload-images.jianshu.io/upload_images/4128599-711797e1bde2b1b5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


做一个静态自动添加拼音的demo（含音调字符可以映射拼写，多语言或复杂场景需要服务器词库支持）
![图7.png](https://upload-images.jianshu.io/upload_images/4128599-3e96f35d4add5e9b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



到这里为止，基本就是这个标签的全部应用了，就是这么的简单友好， 虽说是针对东亚文字，但是你完全可以按照你的意愿对内容和标注内容进行自定义~~（比如英文标注汉字？）~~。

**兼容性：**强调`<ruby>`标签本身，IE8以上及各大主流浏览器都支持，但是除了他本身，基本都不支持。

PS: 带有声调的汉语拼音需要输入法切换，同理可证的。

### 三、认识也暂时没什么用的标签

在介绍这两个子标签之前，我所看过的关于<ruby>的介绍文章，大多数都没有包含<rt>，而是省略直接用字符串后接<rt>标签内容，不过并不推荐这么做。

**前提：**目前只有`Firefox`浏览器支持，其他任何浏览器都将忽略该标签（也就是会显示`<rp>`标签内的内容）

- `<rbc>`标签，`<rb>`标签的集合，一个`<ruby>`主体中**只能存在一个**，多个默认第一个有效，其实就是来管理所有的`<rb>`标签，（Q: 不用行不行？A: 完全没问题，顶多DOM不那么那么规范）

- `<rtc>`标签，`<rt>`标签的加强版，注意，不是合集！一个内容标签最多可以对应两个`<rtc>`标签
这个标签在一定场景下还是有用处的，比如一个场景栗子：
![图4.png](https://upload-images.jianshu.io/upload_images/4128599-44644a36ffe6e3df.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

上面英文，中间汉字，下面汉语拼音，很多字幕翻译都会有这种情况，
如果你头铁要采用双`<rt>`中间`<rb>`的战术，不用试，不好用。~~我试过了~~

这个时候就需要上下两层注释内容，可以采用上下都用`<rtc>`或者一个`<rtc>` + `<rt>`的组合。

```
    <ruby>
        <rbc>
            <rb>早</rb><rp>(</rp><rt>zao</rt><rp>)</rp>
            <rb>上</rb><rp>(</rp><rt>shang</rt><rp>)</rp>
            <rb>好</rb><rp>(</rp><rt>hao</rt><rp>)</rp>
        </rbc>
        <rtc style="ruby-position: under;">
            <rp>(</rp><rt>おはよう</rt><rp>)</rp>
        </rtc>
    </ruby>
```
![图5.png](https://upload-images.jianshu.io/upload_images/4128599-df870cfd91e15100.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

或者
```
<ruby>
    <rb>冰山工作室</rb>
    <rtc style = "ruby-position: over"><rt>bing shan gong zuo shi</rt></rtc>
    <rtc style = "ruby-position: under"><rt>bing shan gong zuo shi</rt></rtc>
</ruby>
```

![图6.png](https://upload-images.jianshu.io/upload_images/4128599-3dcd72abed6e5c34.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



### 四、<ruby>属性与样式

1. 首先， `<ruby>`标签和所有HTML标签一样，支持所有常规的标签属性和事件绑定，也支持对应的CSS样式

**注:** 以下样式目前仅`Firefox`全支持。(别急，别的浏览器也有办法的)

2. `ruby-position` ：上述代码中出现了`ruby-position` 样式，是`<ruby>`标签特有样式，
`ruby-position` 控制`<ruby>`标签内容与标注文字的相对位置。样式值：
    -  `over` 水平文本的上方渲染标注，在垂直文本的右侧渲染。默认值。
    - `under` 水平文本的下方渲染标注，垂直文本底部左侧渲染。
    - `inter-character` 在每个字符的右侧渲染水平文本的红宝石文本，会强制垂直显示内容文本。（目前未实装）

3. `ruby-align`: 表示内容与标注的文字对齐方式
    - `start` 起始位置对齐(左对齐)
    - `center` 居中
    - `space-between` 均匀分布
    - `space-around` 在其框内均匀分布内容，但不一定从边缘到边缘填充空间。

4. `ruby-merge`: 这个属性首先个人觉得没用，其次**没有实装**。用来整合`<ruby>`标签的。
     - `separate`:  整合相邻`<ruby>`标签的内容（也就是`<rb>`），再简单点说，省一个`<ruby>`，好的下一位。
     - `collapse`: 整合同一行的内容与标注文本，简单的理解就是，同行下省了若干`<rb> <rt>`标签。

5. 那么，如果不能使用`Firefox`怎么办，用其他CSS样式写呗  (~~又没说不支持`text-align`~~)



------

*PS：*
1. 目前在`Chrome`浏览器中已经开始支持部分内容（比如将标注放在内容下方），但是值得注意的是，属性值完全不一样。
2. 即使不用`<ruby>`，文本标签配合CSS一样可以实现。

*引用:*
1. https://www.chenhuijing.com/blog/html-ruby/#%F0%9F%91%9F