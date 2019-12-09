---
title: 箭头函数
date: 2019-06-20 11:00:00
tags: 
    - ES6
categories: JavaScript
---

在 ES6 中，箭头函数是其中最有趣也最受欢迎的新增特性。顾名思义，箭头函数是一种使用 (=>) 定义函数的新语法，它与传统的 ES5 函数有些许不同。

<!--more-->

## 引言

在 ES6 中，箭头函数是其中最有趣也最受欢迎的新增特性。顾名思义，箭头函数是一种使用 (=>) 定义函数的新语法，它与传统的 ES5 函数有些许不同。

这是一个用 ES5 语法编写的函数：

```javascript
function addTen（num）{
  return num + 10;
}
timesTwo（5); // 15
```

有了 ES6 的箭头函数后，我们可以用箭头函数这样表示：

```javascript
var addTen = num => num + 10

addTen(5); // 15
```

箭头函数的写法短的多！由于隐式返回，我们可以省略花括号和 return 语句。

与常规 ES5 函数相比，了解箭头函数的行为方式非常重要。

## 箭头函数的特点

### 更短的语法

基础语法如下：

```javascript
（参数）=> { statements }
```

接下来，拆解一下箭头函数的各种书写形式：

当没有参数时，使用一个圆括号代表参数部分

```javascript
let f = ()=> 5;

f(); // 5
```

当只有一个参数时，可以省略圆括号。

```javascript
let f = num => num + 5;

f(10); // 15
```

当有多个参数时，在圆括号内定义多个参数用逗号分隔。

```javascript
let f = (a,b) => a + b;

f(1,2); // 3
```

当箭头函数的代码块部分多余一条语句，就需要使用大括号括起来，并且使用 return 语句。

```javascript
// 没有大括号，默认返回表达式结果
let f1 = (a,b) => a + b
f1(1,2) // 3

// 有大括号，无return语句，没有返回值
let f2 = (a,b) => {a + b}
f2(1,2) // undefined

// 有大括号，有return语句，返回结果
let f3 = (a,b) => {return a + b}
f3(1,2) // 3
```

由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。

```javascript
//报错
let f1 = num => {num:num}

//不报错
let f2 = num => ({num:num})
```

### 不能通过 new 关键字调用

箭头函数没有[[Construct]]方法，所以不能被用作构造函数。

```javascript
let F = ()=>{};

// 报错 TypeError: F is not a constructor
let f = new F();
```

### 没有原型

由于不可以通过 new 关键字调用，因而没有构建原型的需求，所以箭头函数不存在 prototype 这个属性。

```javascript
let F = ()=>{};
console.log(F.prototype) // undefined
```

### 没有 this 绑定
在 ES5 函数表达式中，this关键字根据调用它的上下文绑定到不同的值。但是，对于箭头函数，它this是词法绑定的。

**箭头函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。**

```javascript
window.name = 'window_name'
let obj = {
    name:'obj_name',
    f1:function(){
        return this.name
    },
    f2:()=>{
        return this.name
    }
}
obj.f1(); // obj_name
obj.f2(); // window_name
```

上面代码中，obj.f1 是一个普通函数，obj.f2 是一个箭头函数。

当调用 obj.f1() 时，obj.f1 中 this 的指向的是 f1 函数的调用者，也就是 obj，所以返回 'obj_name'。

当调用 obj.f2() 时，由于 obj.f2 是箭头函数，所以 obj.f2 中this 指向的是定义 obj.f2 时的 this 指向，也就是 window，所以返回 'window_name'。

**对箭头函数使用 call、apply、bind 时，不会改变 this 指向，只会传入参数**

```javascript
window.name = 'window_name';

let f1 = function(){return this.name}
let f2 = ()=> this.name

let obj = {name:'obj_name'}

f1.call(obj) // obj_name
f2.call(obj) // window_name

f1.apply(obj) // obj_name
f2.apply(obj) // window_name

f1.bind(obj)() // obj_name
f2.bind(obj)() // window_name
```

上面代码中，声明了普通函数 f1，箭头函数 f2。

