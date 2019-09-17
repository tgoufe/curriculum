---
title: Iterator接口函数
date: 2019-05-29 11:00:00
tags: ES6
categories: ES6
---
为各种不同的数据结构提供统一的访问机制!主要是为了使用for...of方法
<!--more-->
## 概念
  &ensp;&ensp;JavaScript原有的表示'集合'的数据结构，主要是数组和对象。ES6又添加了Set和Map。这样就需要一种统一的接口机制，
来处理所有不同的数据结构。 
 
  &ensp;&ensp;遍历器就是这样一种机制，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署了Iterator接口，就可以完成遍历操作。  
  
### Iterator的遍历过程
  + 创建一个指针对象，指向当前数据结构的起始位置（遍历起的本质就是一个指针对象）
  + 第一次调用指针对象的next()方法，可以将指针指向数据结构的第一个成员。
  + 第二次调用就指向第二个成员。
  + 不断调用，直到指向数据结构结束位置。
  
  说白了，每次调用返回的就是一个对象，里面包括value和done两个属性。value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。
  
  说了这么多，改拿出个具体的例子🌰解释一下咯 。
  
 ````javascript
 var it  = makeIterator(['a','b']);
 function makeIterator(array) {
    var nextIndex = 0;
    return {
        next:function() {
          nextIndex < array.length ? 
          {value: array[nextIndex++], done: false }:
          {value: undefined, done: true}
        }
    }
 }
 it.next();
 it.next();
 ````
 上面的代码定义了一个makeIterator函数，他是一个遍历器生成函数，作用就是返回一个遍历器对象。对数组['a','b']执行这个函数，就会返回该数组的遍历器对象（即指针对象）it。  
 
指针对象的next方法，用来移动指针。  
next方法返回一个对象，表示数据成员的信息。  

总之，调用指针对象的next方法，就可以遍历事先给定的数据结构。  
 
## 默认Iterator接口

###定义
Iteratot接口的目的，就是为所有的数据结构，提供了一种统一的访问机制，即for...of循环。当使用for...of循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口

说白了，我理解的Iterator接口的产生，就是为了使用for...of!  

一种数据结构，只要部署了Iterator接口，就是可遍历的，就能用for...of。

ES6规定，默认的Iterator接口部署在数据结构的Symbol.Iterator属性，也就是说，一个数据结构，只要有Symbol.Iterator属性，就是可遍历的。  

### 原生具备Iterator接口的数据结构
+ Array
+ Map
+ Set
+ String
+ TypeArray
+ 函数的arguments对象
+ NodeList 对象

举个例子吧～ 
数组的Symbol.iterator属性
````javascript
let arr = ['a', 'b', 'c'];
let arrIterator = arr[Symbol.iterator]();
arrIterator.next();
````
上面代码中，变量arr是一个数组，原生就具有遍历器接口，部署在arr的Symbol.iterator属性上面。所以，调用这个属性，就得到遍历器对象。
对于原生部署Symbol.iterator属性的数据结构，可以直接使用for...of进行循环遍历。

对象也想用for...of怎么办？
````javascript
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    }
    return {done: true, value: undefined};
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value); // 0, 1, 2
}
````

 ###常见的调用了Iterator接口的场合

（1）解构赋值
对数组和 Set 结构进行解构赋值时，会默认调用Symbol.iterator方法。
````javascript
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
 x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
````
 (2)扩展运算符
 扩展运算符（...）也会调用默认的 Iterator 接口。
 ````javascript
 // 例一
 var str = 'hello';
 [...str] //  ['h','e','l','l','o']
 
 // 例二
 let arr = ['b', 'c'];
 ['a', ...arr, 'd']
 // ['a', 'b', 'c', 'd']
 ````
 
(3)yield*
yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。
````javascript
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
````
##遍历器对象的 return()，throw() 

遍历器对象除了具有next方法，还可以具有return方法和throw方法。如果你自己写遍历器对象生成函数，那么next方法是必须部署的，return方法和throw方法是否部署是可选的。

return方法的使用场合是，如果for...of循环提前退出（通常是因为出错，或者有break语句），就会调用return方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署return方法。

````javascript
function readLinesSync(file) {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false };
        },
        return() {
          file.close();
          return { done: true };
        }
      };
    },
  };
}
````
上面代码中，函数readLinesSync接受一个文件对象作为参数，返回一个遍历器对象，其中除了next方法，还部署了return方法。下面的两种情况，都会触发执行return方法。
 
##说了这么多，最主要是，还是为了调用for...of。
 
 说到遍历，首先就能想到，for，forEach，while,for...in。
 + for:写法复杂，不优雅。
 + forEach只能遍历数组，而且，不能暂停，break你用不了。
 + for...in:随写法简单，但是遍历出来的是对象的key值，不适合遍历数组。
 
 那么，问题来了，for...of有什么优势呢？
  + 简单，好理解。
  + 可暂停，可以配合break，continue和return一起使用
  + 最主要是提供了统一的操作接口
  
 说到底，本节课主要是还是介绍for...of，介绍Iterator最主要的目的是，为了Generator函数服务，但是，Generator函数复杂了点儿，接下来我们还会介绍async...await.
 
 如果你觉得小编写的不错，一定要点个赞👍，给个关注呦～