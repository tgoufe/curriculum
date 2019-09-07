---
title: 性能优化之防抖函数——debounce
date: 2019-04-26 11:00:00
tags: 
    - 性能优化
    - 手撸框架
categories: JavaScript
---

在页面上的某些事件触发频率非常高，比如滚动条滚动、窗口尺寸变化、鼠标移动等，如果我们需要注册这类事件，不得不考虑效率问题。而防抖函数就是为了解决这一类问题而出现的。

<div style="width: 100%;text-align: center;">
    <iframe style="width:100%;height:540px;" src="//player.bilibili.com/player.html?aid=50482255&cid=88373289&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
</div>
<!--more-->

## 前言 

在页面上的某些事件触发频率非常高，比如滚动条滚动、窗口尺寸变化、鼠标移动等，如果我们需要注册这类事件，不得不考虑效率问题。

当窗口尺寸发生变化时，哪怕只变化了一点点，都有可能造成成百上千次对处理函数的调用，这对网页性能的影响是极其巨大的。

于是，我们可以考虑，每次窗口尺寸变化、滚动条滚动、鼠标移动时，不要立即执行相关操作，而是等一段时间，以窗口尺寸停止变化、滚动条不再滚动、鼠标不再移动为计时起点，一段时间后再去执行操作。

## 例子
我们来列举一个关于鼠标移动的例子：

```html
<div id="container"></div>
```
```stylus
div{
    height: 200px;
    line-height: 200px;
    text-align: center; color: #fff;
    background-color: #444;
    font-size: 25px;
    border-radius: 3px;
}
```
```javascript 1.8
let count = 1;
let container = document.getElementsByTagName('div')[0];
function updateCount() {
    container.innerHTML = count ++ ;
}
container.addEventListener('mousemove',updateCount);
```
我们来看一下效果：           

