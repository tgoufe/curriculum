---
title: 彻底搞懂JavaScript中的继承
date: 2019-08-06 11:00:00
tags: ES6
categories: ES6
---
搞懂继承，从现在开始！
<!--more-->
>上一片文章，给大家分享了对象的创建和函数的创建及优缺点。还不知道的小伙伴可以去[面向对象，搞定对象](https://juejin.im/post/5d300b63e51d454f6f16ecb0)这节先了解一下，回过头再来看这篇文章。  
## 概念
什么是原型链以及书中介绍了好多种继承方法，优缺点是什么！
### 什么是原型链
当谈到继承时，JavaScript 只有一种结构：对象。每个实例对象（ object ）都有一个私有属性（称之为 __proto__ ）指向它的构造函数的原型对象（prototype ）。该原型对象也有一个自己的原型对象( __proto__ ) ，层层向上直到一个对象的原型对象为null。根据定义，null没有原型，并作为这个原型链中的最后一个环节。---来着MDN   

这里是官方给出的解释，我们用个例子，来具体的去看看这个原型链。在举例之前，我们先来了解一下，原型和实例的关系。  
>  每个构造函数（constructor）都有一个原型对象（prototype），原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。  

上面的这段还如果你还没理解，我还是建议你去看[面向对象，搞定对象](https://juejin.im/post/5d300b63e51d454f6f16ecb0)，这里已经给你详细的解释了。这里就不多说了。  
那我们想一下，如果让一个函数的实例对象，指向函数的原型对象，会发生什么？
```javascript
   function Father(){
	this.property = true;
}
Father.prototype.getFatherValue = function(){
	return this.property;
}
function Son(){
	this.sonProperty = false;
}
//继承 Father
Son.prototype = new Father();//Son.prototype被重写,导致Son.prototype.constructor也一同被重写
Son.prototype.getSonVaule = function(){
	return this.sonProperty;
}
var instance = new Son();
alert(instance.getFatherValue());//true
```
instance实例通过原型链找到了Father原型中的getFatherValue方法.
为了找到getFatherValue属性，都经历了什么呢？  
1.  先在instance中寻找，没找到
2.  接着去instance.__proto__(Son.prototype)中寻找，也是Father的实例中寻找。又没找到。
3.  去Father.prototype中寻找，找到了,返回结果。假如还没找到。
4.  去object.prototype中寻找，假如还没找到。
5.  返回undefined.  

instance --> new Father() --> Father.prototype --> object.prototype --> undefined 
这就是你日思夜想不得解的原型链啊！是不是很好理解了。  
<b>实例与原型连接起来的链条，叫做原型链（我自己定义的）。 </b>

## 原型链继承问题 
上面的例子，就是原型链继承的标准例子。但是原型链继承，是有问题的。高级程序设计上说，他有两个问题：  
+ 当原型链中包含引用类型值的原型时,该引用类型值会被所有实例共享;
+ 在创建子类型(例如创建Son的实例)时,不能向超类型(例如Father)的构造函数中传递参数.  

是有这两个问题，但我说也不一定，当你原型链不需要饮用类型，创建的子类型不需要传参！那就不存在问题啊！哈哈哈  
别闹，毕竟这样的需求很少，甚至根本不可能有，还是老实儿解决上面的问题吧。 

## 借用构造函数  
原理：在子类型构造函数中调用超类型构造函数。 
### 原型链继承的问题
先来看看原型链函数的问题：
```javascript
function Father (){
    this.colors = ['red','green','blue'];
}
function Son (){
}
Son.prototype = new Father();

let instance1 = new Son();
instance1.colors.push('white');
console.log(instance1.colors);

let instance2 = new Son();
console.log(instance2.colors);
```
执行之后，就会发现，返回的结果是一样的，也就是说，所有的实例都会共享colors这个属性。这并不是不我们想要的结果。  
### 原型链继承的问题的解决办法  
在子类型构造函数中调用超类型构造函数。
```javascript
function Father(name){
    this.colors = ['red','green','blue'];
    
}
function Son(name){
    Father.call(this,name);
}

let instance1 = new Son();
instance1.colors.push('white');
console.log(instance1.colors); // ['red','green','blue'，'white'];

let instance2 = new Son();
console.log(instance2.colors); // ['red','green','blue'];
```
<b>请记住，函数只是在特定环境中执行的代码的对象，因此可以通过call()或apply()方法也可以在新创建的对象上执行构造函数。</b>  
这段话很好理解：<b>谁干（调）的，谁负责。</b>  
结合上面的代码，instance1调用的colors属性，那就你instance1对象负责，我instance2没做任何事，我不负责。
### 再来看传参问题 
```javascript
function Father(name){
    this.colors = ['red','green','blue'];
    this.name  = name; //新增code
}
function Son(name){
    Father.call(this,name); //将name，传递给Father。
}

let instance1 = new Son('hanson'); //创建实例对象时，传入参数
instance1.colors.push('white');
console.log(instance1.colors); // ['red','green','blue'，'white'];
console.log(instance1.name); // 'hanson'

let instance2 = new Son();
console.log(instance2.colors); // ['red','green','blue'];
```
很好理解嘛，通过构造函数Son，我们给Father传了参。完美解决传参问题。   

### 借用构造函数的问题  
1. 所有的方法都得定义在构造函数上，无法实现复用。  
2. 超类型中的方法，对于子类型是不可见的。  

如何解决这两个问题呢？引出我们下一个继承方法---组合继承。  

## 组合继承 
组合继承也叫做伪经典继承，指的是将原型链和借用构造函数的技术组合在一起，从而发挥二者之长的继承模式。  
话不多说，上代码！   

```javascript
function Father(name){
    this.colors = ['red','green','blue'];
    this.name  = name; 
}
Father.prototype.sayName = function(){
    console.log(this.name)
}
function Son(name,age){
    Father.call(this,name); //将name，传递给Father。
    this.age = age;
}
Son.prototype = new Father();
Son.prototype.sayAge = function(){
    console.log(this.age);
}
let instance1 = new Son('hanson',18);//创建实例对象时，传入参数
Son.prototype.constructor = Son;
instance1.colors.push('white');
console.log(instance1.colors); // ['red','green','blue'，'white'];
console.log(instance1.sayAge); // 18

let instance2 = new Son('grey',20);
console.log(instance2.colors); // ['red','green','blue'];
console.log(instance2.sayName()); // 'grey'
console.log(instance2.sayAge()); //18  
```    
<b>总结：分别拥有自己的属性，还享有公共的方法，真好。</b>    
## 不靠谱的原型式继承和寄生式继承   

这两个继承方式，都是一个叫克罗克德的人提出的，咱也不知道，咱也不敢问，估计式为了后面的组合式寄生继承做铺垫？  

```javascript
//原型式继承 
var person = {
    name:'hanson',
    friends:['sha','feng','qiang']
}
var another = Object(person); //复制一份
another.name = 'bo';
another.friends.push('lei');
console.log(another.friends); //['sha','feng','qiang','lei']
console.log(another.name); //'bo'
console.log(person.friends); //['sha','feng','qiang','lei']
```  
相比上面的方法，这个要简便的多，没用到构造函数，原型链。但问题也十分明显，<b>污染引用属性</b>。  


```javascript
//寄生式继承---也是克罗克德提出来的
function creat(obj) {
    var clone = Object(obj);
    clone.sayName = function(){
        console.log('hanson')
    }
    return clone;
}
var person = {
    age:18,
    friends:['qiang','sha','feng'] 
}
var another = creat(person);
console.log(another.sayName());
console.log(person.sayName());
``` 

其实道理没变，clone了一份对象，但是，同样，peron对象也被玷污了！不信，你打印一下，person也有了sayName()方法。牺牲太大，反正我不用～    

## 最后一个，寄生组合式继承   
在讲解之前呢，我们先来看看，组合继承的缺点。  


```javascript
function Father(name){
    this.name = name;
    this,friends = ['qiang','sha','feng'] ;
}
Father.prototype.constructor = function(){
    console.log(this.name);
}
function Son(name,age){
    Father.call(this); //第二次调用
}
Son.prototype = new Father(); //第一次调用
Son.prototype.constructor = Son;
Son.prototype.sayName = function(){
    console.log(this.name);
}
```

我们第一次调用超类型构造函数（Father）,无非是想指定子类型的原型，让他们直接建立联系而已。
给他个副本，又如何！  
```javascript
function inheritPrototype(Son,Father){
    var prototype = Object(Father.prototype);
    prototype.constructor = Son;
    Son.prototype = prototype;
}
```
这个函数，接收两个参数，一个子类型，一个超类型。在函数内部，  
1. 创建超类型的一个副本。
2. 为副本添加constructor属性，你补重写prototype属性造成的constructor属性丢失问题。
3. 将副本赋值给子类型的原型。
  

```javascript
function Father(name){
    this.name = name;
    this,friends = ['qiang','sha','feng'] ;
}
Father.prototype.constructor = function(){
    console.log(this.name);
}
function Son(name,age){
    Father.call(this); //第二次调用
}
inheritPrototype(Son,Father);
Son.prototype.sayName = function(){
    console.log(this.name);
}
```
这个例子，只调用了一次超类型构造函数，避免了在子类型上创建不必要的属性和方法。是最理想的继承方式。 
但是，我可能不会用。。。你会用吗？
