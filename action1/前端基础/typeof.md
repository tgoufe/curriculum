---
title: 浅谈 instanceof 和 typeof 的实现原理
date: 2019-07-02 14:00:00
tags: JavaScript
categories: 开发技巧
---


浅谈 instanceof 和 typeof 的实现原理

<!--more-->
一.typeof 的实现原理
typeof 一般被用于判断一个变量的类型，我们可以利用 typeof 来判断number, string, object, boolean, function, undefined, symbol 这七种类型，
这种判断能帮助我们搞定一些问题，比如在判断不是 object 类型的数据的时候，typeof能比较清楚的告诉我们具体是哪一类的类型。
但是，很遗憾的一点是，typeof 在判断一个 object的数据的时候只能告诉我们这个数据是 object, 而不能细致的具体到是哪一种 object,
比如
````javascript
let a = 'wangzong';
let s = new String('wangzong');

typeof a === 'String' //true
typeof s === 'object' //true

a instanceof String //false
s instanceof String //true
````
要想判断一个数据具体是哪一种 object 的时候，我们需要利用 instanceof 这个操作符来判断，这个我们后面会说到。
来谈谈关于 typeof 的原理吧，我们可以先想一个很有意思的问题，js 在底层是怎么存储数据的类型信息呢？或者说，一个 js 的变量，在它的底层实现中，它的类型信息是怎么实现的呢？

其实，js 在底层存储变量的时候，会在变量的机器码的低位1-3位存储其类型信息
000：对象
010：浮点数
100：字符串
110：布尔
1：整数
but, 对于 undefined 和 null 来说，这两个值的信息存储是有点特殊的。

null：所有机器码均为0

undefined：用 −2^30 整数来表示

以，typeof 在判断 null 的时候就出现问题了，由于 null 的所有机器码均为0，因此直接被当做了对象来看待。

然而用 instanceof 来判断的话
````javascript
typeof null  //object

null instanceof null
````

null 直接被判断为不是 object，这也是 JavaScript 的历史遗留bug，可以参考typeof。

因此在用 typeof 来判断变量类型的时候，我们需要注意，最好是用 typeof 来判断基本数据类型（包括symbol），避免对 null 的判断。

还有一个不错的判断类型的方法，就是Object.prototype.toString，我们可以利用这个方法来对一个变量的类型来进行比较准确的判断

````javascript
Object.prototype.toString.call(1)         //"[object Number]"
Object.prototype.toString.call('hi')      //"[object String]"
Object.prototype.toString.call({a:'hi'})  //"[object Object]"
Object.prototype.toString.call([1,'a'])   //"[object Array]"
Object.prototype.toString.call(true)      //"[object Boolean]"
Object.prototype.toString.call(() => {})  //"[object Function]"
Object.prototype.toString.call(null)      //"[object Null]"
Object.prototype.toString.call(undefined) //"[object Undefined]"
Object.prototype.toString.call(Symbol(1)) //"[object Symbol]"
````
在 ECMAScript 2015 之前，typeof总是保证为任何操作数返回一个字符串。但是，除了非提升，块作用域的let和const之外，在声明之前对块中的let和const变量使用typeof会抛出一个ReferenceError。
这与未声明的变量形成对比，typeof会返回“undefined”。块作用域变量在块的头部处于“暂时死区”，直到被初始化，在这期间，如果变量被访问将会引发错误。
````javascript
typeof undeclaredVariable === 'undefined';
typeof newLetVariable; let newLetVariable; // ReferenceError
typeof newConstVariable; const newConstVariable = 'hello'; // ReferenceError
````
万事都有例外
![例外](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1562059647765.png)


二.instanceof 操作符的实现原理

之前我们提到了 instanceof 来判断对象的具体类型，

其实instanceof运算符用于测试构造函数的prototype属性是否出现在对象的原型链中的任何位置
![instanceof](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1562054034840.png)
````javascript
let person = function () {}
let wangzong = new person()
wangzong instanceof person //true
````
当然，instanceof 也可以判断一个实例是否是其父类型或者祖先类型的实例。


