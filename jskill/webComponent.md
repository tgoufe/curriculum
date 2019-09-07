---
title: 每天一点网站优化之：图片懒加载
date: 2019-05-29 17:00:00
tags: 
    -JavaScript  
    -closure
categories: JavaScript
---
小c同学是一名前端程序猿。
这一天，大boss给他下了一个指令：我们的网站图片太多太大，太浪费网络资源了，我要节省流量又不要降低图片质量，你看着办吧。
于是，小c同学想到了图片懒加载：当图片没有出现在用户屏幕上时，用一张轻量级的占位图片代替，图片出现后用js动态替换为高质量图片。
接下来，小c同学抄起键盘开始了敲代码之旅。。。。。。
<!--more-->
要实现图片懒加载，基本的思路是监听浏览器滚动事件，不断对比目标元素距离屏幕下方的距离，当目标元素滚动到指定位置时，执行js代码。
# scrollTop+offsetTop方法
![scroll](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1559399769509.png
)
1. 网页当前向上滚动的高度scrollTop
2. 目标元素距离网页body顶端的距离
3. 用户可见区域高度window.innerHeight
当满足 offsetTop - scrollTop <= innerHeight的时候，代表元素进入可见区域

## 获取滚动高度scrollTop
- pageYOffset属于window对象，IE9+ 、firefox、chrome，opera均支持该方式获取页面滚动高度值，并且会忽略Doctype定义规则。
- body是DOM对象里的body子节点，即 body 标签
- documentElement是整个节点树的跟节点，即 html 标签

在不以上三种不同的方法在各种浏览器下的兼容性各不相同
兼容性表格如下：

|   浏览器\获取滚动高度方法  | window.pageYOffset | document.documentElement.scrollTop |document.body.scrollTop |
|:------------- |:---------------:| :-------------:| :-------------:|
| chrome      | Y | Y | N |
| firefox      | Y | Y | N |
| IE11及以上 | Y | Y | N |
| ios | Y | N | Y |
| android(wchat+原生浏览器) | Y | N | Y |


完整的兼容性代码
```javascript
var supportPageOffset = window.pageXOffset !== undefined;
var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
```

## 网页高度知多少
![image tops](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/tops.png);
![image brower](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/brower.png);
网页可见区域宽：document.body.clientWidth 
网页可见区域高：document.body.clientHeight 
网页可见区域宽：document.body.offsetWidth (包括边线的宽) 
网页可见区域高：document.body.offsetHeight (包括边线的宽) 
网页正文全文宽：document.body.scrollWidth 
网页正文全文高：document.body.scrollHeight 
网页被卷去的高：document.body.scrollTop 
网页被卷去的左：document.body.scrollLeft 
网页正文部分上：window.screenTop 
网页正文部分左：window.screenLeft 
屏幕分辨率的高：window.screen.height 
屏幕分辨率的宽：window.screen.width 
屏幕可用工作区高度：window.screen.availHeight 
屏幕可用工作区宽度：window.screen.availWidth 
窗口不包括工具栏和滚动条高度： window.innerHeight
窗口不包括工具栏和滚动条宽度： window.innerWidth

图片懒加载是检测图片是否进入用户可见视野，所以选择window.innerHeight作为浏览器的高度。

## 方法实现
```javascript
let offsetTop = element.offsetTop; //元素相对body左上角的高度
let scrollTop = getScrollTop().top; //网页滚动高度
let innerHeight = window.innerHeight; //可用窗口高度

if(offsetTop - scrollTop <= innerHeight){
    inViewFun.call(this);
}
```
该方法的缺点是offsetTop相对父元素来说的，如果目标图片元素的父元素不是body，则会有问题。
# 利用 getBoundingClientRect 方法
- element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/boundingClientRect.png)
## 方法实现
```javascript
var rect = element.getBoundingClientRect();
if((rect && rect.top) <= window.innerHeight ){//进入视野
    inViewFun.call(this);
}
```
# 优化 
## scroll监听事件加入防抖
## 加入固定高度，使图片预先加载
完整代码
```javascript
function lazyLoad(element, inViewFun, fixedTop, a){
    scrollHandler();
    if(window.addEventListener){
        window.addEventListener('scroll',debounce(scrollHandler));
    }else{ //IE
        window.attachEvent('scroll',debounce(scrollHandler));
    }

    //获取网页滚动高度
    function getScrollTop(){
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

        var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
        var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
        return {left:x, top:y};
    }

    // function scrollHandler(){
    // 	let offsetTop = element.offsetTop; //元素相对body左上角的高度
    // 	let scrollTop = getScrollTop().top; //网页滚动高度
    // 	let innerHeight = window.innerHeight; //可用窗口高度

    // 	if(offsetTop - scrollTop <= innerHeight){
    // 		inViewFun.call(this);
    // 	}
    // }

    function scrollHandler(){
        var rect = element.getBoundingClientRect();
        if((rect && rect.top) <= window.innerHeight + fixedTop ){//进入视野
            inViewFun.call(this);
        }
    }
}
```
   
# intersection observer

图片懒加载可利用intersection observer, 目前只能在Chrome63+和firefox58+使用
比起事件监听，Intersection observer用起来比较简单，可阅读性也大大提高。开发者只需要注册一个observer去监控元素而不是写一大堆乱七八糟的视窗检测代码。注册observer之后我们只需要做的就是当元素可见时改变它的行为。
```html
<img class="lazy" src="placeholder-image.jpg" data-src="image-to-lazy-load-1x.jpg" data-srcset="image-to-lazy-load-2x.jpg 2x, image-to-lazy-load-1x.jpg 1x" alt="I'm an image!">
```
- class：用于在JavaScript中关联元素
- src属性：指向了一张占位图片，图片在页面的第一次加载会显现
- data-src和data-srcset属性：这是占位属性，里面放的是目标图片的url
```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to a more compatible method here
  }
});
```