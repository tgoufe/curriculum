---
title: ES6之变量的解构赋值
date: 2019-05-05 11:00:00
tags: ES6
categories: ES6
---
解构赋值在我们日常开发中很常见，而且很方便，下面我们来具体了解一下，变量的结构赋值。
<!--more-->
在正式的讲解之前，我们先来分析一下，到底什么是解构赋值？
通过对词组的分析，我们大致能理解，解构---也就是破坏，破坏原来的结构，赋值---当然就是再次赋值。下面我们来具体的分析一下，到底什么是解构赋值。
##  数组的解构赋值
### 1.基本用法
 ES6允许按照一定模式从数组和对象中提取值，然后对变量进行赋值，这被称作解构（Destructuring）。
 以前，为变量赋值只能直接指定值。
 ````JavaScript
 let a = 1;
 let b = 2;
 let c = 3;
 ````
 ES6允许写成这样。
 ````javascript
 let [a,b,c] = [1,2,3]
 ````
 上面的代码表示，可以从数组中提取值，按照对应的位置进行变量赋值。
 本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。下面是一些使用嵌套数组进行解构的例子。
 ````javascript
  let [foo, [[bar], baz]] = [1,[[2],3]];
  foo //1 ;
  bar //2 ;
  baz //3 ;
  
  let [ , , third] = ["foo", "bar", "baz"];
  third //"baz"
  
  let [x,  , z] = [1,2,3];
  x //1
  z //3
  
  let [head, ...tail] = [1,2,3,4];
  head // 1 
  tail // [2,3,4]
  
  let [x, y, ...z] = ["a"];
  x //"a"
  y // undefined
  z //[]  
  ````
 如果解构不成功，变量的值就等于undefined。
 ````javascript
 let [foo] = [];
 let [bar, foo] = [1];
 ````
 上面的foo取值都是会等于undefined.
 另一种情况是不完全解构，即等号左边的模式只匹配一部分等号右边的数组，这种情况，解构依然可以成功。
 ````javascript
 let [x, y] = [1,2,3];
  x //1;
  y //2;
  
  let [a, [b], c] = [1, [1,3], 4];
  a //1
  b //1
  c //4
  ````
  上面的例子属于不完全解构，但是可以成功。
  如果等号的右边不是数组，严格来说是不可遍历的结构，那么将会报错。
  ````javascript
  let [foo] = 1;
  let [foo] = false;
  let [foo] = undefined;
  let [foo] = NaN;
  let [foo] = null;
  let [foo] = {};
  ````
  上面的语句会报错，因为等号右边的值或者是转换为对象以后不具备Iterator接口，或者本身就不具备Iterator接口。(最后一个表达式)
  简单的介绍一下Iterator接口。
   遍历器(Iterator)是一种接口，为各种不同的数据结构提供统一的访问机制，任何数据结构，只要部署Iterator接口，就可以完成遍历操作。
   以下数据结构具备原生的Iterator接口。（可使用for...of方法进行循环遍历）
   + Array
   + Map
   + Set
   + String
   + TypedArray
   + 函数的arguments对象
   + NodeList对象
   
