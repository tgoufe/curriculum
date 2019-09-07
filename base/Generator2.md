---
title: Generator函数的异步应用（进阶篇）
date: 2019-06-18 11:00:00
tags: ES6
categories: ES6
---
异步调用，并没有那么可怕。
<!--more-->
异步编程对于开发新手来说，简直是噩梦般存在，但是又非常重要，非学不可。
## 传统方法
 + 回调函数
 + 事件监听
 + 发布/订阅
 + Promise对象
 
## 基本概念

### 异步

所谓的异步，简单来说，就是任务不是一次连续完成的，中间加入了其他的程序运算，等第一阶段准备好了数据，再返回来进行计算。

### 回调函数

回调函数的名字，callback，这个相信做过前端开发的小伙伴都见到过。javaScript语言对异步编程的实现就是回调函数。  
举个例子：  
```javascript
fs.readFile('etc/passwd','utf-8',function(err,data){
    if(err) throw err;
    console.log(data);
});
```
### Promise
回调函数本身没有问题，问题在于，出现多个回调函数嵌套上，也就是我们俗称的回调地狱。
```javascript
    let url1 = 'http://xxx.xxx.1';
    let url2 = 'http://xxx.xxx.2';
    let url3 = 'http://xxx.xxx.3';
    $.ajax({
        url:url1,
        error:function (error) {},
        success:function (data1) {
            console.log(data1);
            $.ajax({
                url:url2,
                data:data1,
                error:function (error) {},
                success:function (data2) {
                    console.log(data2);
                    $.ajax({
                        url:url3,
                        data,
                        error:function (error) {},
                        success:function (data3) {
                            console.log(data3);
                        }
                    });
                }
            });
        }
    });
```
这种代码本身逻辑可以实现，问题处在下面几个方面：  

 + 代码臃肿。
 + 可读性差。
 + 耦合度过高，可维护性差。
 + 代码复用性差。
 + 容易滋生 bug。
 + 只能在回调里处理异常。  
 
 在以前的章节中，我们讲到过Promis函数，他就是典型的解决函数异步问题而产生的。
他是回调函数的新写法。  

举个例子： 
 
````javascript
function request(url,data = {}){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url,
            data,
            success:function (data) {
                resolve(data);
            },
            error:function (error) {
                reject(error);
            }
        })
    });
}
let url1 = 'http://xxx.xxx.1';
let url2 = 'http://xxx.xxx.2';
let url3 = 'http://xxx.xxx.3';
request(url1)
    .then((data)=>{
        console.log(data);
        return request(url2,data)
    })
    .then((data)=>{
        console.log(data);
        return request(url3,data)
    })
    .then((data)=>{
        console.log(data)
    })
    .catch((error)=>{
        console.log(error);
    });

````
相对上面来说，使用Promis对象后，代码结构变得清晰的许多。但，问题是，一眼看上去，多了好多个then，而且，不写注释，很难明白到底是什么意思。  

## Generator函数
 
 ### 定义：
 generator函数是ES6提供的一种异步编程解决方案，语法与传统函数完全不同。
 执行Generator函数会返回一个遍历器对象。返回的遍历器对象可以依次遍历Generator函数内部的每一个状态
 
 上面的章节中，我们提到过，Genertor函数，最大的特点，就是可以交出函数的执行权。也就是说，可以暂停执行函数。  
 
 ````javascript
 function * gen(x) {
   var y  = yield  x + 1;
   return y;
 }
 var g = gen(1);
 g.next(); // {value:2,done:false}
 g.next(); // {value:undefined.done:true}
```` 
执行gen函数，返回的是函数指针，调用指针函数的next方法可以移动内部函数的指针，指向第一个遇到的yield语句。

### 异步封装

下面看一个使用Generator函数执行一个真实的异步任务。  
````javascript
  var fetch = require('node-fetch);
  
  function * gen() {
    var url = 'http://api.github.com';
    var result = yield fetch(url);
    console.log(result.bio);
  }
  
  var g = gen();
  var result = g.next();
  
  result.value.then(function(data) {
    return data.JSON();
  }).then(function(data) {
    g.next(data);
  })
  
````  
上面的代码将异步表达的很清晰，但是流程管理并不方便，还的自己调用next方法。  

## Generator函数自动流程管理

例子：  
````javascript
function * gen() {
  //...
}

var g = gen();
var res = g.next();
while(!res.done){
    console.log(res.value);
    g.next()
}
````  
上面代码能自动完成，前提是不适合异步，如果必须保证前一步执行完才能执行后一步，上面的自动执行就不行了。

### Thunk函数

如何自动完成异步函数呢？引出我们的主角，thunk函数。  

````javascript
var fs = requier('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function *() {
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
} 
````  
上面代码，执行异步操作后（yield 后面的表达式），需要将执行权再返回给Generator函数，我们先手动执行一下。  

````javascript
var g = gen();

var r1 = g.next();
r1.value(function(err,data) {
  if(err) throw err;
  var r2 = g.next(data);
  r2.value(function(err,data) {
    if(err) throw err;
    g.next(data);
  })
})

````  
仔细看一下，上面的代码，generator函数执行过程其实就是将同一个回调函数反复传入next方法的value属性。  
如何自动完成这个操作呢？  
 
````javascript
function  run (fn) {
  var gen = fn();
  function next(err,data) {
    var result = gen.next(data);
    if(result.done) return ;
    result.value(next)
  }
  next();
}

function* g() {
  //...
}

run(g);
````  
上面代码中的run函数就是一个Generator函数的自动执行器。内部的next函数就是Thunk的回调函数，next先将指针移动到Generator函数的下一步，然后判断Generator函数是否结束，
如果没结束，就将next函数再传入thunk函数，否则直接退出。  

这就方便多了。只需将要执行的函数，放入run()函数就可以了。妈妈再也不担心我的异步调用了。  

## CO
每次都写run函数么？很烦馁～  
那就尝试一下CO。  
co模块是著名的程序员TJ Holowaychuk于2013年6月发布的一个小工具，用于Generator函数自动执行。  
怎么用呢？相当简单了。  

````javascript
var co = require('co');
co(gen);
````
相当简便。而且，co函数返回的是一个Promise对象，可以调用then方法添加回调函数。  

````javascript
co(gen).then(function() {
  console.log('到这函数就都执行完了。')
});
````  
### 为什么co能自动执行呢？  
generator函数是一个异步执行容器。它的自动执行需要一中机制，当异步操作有了结果，需要自动交回执行权。  
解释一下：

````javascript
function * gen(x) {
  var y = yield x = 1;
  var z = yield 1+1;
  return y, z;
}
````  
当执行到第一个yield的时候，调用next方法，获取到值。再次调用next，继续执行，再次调用这步骤，不用人为调用了。  
co模块其实就是将thunk函数和promise对象包装成一个模块。使用的前提是，yield后面的表达式必须是thunk函数或者promise对象。4.0之后的co版本只支持promise对象了。  

有时间的同学可以看看co的源码，也很简单的，这里就不做过多的介绍了。