普通函数的 this 指向是动态可变的，所以在对 f1 使用 call、apply、bind 时，f1 内部的 this 指向会发生改变。

箭头函数的 this 指向在其定义时就已确定，永远不会发生改变，所以在对 f2 使用 call、apply、bind 时，会忽略传入的上下文参数。


**this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this**

### 没有 arguments、super、new.target

箭头函数中是没有 arguments、super、new.target 的绑定，这些值由外围最近一层非箭头函数决定。

以 arguments 为例，看如下代码：

```javascript
let f = ()=>console.log(arguments);

//报错
f(); // arguments is not defined
```

由于在全局环境下，定义箭头函数 f，对于 f 来说，无法获取到外围非箭头函数的 arguments 值，所以此处报错。

再看一个例子：

```javascript
function fn(){
    let f = ()=> console.log(arguments)
    f();
}
fn(1,2,3) // [1,2,3]
```

上面的代码，箭头函数 f 内部的 arguments，其实是函数 fn 的 arguments 变量。

若想在箭头函数中获取不定长度的参数列表，可以使用 ES6 中的 rest 参数解决：

```javascript
let f = (...args)=>console.log(args)

f(1,2,3,4,5) // [1,2,3,4,5]
```

### 不能用作 Generator 函数

在箭头函数中，不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。

## 自执行函数

在 ES6 的箭头函数出现之前，自执行函数一般会写成这样：

```javascript
(function(){
    console.log(1)
})()
```

或者写成这样：

```javascript
(function(){
    console.log(1)
}())
```

箭头函数当然也可以被用作自执行函数，可以这样写：

```javascript
(() => {
    console.log(1)
})()
```

但是，令大多数人想不到的是，下面这种写法会报错：

```javascript
(() => {
    console.log(1)
}())
```

那么，为什么会报错呢？

原因是，箭头函数属于 AssignmentExpression 的一种，当 CallExpression 时，要求左边的表达式是 MemberExpression 或其他 CallExpression。

原理就是这样了，具体可参见[ECMAScript® 2015 规范](https://www.ecma-international.org/ecma-262/6.0/#sec-arrow-function-definitions)



## 关于箭头函数的题目

在面试中关于箭头函数的考察，主要集中在 arguments 关键字的指向和箭头函数的this指向上，下面几道题目，供大家参考一下。

先上题目，由浅入深，答案后面给出。

题目1

```javascript
function foo(n) {
  var f = () => arguments[0] + n;
  return f();
}

let res = foo(2);

console.log(res); // 4
```

题目2

```javascript
function A() {
  this.foo = 1
}

A.prototype.bar = () => console.log(this.foo)

let a = new A()
a.bar()
```

题目3

```javascript
let res = (function() {
  return [
    (() => this.x).bind({ x: 'inner' })()
  ];
}).call({ x: 'outer' });

console.log(res)
```

题目4

```javascript
window.name = 'window_name';

let obj1 = {
    name:'obj1_name',
    print1:function(){
        console.log(this.name)
    },
    print2:()=>console.log(this.name),
    print3:function(){
        return function(){
            console.log(this.name)
        }
    },
    print4:function(){
        return ()=>console.log(this.name)
    }
}

let obj2 = {name:'obj2_name'}

obj1.print1()
obj1.print1.call(obj2)
obj1.print2()
obj1.print2.call(obj2)
obj1.print3()()
obj1.print3().call(obj2)
obj1.print3.call(obj2)()
obj1.print4()()
obj1.print4().call(obj2)
obj1.print4.call(obj2)()
```

答案如下：

```javascript
// 题目1：4
// 题目2：undefined
// 题目3：["outer"]
/**
 * 题目4：
 * obj1.print1()            --obj1_name
 * obj1.print1.call(obj2)   --obj2_name
 * obj1.print2()            --window_name
 * obj1.print2.call(obj2)   --window_name
 * obj1.print3()()          --window_name
 * obj1.print3().call(obj2) --obj2_name
 * obj1.print3.call(obj2)() --window_name
 * obj1.print4()()          --obj1_name
 * obj1.print4().call(obj2) --obj1_name
 * obj1.print4.call(obj2)() --obj2_name
 */
```