````javascript
let person = function () {}
let programmer = function () {}
programmer.prototype = new person()
let wangzong = new programmer()
wangzong instanceof person
wangzong instanceof programmer
````

这是 instanceof 的用法，但是 instanceof 的原理是什么呢？根据 ECMAScript 语言规范，我梳理了一下大概的思路，然后整理了一段代码如下

````javascript
function new_instance_of(leftVaule, rightVaule) {
    let rightProto = rightVaule.prototype;
    leftVaule = leftVaule.__proto__;
    while (true) {
        if (leftVaule === null) {
            return false;
        }
        if (leftVaule === rightProto) {
            return true;
        }
        leftVaule = leftVaule.__proto__
    }
}
````
其实 instanceof 主要的实现原理就是只要右边变量的 prototype 在左边变量的原型链上即可。因此，instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype，如果查找失败，则会返回 false，告诉我们左边变量并非是右边变量的实例。

看几个很有趣的例子
````javascript
function Foo() {}
Object instanceof Object
Function instanceof Function
Function instanceof Object
Foo instanceof Foo
Foo instanceof Object
Foo instanceof Function
````
要想全部理解 instanceof 的原理，除了我们刚刚提到的实现原理，我们还需要知道 JavaScript 的原型继承原理。

关于原型继承的原理，我简单用一张图来表示


![继承原理](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1562048797382.png)

Object.getPrototypeOf()
我们知道每个 JavaScript 对象均有一个隐式的 \_\_proto\_\_ 原型属性，而显式的原型属性是 prototype，只有 Object.prototype.__proto__ 属性在未修改的情况下为 null 值。根据图上的原理，我们来梳理上面提到的几个有趣的 instanceof 使用的例子。

Object instanceof Object
由图可知，Object 的 prototype 属性是 Object.prototype, 而由于 Object 本身是一个函数，由 Function 所创建，所以 Object.__proto__ 的值是 Function.prototype，而 Function.prototype 的 \_\_proto\_\_ 属性是 Object.prototype，所以我们可以判断出，Object instanceof Object 的结果是 true 。用代码简单的表示一下

````javascript
leftValue = Object.__proto__ = Function.prototype;
rightValue = Object.prototype; leftValue != rightValue
leftValue = Function.prototype.__proto__ = Object.prototype leftValue === rightValue
````
Function instanceof Function 和 Function instanceof Object 的运行过程与 Object instanceof Object 类似，故不再详说。

Foo instanceof Foo
Foo 函数的 prototype 属性是 Foo.prototype，而 Foo 的 \_\_proto\_\_ 属性是 Function.prototype，由图可知，Foo 的原型链上并没有 Foo.prototype ，因此 Foo instanceof Foo 也就返回 false 。
我们用代码简单的表示一下
````javascript
leftValue = Foo, rightValue = Foo
leftValue = Foo.__proto = Function.prototype
rightValue = Foo.prototype leftValue != rightValue
leftValue = Function.prototype.__proto__ = Object.prototype leftValue != rightValue
leftValue = Object.prototype = null leftValue === null
````

Foo instanceof Object
````javascript
leftValue = Foo, rightValue = Object
leftValue = Foo.__proto__ = Function.prototype
rightValue = Object.prototype leftValue != rightValue
leftValue = Function.prototype.__proto__ = Object.prototype leftValue === rightValue
````

Foo instanceof Function
````javascript
leftValue = Foo, rightValue = Function
leftValue = Foo.__proto__ = Function.prototype
rightValue = Function.prototype leftValue === rightValue
````

总结一下
简单来说，我们使用 typeof 来判断基本数据类型是 ok 的，不过需要注意当用 typeof 来判断 null 类型时的问题，如果想要判断一个对象的具体类型可以考虑用 instanceof，但是 instanceof 也可能判断不准确，比如一个数组，他可以被 instanceof 判断为 Object。所以我们要想比较准确的判断对象实例的类型时，可以采取 Object.prototype.toString.call 方法。








