---
title: 每天一点网站优化之：给vue应用添加骨架屏
date: 2019-07-30 17:00:00
tags: 
    -JavaScript 
categories: JavaScript
---
骨架屏是在页面数据尚未加载完成前先给用户展示出页面的大致结构, 解决了js加载时间过长页面白页的问题，同时，相对于loading动画，骨架屏的过渡效果更加平滑，用户体验更好。
骨架屏可以由开发人员手动编写，这篇文章中我们使用chrome推出的Node库puppeteer，自动为页面生成相应的骨架屏。
<!--more-->
这篇文章主要分为以下几点
- puppeteer介绍
- puppeteer使用
- 骨架屏的生成原理
- vue项目如何引入骨架屏
- 成熟的骨架屏组件介绍
# 1.puppeteer
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1564466057770.png)

Puppeteer 是一个 Node 库，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome。Puppeteer 默认以 headless 模式运行，但是可以通过修改配置文件运行“有头”模式。

puppeteer可以通过node自动打开浏览器，并且在真实的浏览器环境中执行代码，因此可以应用于自动化黑盒测试等场景。
我们这次用puppeteer打开指定页面并且操作dom，从而得到真实页面的骨架屏版本截图。
 
对puppeteer想要有更多了解的同学可以访问
- [puppeteer的github](https://github.com/GoogleChrome/puppeteer)
- [puppeteer中文文档](https://zhaoqize.github.io/puppeteer-api-zh_CN/#/)

在项目中使用puppeteer很简单，但是由于一些网络原因，在国内直接npm安装会无法获取Chromium报错。

网上普遍的解决方案是在安装puppeteer的时候跳过Chromium，再去Chromium官网下载最新版本Chromium,最后在使用的时候修改Chromiumd的引用路径。

更好的方法是通过淘宝镜像cnpm安装puppeteer,亲测可用，并且速度惊人：
```javascript
cnpm install -g puppeteer
```

# 2.puppeteer的使用
puppeteer中文API文档中有很多demo，我们这里主要使用了puppeteer的 Browser对象和 Page对象，Browser用于操作浏览器对象，page用于操作document对象

以下为puppeteer使用的基本语法：
```javascript
var skelentonOptions = {
    url:'http://localhost:8081',
    width:375,
    height:667
};

async function getSkeleton(option = {}){
        //创建指定尺寸的浏览器窗口
        const browser = await puppeteer.launch({headless:true,defaultViewport:{width:option.width, height:option.height}});
        //新建tab页
        const page = await browser.newPage();
        //打开页面 指定路径
        await page.goto(option.url,{waitUntil: 'networkidle0'});
        
        //具体逻辑
        //...

        // 截屏首页
        await page.screenshot({
            path: 'ske.png',
            type: 'png',
            clip:{
                x:0,
                y:0,
                width:option.width,
                height:option.height
            }
        })
        
        //关闭虚拟chrome
        await browser.close();
}

getSkeleton(skelentonOptions);
```
# 3.骨架屏的生成原理
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1564468224211.png
)
市面上常见的骨架屏如上，简单来说就是将内容区简化为色块。如果内容不是经常变化的话，甚至可以用一张写死的图片替换。如果是经常变化的页面，
就需要使用工具构建骨架屏。

我的替换思路是页面加载后，找到文字和图片，文字部分替换颜色和背景色为灰色，图片部分用一张默认图代替，dom其他的部分隐藏。

下面是修改dom部分的代码：
```javascript
var body = document.getElementsByTagName('body')[0],
spanList = Array.from(document.getElementsByTagName('span')),
pList = Array.from(document.getElementsByTagName('p')),
h1List = Array.from(document.getElementsByTagName('h1')),
h2List = Array.from(document.getElementsByTagName('h2')),
h3List = Array.from(document.getElementsByTagName('h3')),
h4List = Array.from(document.getElementsByTagName('h4')),
h5List = Array.from(document.getElementsByTagName('h5')),
h6List = Array.from(document.getElementsByTagName('h6')),
spanLen = spanList.length,
pLen = pList.length,
h1Len = h1List.length,
h2Len = h2List.length,
h3Len = h3List.length,
h4Len = h4List.length,
h5Len = h5List.length,
h6Len = h6List.length,
imgList = document.getElementsByTagName('img'),
imgLen = imgList.length;

// 隐藏其他元素
body.style.visibility = 'hidden';

// 修改字体样式
var textList = spanList.concat(pList, h1List, h2List, h3List, h4List, h5List, h6List),
textLen = spanLen + pLen + h1Len + h2Len + h3Len + h4Len + h5Len + h6Len;

for(let i = 0;i < textLen;i++){
textList[i].style.color = '#eee';
textList[i].style.backgroundColor = '#eee';
textList[i].style.visibility = 'visible';
}
// 修改图片样式
for(let i = 0;i<imgLen;i++){
imgList[i].src = 'http://image1.51tiangou.com/tgou2/img/bg-load.png';
imgList[i].style.backgroundColor = '#eee';
imgList[i].style.visibility = 'visible';
}
```
dom几点修改完毕之后，使用puppeteer的截屏功能，得到指定大小的首页骨架屏图片一张。

# 4.vue项目引入骨架屏
vue项目的入口文件index.html只有很简单的结构
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title>carry_cli_test</title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but carry_cli_test doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app">
    </div>
    <!-- built files will be auto injected -->
  </body>
</html>
```
当js执行完之后，会用vue渲染成的dom将div#app 完全替换掉

因此，我们把骨架屏图片放在div#app中

下面看一下效果

# 5.vue-skeleton-webpack-plugin和page-skeleton-webpack-plugin的使用
二者都是webpack插件。

vue-skeleton-webpack-plugin使用了服务端渲染的原理
[vue-skeleton-webpack-plugin的使用](https://github.com/lavas-project/vue-skeleton-webpack-plugin)
page-skeleton-webpack-plugin是饿了么团队开发的，原理与本文类似，感兴趣的同学可以看下这篇教程
[自动化生成 H5 骨架页面](https://zhuanlan.zhihu.com/p/34702561)