![avatar](https://raw.githubusercontent.com/chenqf/blog/master/articles/javascript进阶/防抖函数/1.gif)

我们可以看到，鼠标从左侧滑到右侧，我们绑定的事件执行了119多次

这个例子很简单，浏览器完全反应的过来，但如果在频繁的事件回调中做复杂计算，很有可能导致页面卡顿，不如将多次计算合并为一次计算，只在一个精确点做操作。


为了处理这个问题，一般有两种解决方案：
+ debounce 防抖
+ throttle 节流

PS：防抖函数和节流节流函数的作用都是防止函数多次调用。区别在于，假设一个用户一直触发这个函数，我们设定一个最小触发时间,当每次触发函数的间隔小于最小触发时间，防抖的情况下只会调用一次，而节流的 情况会每隔一个最小触发时间调用函数。

关于节流函数部分，请看下一篇文章。

## 防抖
防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!

### 防抖的简单实现
```javascript 1.8
/**
 * 防抖函数
 * @param func 用户传入的防抖函数
 * @param wait 等待的时间
 */
const debounce = function (func,wait = 50) {
    // 缓存一个定时器id
    let timer = null;
    // 这里返回的函数时每次用户实际调用的防抖函数
    // 如果已经设定过定时器了就清空上一次的定时器
    // 开始一个定时器，延迟执行用户传入的方法
    return function(...args){
        if(timer) clearTimeout(timer);
        timer = setTimeout(()=>{
            //将实际的this和参数传入用户实际调用的函数
            func.apply(this,args);
        },wait);
    }
};
```
使用这个防抖函数应用在最开始的例子上：
```javascript 1.8
container.addEventListener('mousemove',debounce(updateCount,100));
```

![avatar](https://raw.githubusercontent.com/chenqf/blog/master/articles/javascript进阶/防抖函数/2.gif)

我们可以看到，不管我们怎么移动，我们绑定的回调事件都是在鼠标停止后100ms后才会触发。


这是一个简单版的防抖，但是有缺陷，这个防抖只能在最后调用。一般的防抖会有immediate选项，表示是否立即调用。这两者的区别，举个栗子来说：
+ 在搜索引擎搜索问题的时候，我们当然是希望用户输入完最后一个字才调用查询接口，这个时候适用延迟执行的防抖函数，它总是在一连串（间隔小于wait的）函数触发之后调用。
+ 用户在点赞的时候，我们希望用户点第一下的时候就去调用接口，并且成功之后改变star按钮的样子，用户就可以立马得到反馈是否star成功了，这个情况适用立即执行的防抖函数，它总是在第一次调用，并且下一次调用必须与前一次调用的时间间隔大于wait才会触发。

### 立即执行的防抖函数

```javascript 1.8
/**
 * 防抖函数
 * @param func 用户传入的防抖函数
 * @param wait 等待的时间
 * @param immediate 是否立即执行
 */
const debounce = function (func,wait = 50,immediate = false) {
    // 缓存一个定时器id
    let timer = null;
    // 这里返回的函数时每次用户实际调用的防抖函数
    return function(...args){
        // 如果已经设定过定时器了就清空上一次的定时器
        if(timer) clearTimeout(timer);
        if(immediate){
            let callNow = !timer;
            //等待wait的时间间隔后，timer为null的时候，函数才可以继续执行
            timer = setTimeout(()=>{
                timer = null;
            },wait);
            //未执行过，执行
            if(callNow) func.apply(this,args);
        }else{
            // 开始一个定时器，延迟执行用户传入的方法
            timer = setTimeout(()=>{
                //将实际的this和参数传入用户实际调用的函数
                func.apply(this,args);
            },wait);
        }
    }
};
```

![avatar](https://raw.githubusercontent.com/chenqf/blog/master/articles/javascript进阶/防抖函数/3.gif)

### 返回值
此时要注意，用户传入的函数可能是有返回值的，但是当immediate为false的时候，因为使用了setTimeout，函数的返回值永远为undefined,所以我们只在immediate为true的时候返回函数的返回值
```javascript 1.8
/**
 * 防抖函数
 * @param func 用户传入的防抖函数
 * @param wait 等待的时间
 * @param immediate 是否立即执行
 */
const debounce = function (func,wait = 50,immediate = false) {
    // 缓存一个定时器id
    let timer = null;
    let result;
    // 这里返回的函数时每次用户实际调用的防抖函数
    return function(...args){
        // 如果已经设定过定时器了就清空上一次的定时器
        if(timer) clearTimeout(timer);
        if(immediate){
            let callNow = !timer;
            //等待wait的时间间隔后，timer为null的时候，函数才可以继续执行
            timer = setTimeout(()=>{
                timer = null;
            },wait);
            //未执行过，执行
            if(callNow) result = func.apply(this,args);
        }else{
            // 开始一个定时器，延迟执行用户传入的方法
            timer = setTimeout(()=>{
                //将实际的this和参数传入用户实际调用的函数
                func.apply(this,args);
            },wait);
        }
        return result;
    }
};
```

### 取消
最后我们再思考一个小需求，我希望能取消 debounce 函数，比如说我 debounce 的时间间隔是 10 秒钟，immediate 为 true，这样的话，我只有等 10 秒后才能重新触发事件，现在我希望有一个按钮，点击后，取消防抖，这样我再去触发，就可以又立刻执行啦

```javascript 1.8
/**
 * 防抖函数
 * @param func 用户传入的防抖函数
 * @param wait 等待的时间
 * @param immediate 是否立即执行
 */
const debounce = function (func,wait = 50,immediate = false) {
    // 缓存一个定时器id
    let timer = null;
    let result;
    let debounced = function (...args) {
        // 如果已经设定过定时器了就清空上一次的定时器
        if(timer) clearTimeout(timer);
        if(immediate){
            let callNow = !timer;
            //等待wait的时间间隔后，timer为null的时候，函数才可以继续执行
            timer = setTimeout(()=>{
                timer = null;
            },wait);
            //未执行过，执行
            if(callNow) result = func.apply(this,args);
        }else{
            // 开始一个定时器，延迟执行用户传入的方法
            timer = setTimeout(()=>{
                //将实际的this和参数传入用户实际调用的函数
                func.apply(this,args);
            },wait);
        }
        return result;
    };
    debounced.cancel = function(){
        clearTimeout(timer);
        timer = null;
    };
    // 这里返回的函数时每次用户实际调用的防抖函数
    return debounced;
};
```
在原页面的基础上，修改如下
```stylus
div{
    height: 200px;
    line-height: 200px;
    text-align: center; color: #fff;
    background-color: #444;
    font-size: 25px;
    border-radius: 3px;
}
```
```html
<div id="container"></div>
<button id="cancel">点击取消防抖</button>
```
```javascript 1.8
 
let count = 1;
let container = document.getElementsByTagName('div')[0];
let button = document.getElementById('cancel');
function updateCount() {
    container.innerHTML = count ++ ;
}
let action = debounce(updateCount,10000,true);

container.addEventListener('mousemove',action);
button.addEventListener('click',action.cancel);
```
![avatar](https://raw.githubusercontent.com/chenqf/blog/master/articles/javascript进阶/防抖函数/4.gif)
 
至此我们已经完成了一个 debounce 函数