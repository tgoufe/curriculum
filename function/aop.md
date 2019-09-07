---
title: AOP面向切面编程
date: 2019-04-28 11:00:00
tags: JavaScript
categories: 开发技巧
---
AOP是什么？ 
面向侧面的程序设计（aspect-oriented programming，AOP，又译作面向方面的程序设计、观点导向编程、剖面导向程序设计）是计算机科学中的一个术语，指一种程序设计范型。
侧面的概念源于对面向对象的程序设计的改进，但并不只限于此，它还可以用来改进传统的函数。
<!--more-->

AOP的基本概念:
(1)Aspect(切面):通常是一个类，里面可以定义切入点和通知
(2)JointPoint(连接点):程序执行过程中明确的点，一般是方法的调用
(3)Advice(增强):AOP在特定的切入点上执行的增强处理，有before,after,around
(4)Pointcut(切入点):就是带有通知的连接点，在程序中主要体现为书写切入点表达式
(5)AOP代理：AOP框架创建的对象，代理就是目标对象的加强。


2.通知类型介绍
(1)Before:在目标方法被调用之前做增强处理,@Before只需要指定切入点表达式即可
(2)After:在目标方法完成之后做增强，无论目标方法是否成功完成。@After可以指定一个切入点表达式
(3)Around:环绕通知,在目标方法完成前后做增强处理,环绕通知是最重要的通知类型,像事务,日志等都是环绕通知,注意编程中核心是一个ProceedingJoinPoint

主要意图
将日志记录，性能统计，安全控制，事务处理，异常处理等代码从业务逻辑代码中划分出来，通过对这些行为的分离，我们希望可以将它们独立到非指导业务逻辑的方法中，进而改变这些行为的时候不影响业务逻辑的代码。

这么说下来大家也就有了一个基本对于AOP的了解，接下来我来带大家要看一个具体例子，带大家了解一下。

比如现在页面中有一个button，点击这个button会弹出一个弹窗，与此同时要进行数据上报，来统计有多少用户点击了这个登录button。

````javascript
let point = function(params) {
  // n行代码 
  console.log(params)
}

const openPopover = function(){
  console.log('打开一个弹窗');
}

let clickHandler = function() {
  // n行代码 
  point('openPopover之前埋点');
  openPopover();
  point('openPopover之后埋点');
  // n行代码 
}

````
这样看起来没有什么问题，简单粗暴。
但是如果有30个按钮，每个业务逻辑不同，都需要埋这个点；
我们30个函数里面，都要手动写这个方法的话，这就很太坑
主要是与业务代码严重耦合，哪天不小心动了点其他内容，手抖误删了，就gg了。
那么我们就把埋点封成一个也函数
````javascript

function point(fn) {
  console.log('fn之前埋点');
  fn();
  console.log('fn之后埋点');
}

let clickHandler = function() {
  point(openPopover);
}

````
现在大家看我这个代码由于我用的console来代替的，所以可以看的很很清晰。但是如果代码量大的话，并之前在之前和之后都要执行复杂的方法，我们回头看也会觉得非常的乱;
仔细看一下，这不就是符合AOP的使用前提吗，那么试试AOP吧。

根据我们关注的方面来讲,我们划分一下关注点

主关注点:业务逻辑
侧关注点：埋点信息

前面提到AOP关注的是步骤具体到例子来说其实就是插入埋点的步骤。
插入时机无非时业务逻辑执行之前或者之后的阶段。
具体实现起来也不那么困难


JavaScript中函数作为第一公民，有很多用法微妙的用法，实现AOP也很简单。我们可以把函数当成参数传递到另外一个函数中。
当传入一个函数的时候，我们要对其操作的余地就很大了，
保存原函数，然后利用后续参数加上call或apply，就可以达到我们的目的。
此外为了给函数都增加一个属性，我们在原型上操作就行了。


````javascript
Function.prototype.after = function (action) {
    var func = this;
    return function () {
        var result = func.apply(this, arguments);
        action.apply(this,arguments);
        return result;
    };
};


