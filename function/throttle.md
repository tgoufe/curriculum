---
title: 性能优化之节流函数——throttle
date: 2019-05-05 11:00:00
tags: 
    - 性能优化
    - 手撸框架
categories: JavaScript
---

防抖函数和节流函数本质是不一样的。防抖函数是将多次执行变为最后一次执行或第一次执行，节流函数是将多次执行变成每隔一段时间执行。

<!--more-->

# 节流函数

## 前言 

防抖函数和节流函数本质是不一样的。防抖函数是将多次执行变为最后一次执行或第一次执行，节流函数是将多次执行变成每隔一段时间执行。  

比如说，当当我们做图片懒加载（lazyload）时，需要通过滚动位置，实时显示图片时，如果使用防抖函数，懒加载（lazyload）函数将会不断被延时，
当我们做图片懒加载（lazyload）时，需要通过滚动位置，实时显示图片时，如果使用防抖函数，懒加载（lazyload）函数将会不断被延时，
只有停下来的时候才会被执行，对于这种需要周期性触发事件的情况，防抖函数就显得不是很友好了，此时就应该使用节流函数来实现了。

## 例子
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

![avatar](https://raw.githubusercontent.com/chenqf/blog/master/articles/javascript进阶/节流函数/1.gif)

我们可以看到，鼠标从左侧滑到右侧，我们绑定的事件执行了119次

## 节流函数的实现
现在我们来实现一个节流函数，使得鼠标移动过程中每间隔一段时间事件触发一次。
   
### 使用时间戳来实现节流
首先我们想到使用时间戳计时的方式，每次事件执行时获取当前时间并进行比较判断是否执行事件。
```javascript
/**
 * 节流函数
 * @param func 用户传入的节流函数
 * @param wait 间隔的时间
 */
const throttle = function (func,wait = 50) {
    let preTime = 0;
    return function (...args) {
        let now = Date.now();
        if(now - preTime >= wait){
            func.apply(this,args);
            preTime = now;
        }
    }
};
```
```javascript
let count = 1;
let container = document.getElementsByTagName('div')[0];
function updateCount() {
    container.innerHTML = count ++ ;
}
let action = throttle(updateCount,1000);

container.addEventListener('mousemove',action);
```
![avatar](https://raw.githubusercontent.com/chenqf/blog/master/articles/javascript进阶/节流函数/2.gif)

此时当鼠标移入的时候，事件立即执行，在鼠标移动的过程中，每隔1000ms事件执行一次，旦在最后鼠标停止移动后，事件不会被执行        
此时会有这样的两个问题：
+ 如果我们希望鼠标刚进入的时候不立即触发事件，此时该怎么办呢？
+ 如果我们希望鼠标停止移动后，等到间隔时间到来的时候，事件依然执行，此时该怎么办呢？

### 使用定时器实现节流
为满足上面的需求，我们考虑使用定时器来实现节流函数   
当事件触发的时候，我们设置一个定时器，再触发的时候，定时器存在就不执行，等到定时器执行并执行函数，清空定时器，然后接着设置定时器
```javascript 1.8
/**
 * 节流函数
 * @param func 用户传入的节流函数
 * @param wait 间隔的时间
 */
const throttle = function (func,wait = 50) {
    let timer = null;
    return function (...args) {
        if(!timer){
            timer = setTimeout(()=>{
                func.apply(this,args);
                timer = null;
            },wait);
        }
    }
};
```
使用这个定时器节流函数应用在最开始的例子上：
```javascript 1.8
let action = throttle(updateCount,2000);

container.addEventListener('mousemove',action);
```

![avatar](https://raw.githubusercontent.com/chenqf/blog/master/articles/javascript进阶/节流函数/3.gif)

我们可以看到，当鼠标移入的时候，时间不会立即执行，等待2000ms后执行了一次，此后2000ms执行一次，当鼠标移除后，前一次触发事件的时间2000ms后还会触发一次事件。

### 比较时间戳节流与定时器节流
+ 时间戳节流
    + 开始时，事件立即执行
    + 停止触发后，没有办法再执行事件
+ 定时器节流
    + 开始时，会在间隔时间后第一次执行
    + 停止触发后，依然会再次执行一次事件
    
对于我们日常的工作需求来说，可能出现的需求是，既需要开始时立即执行，也需要结束时还能再执行一次的节流函数。   

### 综合时间戳节流和定时器节流
```javascript
/**
 * 节流函数
 * @param func 用户传入的节流函数
 * @param wait 间隔的时间
 */
const throttle = function (func,wait = 50) {
    let preTime = 0,
        timer = null;
    return function (...args) {
        let now = Date.now();
        // 没有剩余时间 || 修改了系统时间
        if(now - preTime >= wait || preTime > now){
            if(timer){
                clearTimeout(timer);
                timer = null;
            }
            preTime = now;
            func.apply(this,args);
        }else if(!timer){
            timer = setTimeout(()=>{
                preTime = Date.now();
                timer = null;
                func.apply(this,args)
            },wait - now + preTime);
        }
    }
};
```
使用这个定时器节流函数应用在最开始的例子上：
```javascript 1.8
let action = throttle(updateCount,2000);

container.addEventListener('mousemove',action);
```
![avatar](https://raw.githubusercontent.com/chenqf/blog/master/articles/javascript进阶/节流函数/4.gif)

我们可以看到，当鼠标移入时，事件立即执行，之后每间隔2000ms后，事件均会执行，当鼠标离开时，前一次事件触发2000ms后，事件最后会再一次执行

我们继续考虑下面的场景 
+ 有时候我们的需求变成鼠标移入时立即执行，鼠标移除后事件不在执行呢？
+ 有时候我们的需求变成鼠标移入时不立即执行，鼠标移除后事件还会执行呢？

### 继续优化

我们设置 opts 作为 throttle 函数的第三个参数，然后根据 opts 所携带的值来判断实现那种效果，约定如下：   
+ leading : Boolean 是否使用第一次执行   
+ trailing : Boolean 是否使用停止触发的回调执行

修改代码如下：
```javascript
/**
 * 节流函数
 * @param func 用户传入的节流函数
 * @param wait 间隔的时间
 * @param opts leading 是否第一次执行 trailing 是否停止触发后执行
 */
const throttle = function (func,wait = 50,opts = {}) {
    let preTime = 0,
        timer = null,
        { leading = true, trailing = true } = opts;
    return function (...args) {
        let now = Date.now();
        if(!leading && !preTime){
            preTime = now;
        }
        // 没有剩余时间 || 修改了系统时间
        if(now - preTime >= wait || preTime > now){
            if(timer){
                clearTimeout(timer);
                timer = null;
            }
            preTime = now;
            func.apply(this,args);
        }else if(!timer && trailing){
            timer = setTimeout(()=>{
                preTime = Date.now();
                timer = null;
                func.apply(this,args)
            },wait - now + preTime);
        }
    }
};
```
这里需要注意的是，leading：false 和 trailing: false 不能同时设置。
因为如果同时设置的时候，当鼠标移除的时候，停止触发的时候不会设置定时器，也就是说，等到过了设置的时间，preTime不会被更新，此后再次移入的话就会立即执行，就违反了  leading: false


### 取消
在 debounce 的实现中，我们加了一个 cancel 方法，throttle 我们也加个 cancel 方法：
```javascript 1.8
/**
 * 节流函数
 * @param func 用户传入的节流函数
 * @param wait 间隔的时间
 * @param opts leading 是否第一次执行 trailing 是否停止触发后执行
 */
const throttle = function (func,wait = 50,opts = {}) {
    let preTime = 0,
        timer = null,
        { leading = false, trailing = true } = opts,
        throttled = function (...args) {
            let now = Date.now();
            if(!leading && !preTime){
                preTime = now;
            }
            // 没有剩余时间 || 修改了系统时间
            if(now - preTime >= wait || preTime > now){
                if(timer){
                    clearTimeout(timer);
                    timer = null;
                }
                preTime = now;
                func.apply(this,args);
            }else if(!timer && trailing){
                timer = setTimeout(()=>{
                    preTime = Date.now();
                    timer = null;
                    func.apply(this,args)
                },wait - now + preTime);
            }
        };
    throttled.cancel = function () {
        clearTimeout(timer);
        timer = null;
        preTime = 0;
    };
    return throttled;
};
```

至此我们完成了一个节流函数。