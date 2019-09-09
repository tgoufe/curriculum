---
title: 用比较的方式学习 ES6的class
date: 2019-08-20 11:00:00
tags: ES6
categories: ES6
---
用比较的方式学习class，你可能得到的更多。
<!--more-->



## class的由来  
我在以前的文章中，曾经分享过，[关于JavaScript中的对象](https://juejin.im/post/5d300b63e51d454f6f16ecb0)的知识，其中提到了，构造函数创建的方式以及各个函数的优缺点，其实今天要讲的class，可以看作是构造函数的语法糖，因为它的绝大部分的功能，在ES5中都能够实现。都能实现，为什么js研究人员还要费劲巴力的去研究class呢？因为新定义的class写法更加清晰，更像面向对象变成。说白了，能让开发人员更好的理解构造函数。今天我们通过对比的方式，具体的了解一下，ES6的class。  

##  对比开始 
传统的构造函数  
```javascript
function Point(x,y){
    this.x = x;
    this.y = y;
}
Point.prototype.toString = function(){
    return this.x + this.y
}
var p = new Poin(1,2);
```
ES6的class改写  
```javascript
class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    toString(){
        return this.x + ',' + this.y
    }
}
let p = new Point(1,2);
```
通过比较，我们能明显的感知到，class定义的构造函数，在代码逻辑上，明显要好过于传统方法。光说没用，具体来解释一下，ES6定义的知识点。
### 相同点：
1. class是传统构造函数的语法糖，Point相当于传统函数的函数名，当然它现在也是class类的名。
2. 使用时，可以通过new命令，与传统函数相同。
3. 实例属性，除非定义在其本身，否则都定义在原型上。
4. 共享一个原型对象。  
 
我们一个个来解释：  
第一点：class是传统函数的语法糖。  
```javascript
class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    toString(){
        return this.x + ',' + this.y
    }
}
console.log(typeof Point) //"function"
Point === Point.prototype.constructor // true
```
1. Point 是个函数 
2. 类本身指向构造函数。因为构造函数的原型的构造属性也指向函数本身。
 
第二点：通过new命令去调用。  
class类，如果需要创建实例对象，必须通过new命令，否则报错。
```javascript
class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    toString(){
        return this.x + ',' + this.y
    }
}
var p = Point(1,2) // Class constructor Point cannot be invoked without 'new'
```
第三点：实例属性，除非定义在其本身，否则都定义在原型上。  
```javascript
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```
在对比前，先来了解一下上面的类。可以看到里面有一个constructor方法，这就是构造方法，而this关键字则代表实例对象。也就是说，ES5 的构造函数Point，对应 ES6 的Point类的构造方法。  
Point类除了构造方法，还定义了toString方法，ES6规定，类中所有的方法，都定义在原型上。  
相当于
```javascript
Point.prototype = {
    constructor(){},
    toString(){}
}
``` 
这样，就能理解，为什么说实例属性，除非定义在其本身，否则都定义在原型上。如果你还不能理解，那你就去认真看一下，关于创建对象的东西，[关于JavaScript中的对象](https://juejin.im/post/5d300b63e51d454f6f16ecb0)。  
第四点：共享一个原型对象。  
```javascript
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__ === p2.__proto__  //true
```
这一点，无需多言了吧。 
### 关于定义：constructor 
constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。  
```javascript
class Point {
}

// 等同于
class Point {
  constructor() {}
}
```
划重点，<b>constructor中的this，指向实例对象!<b>
### 不同点 
1. class中的方法不可枚举。
2. 调用class必须要用new。
3. 默认严格模式。
4. 不存在变量提升。  
老规矩，一个个解释：
第一点：class中的方法不可枚举  
```javascript
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]



var Point = function (x, y) {
  // ...
};

Point.prototype.toString = function() {
  // ...
};

Object.keys(Point.prototype)
// ["toString"]
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]

``` 
第二点：调用class必须要用new命令，这个在前面已经提到过，无需多言。  

第三点：默认严格模式。  
类和模块的内部，默认就是严格模式，所以不需要使用use strict指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。考虑到未来所有的代码，其实都是运行在模块之中，所以 ES6 实际上把整个语言升级到了严格模式。

第四点：不存在提升。  
都用了ES6了，就不要想着变量提升这个历史遗留问题了，尽快的摒弃这些不好的方式方法，对我们以后的开发也是十分有好处的，不多说。  

## 静态方法   

> 说了这么对跟ES5对比的东西，我们接下俩介绍一些class类独有的方式方法。
类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。  

```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function

```
看见了static，就知道，它是个静态方法。就可以直接在Foo上调用，而不是在实例上调用。  
！注意，如果静态方法包含this关键字，这个this指的是类，而不是实例。  
```javascript
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log('hello');
  }
  baz() {
    console.log('world');
  }
}

Foo.bar() // hello
``` 
## 关于继承 
> 上个分享，我写了关于原型继承，没有提到ES6的方式，只提到了传统的函数的的继承，感兴趣的小伙伴可以去了解一下,[彻底搞懂JavaScript中的继承](https://juejin.im/post/5d47f0f06fb9a06b1d21297c)。  

为什么class也要搞继承呢？有家产吗？当然不是，只要是提高原型继承的清晰度和方便性！  
```javascript
class Point {
}

class ColorPoint extends Point {
}
``` 
上面代码定义了一个ColorPoint类，该类通过extends关键字，继承了Point类的所有属性和方法。但是由于没有部署任何代码，所以这两个类完全一样，等于复制了一个Point类。下面，我们在ColorPoint内部加上代码。
```javascript
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```
上面代码中，constructor方法和toString方法之中，都出现了super关键字，它在这里表示父类的构造函数，用来新建父类的this对象。

子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。

### 父类的静态方法，也会被子类继承。
```javascript
class A {
  static hello() {
    console.log('hello world');
  }
}

class B extends A {
}

B.hello()  // hello world
```
### 如何判断一个类是否继承另一个类？ 
```javascript
Object.getPrototypeOf(ColorPoint) === Point
// true
```
Object.getPrototypeOf方法可以用来从子类上获取父类。

### super关键字 
super这个关键字，既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。
第一种情况： 作为函数调用 
```javascript
class A {}

class B extends A {
  constructor() {
    super();
  }
}
```
上面代码中，子类B的构造函数之中的super()，代表调用父类的构造函数。这是必须的，否则 JavaScript 引擎会报错。

注意，super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)。
```javascript
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
```
第二种情况：作为对象调用   
super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
```javascript
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```
上面代码中，子类B当中的super.p()，就是将super当作一个对象使用。这时，super在普通方法之中，指向A.prototype，所以super.p()就相当于A.prototype.p()。  

这里需要注意，由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。
```javascript
class A {
  constructor() {
    this.p = 2;
  }
}

class B extends A {
  get m() {
    return super.p;
  }
}

let b = new B();
b.m // undefined
```
class继承，最重要的就是要掌握好super的使用，这里只是给大家做了简单的介绍。  
