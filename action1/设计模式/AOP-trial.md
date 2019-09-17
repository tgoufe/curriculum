---
title: AOP 的工具函数库开发尝试
date: 2019-05-08 17:21:00
tags:
  - AOP
  - 面向切面
  - 函数式
  - JavaScript

abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---

尝试实现比较简单的 `AOP`(面向切面编程) 工具函数

<!--more-->

之前有人分享了 `AOP`(面向切面编程) 的概念以及实现方式。具体实现方法就是在 `Function.prototype` 上添加 `before` 和 `after` 两个方法和未来 `ECMAScript` 可能加入的 `Decorator`

`Decorator` 的语法看了一下，就发现它的功能主要是在编译时进行，而在运行时就没有办法使用了

`before` 和 `after` 则灵活很多，但是问题是它在原型链上添加了自定义方法，在编码规范严格的团队这是不能接受的是吧。。。

而且 `before` 和 `after` 看上去挺函数式（我可能对函数式编程有些误解）的，一查发现 `lodash` 上并没有提供相应的方法，同名的函数完全是另一种作用

本着这应该很容易实现的直觉，我决定自己实现一个实现 `AOP` 的库函数。。。

因为 `before` 和 `after` 是加在 `Function.prototype` 上的，所以第一直觉是添加一个中间过渡的 `prototype` 不就可以了么，简单代码如下：
```javascript
// 目标函数
function original(){}

let aop = {
        before(){}
        , after(){}
    }
    , originalPrototype = original.prototype
    ;

original.prototype = aop;
aop.prototype = originalPrototype;
```

马上我就意识到我的错误了，因为上述代码是没有作用的，因为函数的 `prototype` 并不指向 `Function.prototype`，而是 `\_\_proto\_\_` 属性指向，原则上不应该对其改动
所以你需要对 `original` 进行一层封装，而这层封装则应该继承 `Function.prototype`，那么代码就变成如下：
```javascript
class Aspect extends Function{
    constructor(original){
        super();        
    }
    before(){}
    after(){}
}

let aspect = function(original){
    return new Aspect( original );
}

original = aspect( original );
```

在 `ES6` 以后，类可以继承内建对象了，这下似乎应该可以肯定不算是函数式编程了，但是还有一个更大的问题，这个新返回的函数该怎么调用原来的 `original` 函数呢？

这下得重写整理一下思路了，在研究 `Function`、`prototype` 各个属性的时候，`MDN` 上的示例代码引起了我的注意，具体说是其中的 `arguments.callee` 的使用，这时候回忆起来 `arguments.callee` 它可以用于引用该函数的函数体内当前正在执行的函数

这下突然就豁然开朗了，调整代码并丰富细节之后，代码如下：
```javascript
class Aspect extends Function{
    constructor(original){
        super(`
arguments.callee.beforeRun(this, arguments);
let rs = arguments.callee.original.apply(this, arguments);
arguments.callee.afterRun(this, arguments);
return rs;
`);
        this.beforeQueue = [];
        this.afterQueue = [];

        this.original = original;
    }
    before(...args){
        this.beforeQueue.push.apply(this.beforeQueue, args);
        
        return this;
    }
    beforeRun(that, args){
        this.beforeQueue.forEach((exec)=>{
            exec.apply(that, args);
        });
    }
    after(...args){
        this.afterQueue.push.apply(this.afterQueue, args);

        return this;
    }
    afterRun(that, args){
        this.afterQueue.forEach((exec)=>{
            exec.apply(that, args);
        });
    }
}

let aspect = function(executor){
        return new Aspect( executor );
    }
    ;
```

这样可以大致实现预期的效果了：
```javascript
function original(){
    console.log('原始逻辑');
}

original = aspect( original );

original.before(function(){
    console.log('before 1');
});
original.before(function(){
    console.log('before 2');
});
original.after(function(){
    console.log('after 1');
});
original.after(function(){
    console.log('after 2');
});

original();

// 输出结果
// before 1
// before 2
// 原始逻辑
// after 1
// after 2
```

后来想了一下，其实并没有必要使用 `class`，将代码修改成如下：
```javascript
function aspect(original){
    let rs = new Function(`
arguments.callee.beforeRun(this, arguments);
let rs = arguments.callee.original.apply(this, arguments);
arguments.callee.afterRun(this, arguments);
return rs;
`)
        ;
    
    rs.original = original;
    rs.beforeQueue = [];
    rs.afterQueue = [];
    rs.before = function(...args){
        rs.beforeQueue.push.apply(rs.beforeQueue, args);
        
        return rs;
    }
    rs.after = function(...args){
        rs.afterQueue.push.apply(rs.afterQueue, args);
        
        return rs;
    }
    rs.beforeRun = function(that, args){
        rs.beforeQueue.forEach( executor=>executor.apply(that, args) );
    }
    rs.afterRun = function(that, args){
        rs.afterQueue.forEach( executor=>executor.apply(that, args) );
    }
    
    return rs;
}
```

这样看起来更函数式了（其实并没有。。。）

总结一下：
* `arguments.callee` 是个非常强大的东西，值得思考，能拓展出很多强大的功能
* 这种实现方式显然只能出现在 `JavaScript` 这种语言里，利用了 `JavaScript` 语言的特性，函数作为一等公民，但又使用了原型继承的方式
* 不要太相信直觉。。。 