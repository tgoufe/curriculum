---
title: 浅谈函数柯里化
date: 2019-07-04 11:00:00
tags: 
    - 高阶函数
categories: JavaScript
---

函数柯里化就是将接收多个参数的函数转变为一系列接收单一参数的函数，并且返回接收余下参数的函数。

<!--more-->

## 柯里化是什么

柯里化, 即 Currying 的音译。Currying 是编译原理层面实现多参函数的一个技术。

我们在编码的过程中，本质工作就是将复杂的问题分解成多个可编程的小问题。

Currying 就是将接收多个参数的函数转变为一系列接收单一参数的函数，并且返回接收余下参数的函数。

举例来说：

```javascript

//一个接收4个参数的函数
let demo = function(a,b,c,d){
    console.log([a,b,c,d]);
}

//假设我们有一个转换函数 curry

//生成一个柯里化函数
let _demo = curry(demo);

_demo(1)(2)(3)(4); // [1,2,3,4]

```

需要注意的是，在编译原理层面的柯里化，一次只能传递给函数一个参数；而我们在编程过程中实际使用的柯里化函数，是可以传递给函数一个或多个参数。

还是刚才的例子：

```javascript

//一个接收4个参数的函数
let fn = function(a,b,c,d){
    console.log([a,b,c,d]);
}

//假设我们有一个转换函数 curry

//生成一个柯里化函数
let _fn = curry(fn);

_fn(1)(2)(3)(4); // [1,2,3,4]
_fn(1,2)(3,4); // [1,2,3,4]
_fn(1)(2,3,4); // [1,2,3,4]

```

当我们知道柯里化是什么了的时候，我们来看看柯里化到底有什么用？

## 用途

来看一个例子：

```javascript
// 示意而已
function ajax(type, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.send(data);
}

// 虽然 ajax 这个函数非常通用，但在重复调用的时候参数冗余
ajax('POST', 'www.test.com', "name=kevin")
ajax('POST', 'www.test2.com', "name=kevin")
ajax('POST', 'www.test3.com', "name=kevin")

// 利用 curry
var ajaxCurry = curry(ajax);

// 以 POST 类型请求数据
var post = ajaxCurry('POST');
post('www.test.com', "name=kevin");

// 以 POST 类型请求来自于 www.test.com 的数据
var postFromTest = post('www.test.com');
postFromTest("name=kevin");
```

curry 的这种用途可以理解为：参数复用。本质上是降低通用性，提高适用性。

可是即便如此，是不是依然感觉没什么用呢？

再来看一个例子：

假设我们有这样一段数据：

```javascript
var personList = [{name: 'bingshan'}, {name: 'group'}]
```

现在我们需要将 personList 中的所有 name 值提取出来，放入一个变量 names 中。

通常情况下，我们会这样来实现：

```javascript
let names = list.map(function(item) {
  return item.name;
})
```

然而，使用柯里化的思想，我们会这样实现：

```javascript
var prop = curry(function(key,obj){
    return obj[key];
})
var names = person.map(prop('name'));
```

看到这个例子，可能很多人会说，使用柯里化的思想之后，变得更麻烦了。

其实不是的，prop 函数只需要创建一次，以后每次获取数组对象中的元素的时候，都可以拿来直接使用的，我们是可以将其看做是一个工具函数，与我们的业务代码无关。

那么此时，我们的业务代码就只剩一行了，并且看起来比传统书写方式更加直观易懂

```javascript
var names = person.map(prop('name'));
```

## 实现

接下来，我们来思考如何实现 curry 函数。

回想之前我们对于柯里化的定义，接收一部分参数，返回一个函数接收剩余参数，接收足够参数后，执行原函数。

```javascript
function curry(fn,...params){
    return function(...args){
        let _args = [...params,...args];
        if(_args.length >= fn.length){
            return fn.apply(this,_args);
        }else{
            return curry.call(this,fn,..._args);
        }
    }
}
```

验证一下：

```javascript
//一个接收4个参数的函数
let demo = function(a,b,c,d){
    console.log([a,b,c,d]);
}

let _demo = curry(demo);

_demo(1,2,3,4);         // print: [1,2,3,4]
_demo(1)(2)(3,4);       // print: [1,2,3,4]
_demo(1,2)(3,4);        // print: [1,2,3,4]
_demo(1)(2)(3)(4);      // print: [1,2,3,4]
```

## 优化

我们之前完成的 curry 函数，依赖与原函数的形参个数，只有接受的总参数个数大于等于原函数的形参个数时，才会调用原函数。

那么如果我们希望传入的参数个数在不等于原函数的形参个数的时候，原函数依然能执行，我们该怎么做呢？很简单，将 curry 函数修改一下：

```javascript
function curry(fn,len = fn.length,...params){
    return function(...args){
        let _args = [...params,...args];
        if(_args.length >= len){
            return fn.apply(this,_args);
        }else{
            return curry.call(this,fn,len,..._args);
        }
    }
}
```

再来验证一下：

```javascript
//一个接收4个参数的函数
let demo = function(a,b,c,d){
    console.log([a,b,c,d]);
}

//接收三个参数后，执行原函数
let _demo = curry(demo,3);

_demo(1)(2)(3); // [1,2,3,undefined]
```

## 扩展

对于我们常用的工具函数库 lodash 不仅提供了 curry 工具函数，还提供了参数占位符的玩法：

```javascript
import _ from 'lodash'
let demo = function(a,b,c,d){
    console.log([a,b,c,d]);
}
let _demo = _.curry(demo);
_demo(_,2)(1,_,4)(3) // [1,2,3,4]
```


## 参考链接

+ [JavaScript专题之函数柯里化](https://github.com/mqyqingfeng/Blog/issues/42)