### 2.Set与Map结构的解构赋值
````javascript
let [x,y,z] = new Set(["a","b","c"]);
x// "a"
var map = new Map();
map.set("first","hello");
map.set("second","world");
for(let [key, value] of map){
    console.log(key +" is " + value);
}
````
### 3.默认值
解构赋值允许指定默认值。
  ````javascript
  let [foo = true] = [];
  foo //true
  
  let [x,y = 'b'] = ['a'];
  x //'a';
  y //'b';
  
  let [x, y = 'b'] = ['a', undefined];
  x // 'a'
  y // 'b'
  ````
  ***ES6内部使用严格相等运算符（===）判断一个位置是否有值。所以，如果一个数组成员不严格等于undefined，默认值不会生效。***
  ````javascript
  let [x = 1] = [undefined];
  x // 1
  let [x = 1] = [null];
  x //null
  ````
  上面的第二个例子没有取到默认值，是因为null不严格等于undefined。
  而且，需要注意的是，默认值可以引用解构赋值的其他变量，但该变量必须已经声明。
  ````javascript
  let [x = 1, y = x] = []; //x =1 y = 1
  let [x = 1, y = x] = [2]; // x = 2 y = 2
  let [x = 1, y = x] = [1,2]; // x = 1 y = 2 
  let [x = y, y = 1] = [];  //ReferenceError
  ````
  最后一个报错，是因为，x用到默认值y时，y还没有声明。
  ## 对象的解构赋值
  解构赋值不仅可以用于数组，还可以用于对象。
  ````javascript
  let {foo, bar} = {foo:"aaa", bar: "bbb"};
  foo // "aaa"
  bar // "bbb"
  ````
  ### 与数组的区别
  ***对象的解构赋值与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值是由它的位置决定的，而对象的属性没有次序，变量必须与属性同名才能取到正确的值***
  ````javascript
  let {foo, bar} = {bar: "bbb", foo:"aaa"};
  foo // "aaa"
  bar // "bbb"
  let {baz} = {bar: "bbb", foo:"aaa"};
  baz //undefined
  ````
  上面的代码就验证了，取值与次序无关。
  第二个例子没有取到值，是因为变量没有对应的同名属性，导致取不到值，最后等于undefined。
  如果变量与属性名不一致，必须要写成下面这样，
  ````javascript
  let {foo:baz} = {bar: "bbb", foo:"aaa"};
  baz //"aaa"
  
  let obj = {first: "hello", last: "world"};
  let {firt: f, last: l} = obj;
  f // "hello"
  l // "world"
  ````
  重点来了，实际上，对象的解构赋值是下面的简写
   ````javascript
    let {foo: foo, bar: bar} = {foo:"aaa", bar: "bbb"};
   ````
   ### 别名
  ***也就是说，对象的解构赋值的内部机制是先找到同名属性，然后再赋值给对应的变量。真正被赋值的是后者，而不是前者。***
   ````javascript
    let {foo:baz} = {bar: "bbb", foo:"aaa"};
    baz //"aaa"
    foo // foo is not defined
   ````
    上面的代码中，***foo是匹配的模式，baz才是变量。真正被赋值的是变量baz，而不是模式foo。*** 
   
    与数组一样，解构也可以用于对嵌套结构的对象。
   ````javascript
    let obj = {
       p:[
          'hello',
          {y: 'world'}
       ]
    };
     let {p: [x,{y}]} = obj;
     x // "hello"
     y // "world"
   ````
   注意这时，p是模式，不是变量，因此不会被赋值，如果p也要作为变量被赋值，可以写成下面这样，
   ````javascript
     let obj = {
         p:[
             'hello',
             {y: 'world'}
         ]
      };
     let {p,p: [x,{y}]} = obj;
      x // "hello"
      y // "world"
      p // p:['hello', {y: 'world'}]
   ````
   另一个例子，
   ````javascript
     var node = {
        loc:{
            start : {
                line: 1,
                column: 5
            }
        }
     };
    var {loc, loc:{start}, loc:{start: {line}}} = node;
    line // 1
    loc // Object {start : Object }
    start // Object {line: 1, column:5}
   ````
  上面的代码有三次解构赋值，分别是对loc，start，line三个属性的解构赋值。需要注意的是，最后一次对line属性的解构赋值之中，只有line是变量，loc和start都是模式。
### 对象的变量赋值
如果将一个已声明的变量进行赋值时，一定要小心了！
````javascript
//错误写法
  let x
  {x} = {x:1};
//syntaxError: syntax error
````
上面的代码会报错，因为JavaScript引擎会将{x}理解成一个代码块，从而发生预发错误。
只要不把{}写在首行，就会解决这个问题。
````javascript
let {x} = {x:1};
//或者
let x;
({x} = {x:1})
//也可以
{(x) = {x:1}}
````
关于圆括号的使用，保证一个原则，不瞎用。
具体请参考阮一峰大神的es6标准，很全面！总结一下就是，

## 字符串的解构赋值
例子
````javascript
const [a,b,c,d,e] = 'hello'
````
## 数字和布尔类型的解构赋值
解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。
````javascript
let {toString : s} = 123;
s === Number.prototype.toString //true
let {toString : s} = true;
s === Boolean.prototype.toString //true
````
上面的代码中，数字和布尔值的包装对象都有toString属性，因此变量s都能取到值。
解构赋值的规则是，只要等号右边的值不是对象或者数组，就先将其转为对象，由于undefined和null无法转换为对象，所以进行解构赋值时会报错。

## 用途
### 交换变量的值
````javascript
  //ES5
  var t;
  t = a;
  a = b;
  b = t;

 //ES6
 let x = 1;
 let y = 2;
 [x, y] = [y, x];
````
### 从函数返回多个值
  函数只能返回一个值，如果要返回多个值，只能将他们放在数组或者对象中，有了解构赋值，取出这些值就很方便了。
````javascript
  //返回一个数组
  function example() {
    return [1,2,3,4]
  }
 let [a,b,c,d] = example();
 //如果没有解构赋值，还得循环遍历，分别赋值。
 
 //返回一个对象
  function example() {
    return {
        foo: 1,
        bar: 2
    };
  }
  let {foo, bar} = example();
````
### 函数参数的定义
  解构赋值可以方便地将一组参数与变量对应起来
````javascript
  //参数是一组有次序的值
  function f([x,y,z]) {}
  f([1,2,3])
  //参数是一组有序的值
  function f({x,y,z}) {}
  f({x:1,z:2,x:3});
````
### 提取JSON中的数据
````javascript
 let jsonData = {
    id:23,
    state:"draft",
    data:{
        name:"hansheng",
        age: 18
    }
 }
 let {id,state,data:info} = jsonData;
  // 23,"draft", {name:"hansheng",age: 18}
````

本文摘录自阮一峰ES6标准入门。
