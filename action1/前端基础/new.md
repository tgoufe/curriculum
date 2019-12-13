---
title: javascript Error
date: 2019-08-21 11:00:00
tags: JavaScript
categories: JavaScript
---
在前端项目中，由于JavaScript本身是一个弱类型语言，加上浏览器环境的复杂性，网络问题等等，很容易发生错误。做好网页错误监控，不断优化代码，提高代码健壮性是一项很重要的工作。
<!--more-->

在前端项目中，由于JavaScript本身是一个弱类型语言，加上浏览器环境的复杂性，网络问题等等，很容易发生错误。做好网页错误监控，不断优化代码，提高代码健壮性是一项很重要的工作。对javascript中的ERROR有更多的理解，势必会让我们去避免很多问题。

JavaScript中的Error

JavaScript中，Error是一个构造函数，通过它创建一个错误对象。当运行时错误产生时，Error的实例对象会被抛出。构造一个Error的语法如下：

````javascript
// message: 错误描述
// fileName: 可选。被创建的Error对象的fileName属性值。默认是调用Error构造器代码所在的文件的名字。
// lineNumber: 可选。被创建的Error对象的lineNumber属性值。默认是调用Error构造器代码所在的文件的行号。
new Error([message[, fileName[, lineNumber]]]);
````
ECMAScript标准：

Error有两个标准属性：
Error.prototype.name ：错误的名字
Error.prototype.message：错误的描述

例如，在chrome控制台中输入以下代码：
````javascript
var err = new Error('我是错误');
console.log(err); // Error: 我是错误
    			// at <anonymous>:1:9
console.log(err.name); // Error
console.log(err.message); // 我是错误

````
作为函数使用
当像函数一样使用Error的--如果没有new,它将返回一个Error对象，所以，仅仅调用Error将产生与通过new关键字构造Error对象的输出相同
````javascript
var err = new Error('我是错误');
console.log(err);//Error: 我是错误at <anonymous>:1:11
var err2 = Error('我是错误2');
console.log(err2);//Error: 我是错误at <anonymous>:3:12
````

Error只有一个标准方法：

Error.prototype.toString：返回表示一个表示错误的字符串。
接上面的代码：
````javascript
a.toString();  // "Error: 错误测试"
````
非标准的属性
各个浏览器厂商对于Error都有自己的实现。比如下面这些属性：

1.Error.prototype.fileName：产生错误的文件名。
2.Error.prototype.lineNumber：产生错误的行号。
3.Error.prototype.columnNumber：产生错误的列号。
4.Error.prototype.stack：堆栈信息。这个比较常用。
这些属性均不是标准属性，在生产环境中谨慎使用。不过现代浏览器差不多都支持了。

Error的种类

除了通用的Error构造函数外，JavaScript还有7个其他类型的错误构造函数。

InternalError:  创建一个代表Javascript引擎内部错误的异常抛出的实例。 如: "递归太多"。非ECMAScript标准。
RangeError: 数值变量或参数超出其有效范围。例子：var a = new Array(-1);
EvalError: 与eval()相关的错误。eval()本身没有正确执行。
ReferenceError: 引用错误。 例子：console.log(b);
SyntaxError: 语法错误。例子：var a = ;
TypeError: 变量或参数不属于有效范围。例子：[1,2].split('.')
URIError:  给 encodeURI或 decodeURl()传递的参数无效。例子：decodeURI('%2')

当JavaScript运行过程中出错时，会抛出上8种(上述7种加上通用错误类型)错误中的其中一种错误。错误类型可以通过error.name拿到。

你可能希望自定义基于Error的异常类型，使得你能够 throw new MyError() 并可以使用 instanceof MyError 来检查某个异常的类型. 这种需求的通用解决方法如下.
````javascript

function MyError(message) {
  this.name = 'MyError';
  this.message = message || 'Default Message';
  this.stack = (new Error()).stack;
}
MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;

try {
  throw new MyError();
} catch (e) {
  console.log(e.name);     // 'MyError'
  console.log(e.message);  // 'Default Message'
}

try {
  throw new MyError('custom message');
} catch (e) {
  console.log(e.name);     // 'MyError'
  console.log(e.message);  // 'custom message'
}
````


捕获错误
网页发生错误，开发者如何捕获这些错误呢 ? 常见的有以下方法。

try...catch…大家都不陌生了。一般用来在具体的代码逻辑中捕获错误。
````javascript
try {
  throw new Error("oops");
}
catch (ex) {
  console.log("error", ex.message); // error oops
}
````
当try-block中的代码发生异常时，可以在catck-block中将异常接住，浏览器便不会抛出错误。
但是，这种方式并不能捕获异步代码中的错误，如：
````javascript
try {
    setTimeout(function(){
        throw new Error('lalala');
    },0);
} catch(e) {
    console.log('error', e.message);
}
````
这个时候，浏览器依然会抛出错误：Uncaught Error: lala。



window.onerror

````javascript
window.onerror = function(message, source, lineno, colno, error) {//do sth }
````

函数参数：
message：错误信息（字符串）
source：发生错误的脚本URL（字符串）
lineno：发生错误的行号（数字）
colno：发生错误的列号（数字）
error：Error对象（对象）

注意，如果这个函数返回true，那么将会阻止执行浏览器默认的错误处理函数。

window.addEventListener('error')

````javascript
window.addEventListener('error', function(event) { //do sth})

````
我们调用Object.prototype.toString.call(event)，返回的是[object ErrorEvent]。可以看到event是ErrorEvent对象的实例。ErrorEvent是事件对象在脚本发生错误时产生，从Event继承而来。由于是事件，自然可以拿到target属性。ErrorEvent还包括了错误发生时的信息。

ErrorEvent.prototype.message:  字符串，包含了所发生错误的描述信息。
ErrorEvent.prototype.filename:  字符串，包含了发生错误的脚本文件的文件名。
ErrorEvent.prototype.lineno:  数字，包含了错误发生时所在的行号。
ErrorEvent.prototype.colno:  数字，包含了错误发生时所在的列号。
ErrorEvent.prototype.error:   发生错误时所抛出的 Error 对象。

注意，这里的ErrorEvent.prototype.error对应的Error对象，就是上文提到的Error, InternalError，RangeError，EvalError，ReferenceError，SyntaxError，TypeError，URIError，DOMException中的一种。


Vue中的错误捕获
Vue中提供了Vue.config.errorHandler`来处理捕获到的错误。
````javascript
// err: 捕获到的错误对象。
// vm: 出错的VueComponent.
// info: Vue 特定的错误信息，比如错误所在的生命周期钩子
Vue.config.errorHandler = function (err, vm, info) {}
````
如果开发者没有配置Vue.config.errorHandler，那么捕获到的错误会以console.error的方式输出。


上报错误
捕获到错误后，如何上报呢？最常见、最简单的方式就是通过<img>了。代码简单，且没有跨域烦恼。
````javascript
function logError(error){
    var img = new Image();
    img.onload = img.onerror = function(){
        img = null;
    }
    img.src = `${上报地址}?${processErrorParam(error)}`;
}
````
错误的上报其实是一项复杂的工程，涉及到上报策略、上报分类等等。特别是在项目的业务比较复杂的时候，更应该关注上报的质量，避免影响到业务功能的正常运行。使用了打包工具处理的代码，往往还需要结合sourceMap进行代码定位。