Function.prototype.before = function (action) {
    var func = this;
    return function () {
        action.apply(this,arguments);
        return func.apply(this, arguments);
    };
};
````
拿 before 来解释下，首先保留一个 this （原函数）的引用，
然后返回一个包含原函数和新函数的‘新函数’，在这个’新函数’里面，
我们按照需求把两个函数执行一遍，并返回原函数执行的结果，保证 this 不被劫持。

那么我们使用AOP改造之后的代码就如下了:
````javascript
let point = function(params) {
  // n行代码 
  console.log(params)
}
const openPopover = function(){
  console.log('打开一个弹窗');
}

let clickHandler = function() {
  // n行代码 
     openPopover() 
     //n 行代码
}

clickHandler = clickHandler.before(function() {
  point('openPopover之前埋点');
}).after(function() {
  point('openPopover之前埋点');
})

clickHandler()

````



环绕增强我在这里给出大家代码，有兴趣的同学可以看一下，我就不多讲了.
````javascript
// AOP 环绕通知函数声明
/**
 * 切入点对象
 * 不允许切入对象多次调用
 * @param obj   对象
 * @param args  参数
 * @constructor
 */
function JoinPoint(obj, args){
    var isapply = false;                       // 判断是否执行过目标函数
    var result = null;                         // 保存目标函数的执行结果

    this.source = obj;                         // 目标函数对象
    this.args = args;                          // 目标函数对象传入的参数

    /**
     * 目标函数的代理执行函数
     * 如果被调用过，不能重复调用
     * @return {object} 目标函数的返回结果
     */
    this.invoke = function(thiz){              
        if(isapply){ return; }
        isapply = true;
        result = this.source.apply(thiz || this.source, this.args);
        return result;
    };

    // 获取目标函数执行结果
    this.getResult = function(){
        return result;
    }
}

/**
 * 方法环绕通知
 * 原方法的执行需在环绕通知方法中执行
 * @param func {Function} 环绕通知的函数
 *     程序会往func中传入一个JoinPoint(切入点)对象, 在适当的时机
 *     执行JoinPoint对象的invoke函数，调用目标函数
 * 
 * @return {Function} 切入环绕通知后的函数，
 */
Function.prototype._around = function(func){
    var __self = this;
    return function(){
        var args = [new JoinPoint(__self, arguments)];
        return func.apply(this, args);
    }
}

// 代码

var isAdmin = true;

function c(){
    console.log('show user list');
}

c = c._around(function(joinpoint){
    if(isAdmin){    // 满足条件时，执行目标函数
        console.log('is admin');
        joinpoint.invoke(this);
    }
});

c();
````





由于我们是在Function.prototype上进行扩展，所以所有的Function都可以使用这样的方法。
````javascript
var foo = function() {
  console.log(2);
}

foo = foo.before(function() {
  console.log(1);
}).after(function() {
  console.log(3);
});

foo();
````
执行结果就是1，2 ，3。

这种做法很妙，我们可以把与核心业务逻辑模块无关的功能抽离出来，然后在不修改源代码的情况下给程序动态地添加功能。

````javascript
var foo = function(){
  // 成千上万行代码
  bar();
  // 成千上万行代码
};
//=>
var foo = (function(){
  // 成两千上万行代码
}).after(function() {
  bar();
});
````
装饰器（Decorator）

提到 AOP 就要说到装饰器模式，AOP 经常会和装饰器模式混为一谈。

在ES6之前，要使用装饰器模式，通常通过Function.prototype.before做前置装饰，和Function.prototype.after做后置装饰（见《Javascript设计模式和开发实践》）。

Javascript 引入的 Decorator ，和 Java 的注解在语法上很类似，不过在语义上没有一丁点关系。Decorator 提案提供了对 Javascript 的类和类里的方法进行装饰的能力。（尽管只是在编译时运行的函数语法糖）

````javascript
@testable
class MyTestableClass {
  // ...
}

function testable(target) {
  target.isTestable = true;
}

MyTestableClass.isTestable // true
````
上面代码中，@testable就是一个修饰器。它修改了MyTestableClass这个类的行为，为它加上了静态属性isTestable。testable函数的参数target是MyTestableClass类本身。
基本上，修饰器的行为就是下面这样。

````javascript
@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A;
````








