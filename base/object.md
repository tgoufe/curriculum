---
title: 面向对象，搞定对象（上篇）
date: 2019-07-19 11:00:00
tags: ES6
categories: ES6
---


 >前言：此对象，非彼对象。今天想跟大家分享一下一个大的概念，面向对象。本来想继续分享ES6的class，搜索文章，发现我ES5的原型方面的知识并不牢靠。所以，为了能让自己更加深刻的了解ES6中的class，还是回过头来，先认认真真的学习ES5的面向对象的知识。在这里，还是想表达一下对 --JavaScript高级程序--由衷的感谢，每次阅读，都能让我体会到不同的感受。这本书真的是前端开发工作人员的圣经。希望我的解读能让你对面向对象设计的更加深刻的了解。
 
 
 <!--more-->
 ## 什么是对象
 前端的小伙伴对对象的认识肯定相当的深刻的，因为我们每天的开发就时时刻刻在创建、应用这对象。可以说，每一个需求、功能的实现，都离不开对象。（还没对象的抓紧搞对象！）

 ```javascript
 var person = new Object;
 person.name = 'hanson';
 person.age = 18 ;
 person.sayName = function (){
     return this.name
 }
 ```
 上面的代码是最基本的创建对象的方法，平时开发中，基本上不会这么写。
 ```javascript
var person = {
    name: 'hanson',
    age: 18,
    sayName:function(){
        return this.name;
    }
}
```
上面的创建对象的方式，是我们开发中经常用到的。
###  属性类型
ECMA-262定义了一些为实现JavaScript引擎用的属性，不能直接访问，为了表示特殊，把他们放在两对儿方括号中。例如[[[Enumerable]]。
### 数据属性
一般数据属性的值都为基础数据类型。
+ [[Configurable]] 表示能否通过delete删除属性从而从新定义...（一旦修改，不能反悔）
+ [[Enumerable]] 表示能否通过for-in循环返回属性...（默认为true）
+ [[Writable]] 表示能否修改属性值...(false：不能改，true：能改)
+ [[Value]] 包含属性的数据值...（就是上例中的‘hanson’）

#### 如果想修改默认属性呢？
ECMAScript给我提供了一个方法，Object.defineProperty()方法。这个方法接受三个参数：属性所在对象、属性的名字和一个描述对象。举个例子就明白了。
```javascript
var person = {};
Object.defineProperty(person,'name',{
    Writable:false,
    value:'hanson'
})
console.log(person.name) //'hanson'
person.name = 'hansheng';
console.log(person.name) // 'hanson'
```
通俗易懂，不允许修改，那你就改不了。完成还是建议大家看书，这里就不过多去解读了，毕竟还要找对象。。。
### 访问器属性
除了数据属性前两了属性，多了[[get]]和[[set]]两个属性。
不用看，就单从字面上，想象一下，也能明白，这是设置和获取值。
+ [[get]]: 在读取属性时，调用的函数，默认undefined。
+ [[set]]: 在写入属性时，调用的函数，默认undefeated。

举个例子都懂了！
```javascript
var book = {
    _year:2018,
    edition:1
};
Object.defineProperty(book,"year",{
    get : function(){
        return this._year;
    }
    set : function(newValue){
        if(newValue > 2018){
            this._year = newValue;
            this.edition += newValue - 2018
        }
    }
})
book.year = 2019;
console.log(book.edition) //2
```
那如果想获取一下这些描述属性呢？ECMAScript也给我们提供了一个方法：Object.getOwnPropertyDescriptor();
```javascript
var hanson = {};
Object.defineProperties(book,{ //给对象定义多个属性，用到Object.defineProperties();
    _year:{
        value:18
    },
    name:{
        value:'hanson'
    }
})
var descriptor = Object.getOwnPropertyDescriptor(book,"_year");
console.log(descriptor.value) // 18
```
## 创建对象
 虽然上面两种创建对象的方式，都可以用来创建单个对象，但是有个明显的缺点，使用同一接口创建很多对象，会产生大量的重复代码。 （创建个person、创建个book。。。创建无数对象）
 ### 工厂模式
 工厂模式抽象了创建具体对象的过程。来看例子。
 ```javascript
 function creatObj(name,age){
     var obj = new Object();
     obj.name = name;
     obj.age = age;
     obj.sayName = function(){
         return this.name;
     }
     return obj;
 }
 var person1 = creatObj('hanson',18);
 var person2 = creatObj('hansheng','20');
 ```
 高级程序一书说，这种模式虽然解决了创建多个相似对象的问题，但是没有解决对象识别的问题。为什么没解决对象识别问题？很简单。
 ```javascript
 console.log(person1.constructor) //Object
 console.log(person2.constructor) //Obejct
 console.log(person1.constructor === person2.constructor) //false
 ```
 执行相同的逻辑，实例的构造函数应相同。都能得到Object是所有的实力的构造函数都是Object。为了解决上面的问题，出现了构造函数模式。 说到底，还是因为，每次调用都创建了一个新的对象，person1与person2是相对独立的两个个体。
 ### 构造函数模式
 为了解决上述问题，出现了构造函数。
 ```javascript
 function Person (name,age){
  // let this = new Object()
     this.name = name;
     this.age = age;
     this.sayName = function(){
         return this.name;
     }
     //return this
 }
 var person1 = new Person('hanson',18);
 var person2 = new Person('hansheng',20);
 ```
 对比：
 +  没有显式创建对象；
 +  直接将属性和方法赋给了this；
 +  没有return语句；

要创建Person实例，要使用New操作符。调用构造函数的过程如下：
+ 使用new这个关键词来创建对象
+ 在构造函数内部把新创建出来的对象赋予给this
+ 在构造函数内部把新创建（将来new的对象）的属性方法绑到this上
+ 默认是返回新创建的对象（很重要）
+ 特别需要注意的是，如果显式return一个对象数据类型，那么将来new的对象，就是显式return的对象

我们来看一下是否解决了工厂模式的问题。
```javascript
console.log(person1.constructor) // Person
console.log(person2.constructor) //Person
console.log(person1.constructor === person2.constructor) //true
```
完美解决工厂模式的问题。
### 问你一下
```javascript
第一个：
function Person1(name,age){
    this.name = name
    this.age = age

    return "1"
}
let p = new Person("hanson",18);
第二个：
function Person2(name,age){
    this.name = name
    this.age = age

    return [1,2,3]
}

let p = new Person("hanson",18)
```
连个函数分别返回什么？
答案是：
person1返回：{name:'hanson',age:18}
person2返回：[1,2,3]
解释：
<b>现在你能知道为什么吗？还记得使用构造函数创建person实例么，默认情况，构造函数无return语句，默认返回一个对象（this），如果强行return，返回基础数据类型，那么执行后会自动忽略，如果返回对象，则直接返回，替换实例对象。</b>
继续。。。
难道构造函数就没有缺点么？当然不是，接着往下看。
还是刚才的例子。
 ```javascript
 function Person (name,age){
  // let this = new Object()
     this.name = name;
     this.age = age;
     this.sayName = function(){
         return this.name;
     }
     //return this
 }
 var person1 = new Person('hanson',18);
 var person2 = new Person('hansheng',20);
 ```
 我们改造一下，可能看得更明白。
  ```javascript
 function Person (name,age){
  // let this = new Object()
     this.name = name;
     this.age = age;
     this.sayName = new Function(){return this.name}
 }
 var person1 = new Person('hanson',18);
 var person2 = new Person('hansheng',20);
 console.log(person1.sayName === person2sayName) //false
 ```
 明显，在调用sayName的时候，创建了新的函数，也就是对象，那么person1.sayName与person2.sayName肯定不同。这样，每次调用，我们都会新创建一个sayName函数。
 有的同学问题，我们可以把这个函数单独拿出来啊，用的时候再去调用就好了啊！
 ```javascript
  function Person (name,age){
  // let this = new Object()
     this.name = name;
     this.age = age;
     this.sayName = sayName;
 }
 function sayName(name){
     return this.name = name;
 }
 ```
 这样的方法可以暂时解决现在的需求，但是，如果在世纪开发中，我们需要调用更多的方法，难道我们都要写到全局中吗？很明显，这种方法在世纪的开发中，并不是最优解。怎么办呢？让我更近一步，了解一下原型模式。
 ## 原型模式
 如何解决调用构造函数内的方法时，每次都创建新函数或者要在全局中创建多个函数的问题。我们引入原型模式，简单明了还是来看代码。
 ```javascript
 function Person (){};
 Person.prototype.name = 'hanson';
 Person.prototype.age = 18;
 Person.prototype.sayName = function(){
     return this.name;
 }
 let person1 = new Person();
 let person2 = new Person();
 console.log(person1.sayName === person2.sayName) //true
 ```
 嘿嘿，解决上述问题。虽然解决了，但是我们得知道原因。
 ### 定义
 我们创建的每一个函数都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，二这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。这个是官方给的解释。我给你翻译一下：<b> 所有对象实例，可以共享原型对象上面的属性和方法。 </b>
上面的例子，就证明了这段结论。person1和person2的sayName方法指向相同。为了加深理解，我们来看个图。
![](https://user-gold-cdn.xitu.io/2018/9/1/16595c009f667055?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
很清晰，虽然我也挺喜欢高级程序设计的图，但是总觉得，这个更圆润有没有。
这个图中，有一点没有体现，就是，其实实例P也有一个属性，[[prototype]],(很多浏览器的_proto_)在所有实现中，都无法访问到。但是，我们可以通过isPrototype()方法来确定对象之间是否存在这种关系。
```javascript
console.log(Person.prototype.isPrototype(person1) //true
```
如果我们要给原型对象添加大量属性方法时，我们不断的Person.prototype.xxx = xxx、Person.prototype.xxxx = xxxx，这样也是很繁琐，那么我们该怎么解决这个问题？
```javascript
function Person(name){
    this.name = name
}
// 让Person.prototype指针指向一个新的对象
Person.prototype = {
    eat:function(){
        console.log('吃饭')
    },
    sleep:function(){
        console.log('睡觉')
    }
}
```
需要注意的是，这样的改变，虽然代码在可读性，便利性方面有了很大的提高，但是，Person.prototype.constructor属性不再指向Person了。因为，每创建一个函数，就会同时创建他的prototype属性。这个Person.prototype也会创建属于它的constructor属性。我们这里使用的语法，本质上完全重写了prototype对象。解决的办法很简单，在Person.prototype对象上，加上contructor：Person就可以了。
```javascript
Person.prototype = {
    constructor:Person,
    eat:function(){
        console.log('吃饭')
    },
    sleep:function(){
        console.log('睡觉')
    }
}
```
### 和原型对象有关几个常用方法
```javascript
// 1.hasOwnProperty 在对象自身查找属性而不到原型上查找
function Person(){
    this.name = 'hanson'
}

let p = new Person()

let key = 'name'
if((key in p) && p.hasOwnProperty(key)){
    // name仅在p对象中
}

// 2.isPrototypeOf 判断一个对象是否是某个实例的原型对象
function Person(){
    this.name = 'hanson'
}

let p = new Person()

let obj = Person.prototype
obj.isPrototypeOf(p) // true

```
## 组合使用构造函数模式和原型模式
创建自定义类型的最常见方式，就是组合使用构造函数模式与原型模式。构造函数模式用于定义实例属性，而原型模式用于定义方法和共享属性。
 ```javascript
  function Person (name,age){
  // let this = new Object()
     this.name = name;
     this.age = age;
     this.firends = ['xiaoqiang','xiaoyu','xian'];
 }
Person.prototype = {
    constructor:Person,
    sayName:()=>this.name
}
let person1 = new Person('hanson',18);
let person2 = new Person('hansheng',19);
person1.friends.push('teacher sha');
console.log(person1.friends) //  ['xiaoqiang','xiaoyu','xian','teacher sha']
console.log(person2.friends) //  ['xiaoqiang','xiaoyu','xian']
console.log(person1.friends === person2.friends) //false;
console.log(person1.sayName == person2.sayName) //true
```
在这个例子中，实例属性都是在构造函数中定义的，而由所有实例共享的属性constructor和方法sayName则是在原型中绑定的。目前在ESMAScript中，使用最广发、认同度最高的一种创建自定义类型的方法。高级程序设计还介绍了寄生构造函数模式和 稳妥构造函数模式，感兴趣的小伙伴可自行前往查看。</hr>
***
<b>“对象”都有了，一段时间后，是不是得考虑家产“继承”的问题呢？别着急，下一次，我们就来说说这个“家产”继承！千万不要错过哦。如果觉得小编的内容能让你有所启发，至少能让你加深一下记忆，记得给点赞、关注哦！有问题的小伙伴可以在下面留言，看到后，一定给回复～我们下期再见喽～