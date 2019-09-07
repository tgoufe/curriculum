---
title: 浅谈偏函数
date: 2019-07-18 11:00:00
tags: 
    - 高阶函数
categories: JavaScript
---


偏函数应用，英文是partial application，也被译作“部分应用”、“局部应用”、“偏应用”

<!--more-->

## 什么是偏函数

偏函数应用，英文是partial application，也被译作“部分应用”、“局部应用”、“偏应用”，下文为统一术语，统称为`部分应用`。

维基百科中对部分应用 (Partial application) 的定义为：

> In computer science, partial application (or partial function application) refers to the process of fixing a number of arguments to a function, producing another function of smaller arity.

翻译成中文:

在计算机科学中，`部分应用`是指固定一个函数的一些参数，然后产生另一个更小元的函数。

举个例子：

```javascript
function add(a,b){
    return a + b;
}
// 执行 add 函数，一次传入两个参数即可
add(1, 2) // 3

// 假设有一个 partial 函数可以做到部分应用
let addOne = partial(add, 1);

addOne(2) // 3
```

## 部分应用和柯里化的关系

`柯里化`和`部分应用`二者非常相似，很容易混淆

`柯里化`是一种将使用多个参数的函数转换成一系列使用一个参数的函数的技术,详细可见[函数柯里化](https://juejin.im/post/5d2299faf265da1bb67a3b65)。

`部分应用`指的是对一个函数应用一个或多个参数,但不是全部参数,在这个过程中创建一个新函数,这个函数用于接收剩余的参数

简单来说:

+ 柯里化:函数分解为多个函数,只有传入的参数数量与希望参数数量相同,函数才会调用
+ 部分应用:没有参数数量的限制,可以使用任意数量的参数来应用它

看一个例子:

```javascript
let f = function(a,b,c,d){
    console.log([a,b,c,d])
}

let _f1 = curry(f);
_f1(1)(2)(3) // fn 不会执行

let _f2 = partial(f,1,2);
_f2(3) // [1,2,3,undefined]


```

## partial

根据`部分应用`的概念，我们简单实现如下：

```javascript
function partial(fn,...args){
    return function(...params){
        return fn.apply(this,[...args,...params])
    }
}
```

通过一个例子，我们来验证一下：

```javascript
function fn(a,b,c){
    return [a,b,c];
}

let fn1 = partial(fn, 1); // 先应用1个参数
fn1(2,3);   // [1,2,3]
fn1(3);     // [1,3,undefined]

let fn2 = partial(fn, 1,2); // 先应用2个参数
fn2(3); // 6
```

partial 已经实现了，代码是不是非常的简单呢~

## 占位符

我们常用的工具库 lodash 也实现了 partial ,并且还提供了占位符的功能,来看一下:

```javascript

let greet = function(greeting, name) {
  return greeting + ' ' + name;
};

var sayHelloTo = _.partial(greet, 'hello');
sayHelloTo('fred'); // => 'hello fred'

// 使用了占位符。
var greetFred = _.partial(greet, _, 'fred');
greetFred('hi'); // => 'hi fred'
```

接下来我们来实现具有占位符功能的 partial 函数

```javascript
function partial(fn,...args){
    // 将 partial 函数自身作为占位符来进行判断
    // 可根据情况自行更替，lodash中将lodash自身作为占位符进行判断
    let _ = partial;
    return function(...params){
        let position = 0;
        let _args = args.reduce((init,cur)=>{
            return init.concat(cur === _ ? params[position++] : cur);
        },[])
        return fn.apply(this,_args.concat(params.slice(position)))
    }
}
```