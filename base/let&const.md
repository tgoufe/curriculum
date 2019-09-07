---
title: ES6之let与const
date: 2019-05-04 11:00:00
tags: ES6
categories: ES6
---
为自己曾经犯下的错误买单！
<!--more-->
## 回顾ES5
在讲解es6之前，我们必须要提一下es5中的var，也就是曾经的那个错误。
````javascript
if (condition) {
    var value = 1;
}
console.log(value);
````
很简单的分析一下，初学者可能会认为，只有在condition为true的时候，value才会被赋值，如果condition为false的时候，代码应该会报错才对！但是，事实并不是这样的，浏览器在执行这段代码的时候，并不是这么解析的！
````javascript
//浏览器的执行顺序
var value;
if (condition) {
    value = 1;
}
console.log(value);
````
这样，很容易我们就能判断出，如果condition的值为false的时候，console出来的值为undefined。
原因就是我们常说的，变量提升。
为了加强对变量生命周期的控制，ECMAScript 6 引入了块级作用域。
块级作用域存在于：
+ 函数内部
+ 块中(字符 { 和 } 之间的区域)

##引出我们今天的主角—let和const
let 和 const 都是块级声明的一种。

### let和const的特点
#### 不会被提升
````javascript
if (condition) {
    let value = 1;
}
console.log(value); // Uncaught ReferenceError: value is not defined
````
在代码块外面访问，直接判定，未定义。
#### 重复声明报错
````javascript
var value = 1;
let value = 2; // Uncaught SyntaxError: Identifier 'value' has already been declared
````
这在以前是完全可以的，后定义的回覆盖以前的。
#### 不绑定全局作用域
````javascript
let value = 1 ;
console.log(window.value);
````
const也是相同的，都访问不到。
### const和let的区别
const 用于声明常量，其值一旦被设定不能再被修改，否则会报错。
值得一提的是：const 声明不允许修改绑定，但允许修改值。这意味着当用 const 声明对象时：
````javascript

const data = {
    value: 1
}
 
// 没有问题
data.value = 2;
data.num = 3;
 
// 报错
data = {}; // Uncaught TypeError: Assignment to constant variable.
````
## 临时死区
### 定义
临时死区(Temporal Dead Zone)，简写为 TDZ
let 和 const 声明的变量不会被提升到作用域顶部，如果在声明之前访问这些变量，会导致报错
````javascript
console.log(typeof value); // Uncaught ReferenceError: value is not defined
let value = 1;
````
###举个栗子
````javascript
var value = "global";
 
// 例子1
(function() {
    console.log(value);
 
    let value = 'local';
}());
 
// 例子2
{
    console.log(value);
 
    const value = 'local';
};
````
结果是：都报错了~！
这是因为 JavaScript 引擎在扫描代码发现变量声明时，要么将它们提升到作用域顶部(遇到 var 声明)，要么将声明放在 TDZ 中(遇到 let 和 const 声明)。访问 TDZ 中的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从 TDZ 中移出，然后方可访问。
## 循环中的块级作用域
### 举栗
````javascript
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 3
````
如何改变现状呢？我要的是 funcs[0]() == 0
在没有es6 之前，这个事儿麻烦了，还得使用闭包的方式！
````javascript
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs[i] = (function(i){
        return function() {
            console.log(i);
        }
    }(i))
}
funcs[0](); // 0
````
ES6 的 let 为这个问题提供了新的解决方法
````javascript
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0
````
问题在于，上面讲了 let 不提升，不能重复声明，不能绑定全局作用域等等特性，可是为什么在这里就能正确打印出 i 值呢？
如果是不重复声明，在循环第二次的时候，又用 let 声明了 i，应该报错呀，就算因为某种原因，重复声明不报错，一遍一遍迭代，i 的值最终还是应该是 3 呀，还有人说 for 循环的 设置循环变量的那部分是一个单独的作用域，就比如：
````javascript

for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
````
这个例子是对的，如果我们把 let 改成 var 呢？
````javascript

for (var i = 0; i < 3; i++) {
  var i = 'abc';
  console.log(i);
}
// abc
````
经查， for 循环中使用 let 和 var，底层会使用不同的处理方式。
简单的来说，就是在 for (let i = 0; i < 3; i++) 中，即圆括号之内建立一个隐藏的作用域，这就可以解释为什么:
````javascript
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
````
然后每次迭代循环时都创建一个新变量，并以之前迭代中同名变量的值将其初始化。
````javascript
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0
````
相当于：
````javascript
// 伪代码
(let i = 0) {
    funcs[0] = function() {
        console.log(i)
    };
}
 
(let i = 1) {
    funcs[1] = function() {
        console.log(i)
    };
}
 
(let i = 2) {
    funcs[2] = function() {
        console.log(i)
    };
};
````
## 到此，我们就讲完了吗？没有，并没有，上面还有个提升的问题么！
首先明确一点：提升不是一个技术名词。
要搞清楚提升的本质，需要理解 JS 变量的「创建create、初始化initialize 和赋值assign」
假设有如下代码：
````javascript
function fn(){
  var x = 1
  var y = 2
}
fn()
````
在执行 fn 时，会有以下过程（不完全）：
+ 进入 fn，为 fn 创建一个环境。
+ 找到 fn 中所有用 var 声明的变量，在这个环境中「创建」这些变量（即 x 和 y）。
+ 将这些变量「初始化」为 undefined。
+ 开始执行代码
+ x = 1 将 x 变量「赋值」为 1
+ y = 2 将 y 变量「赋值」为 2

也就是说 var 声明会在代码执行之前就将「创建变量，并将其初始化为 undefined」。
这就解释了为什么在 var x = 1 之前 console.log(x) 会得到 undefined。

接下来来看 function 声明的「创建、初始化和赋值」过程
假设代码如下：
````javascript
fn2()
 
function fn2(){
  console.log(2)
}
````
JS 引擎会有一下过程：

+ 找到所有用 function 声明的变量，在环境中「创建」这些变量。
+ 将这些变量「初始化」并「赋值」为 function(){ console.log(2) }。
+ 开始执行代码 fn2()

也就是说 function 声明会在代码执行之前就「创建、初始化并赋值」。

接下来看 let 声明的「创建、初始化和赋值」过程
假设代码如下：
````javascript
{
  let x = 1
  x = 2
}
````
我们只看 {} 里面的过程：

+ 找到所有用 let 声明的变量，在环境中「创建」这些变量
+  开始执行代码（注意现在还没有初始化）
+ 执行 x = 1，将 x 「初始化」为 1（这并不是一次赋值，如果代码是 let x，就将 x 初始化为 undefined）
+ 执行 x = 2，对 x 进行「赋值」

这就解释了为什么在 let x 之前使用 x 会报错：
````javascript
let x = 'global'
{
  console.log(x) // Uncaught ReferenceError: x is not defined  
  let x = 1
}
````
原因有两个:
+ console.log(x) 中的 x 指的是下面的 x，而不是全局的 x
+ 执行 log 时 x 还没「初始化」，所以不能使用（也就是所谓的暂时死区）

看到这里，你应该明白了 let 到底有没有提升：
+ let 的「创建」过程被提升了，但是初始化没有提升。
+ var 的「创建」和「初始化」都被提升了。

function 的「创建」「初始化」和「赋值」都被提升了。
最后看 const，其实 const 和 let 只有一个区别，那就是 const 只有「创建」和「初始化」，没有「赋值」过程。
图解：

![图11](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/分辨变量提升.png)
