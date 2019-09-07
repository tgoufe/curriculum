---
title: Generator函数的语法（基础篇）
date: 2019-05-17 11:00:00
tags: ES6
categories: ES6
---
从语法上来讲，可以将它理解成状态机，封装了多个内部状态。
<!--more-->
## 定义
Generator函数是ES6提供的一种异步编程解决方案，语法与传统函数完全不同。
执行Generator函数会返回一个遍历器对象。
返回的遍历器对象可以依次遍历Generator函数内部的每一个状态。
````javascript
  function* generator () {
    yield 'hello';
    yield 'world';
    return 'ending';
  }
  var hw = generator();
````
函数并不执行，返回的是指向内部状态的指针对象。
如何执行？
````javascript
hw.next();
````
这个next()底层是什么样的呢？
````javascript
function makeNext(array) {
  var nextIndex = 0;
  return {
      next: function(){
          return  nextIndex < array.length ?
               {value:array[nextIndex++],done:true}:
               {value:undefined,done:false}
      }
  }
}
let makenext = makeNext(['a','b']);
makenext.next();
````
执行时，遇到yield就暂停，返回的对象包括value和done两个属性。
value是yield语句后面表达式的值，done后为布尔类型的值。
最后一次调用next()方法，返回的是{value:undefined,done:false}.

## yield 表达式
Generator返回的遍历器对象，只有调用next()方法才能遍历到下一个内部状态，所以，其实是提供了一种可以暂停执行的函数，yield就是暂停标志。
next()方法运行逻辑：
 +  遇到yield语句就暂停执行，并将紧跟在yield语句后面的表达式的值作为返回对象的value值
 +  下次调用next()方法再继续往下执行，知道遇到下一个yield语句。
 +  如果没有在遇到新的yield语句，就一直运行，直到return语句为止，并将return语句后面的表达式的值作为返回对象的value值。
 +  如果没有return语句，则返回的对象的value值是undefined。
 
 ### yield 与 return 的相同点和区别
  + 相同：都返回紧跟在语句后面的表达式的值
  + 不同：
        1.yield暂停执行，下次会在当前位置继续执行，但是return语句不具备记忆功能。
        2.yield可以执行多次，return只能执行一次。
            
 ### 没有yield语句的函数
   那就编程的单纯的暂缓执行函数
   ````javascript
   function* fn() {
     console.log(111)
   }
   var f= fn();
  setTimeout(function() {
    f.next();
  },2000)
  ````
  很方便有没有！
  不过，普通函数不能用yield，用了也报错。
  当然，表达式中用的时候，也要加括号。
  ````javascript
    function* fn() {
      console.log("hello" + (yield 111));
    }
  ````
  当然了，用在函数参数中和赋值语句的右边，是不用加括号的。
  
 ## next方法的参数
 yield语句本身没有返回值，或者说总是返回undefined。next方法可以带有一个参数，该参数会被当作上一条yield语句的返回值。
 ````javascript
 function* fn (x) {
   var y = 2*(yield (x+1));
   var z = yield (y/3);
   return (x+y+z);
 }
 var f = fn(5);
 f.next();
 f.next();
 f.next();
  
 var ff = fn(5);
 ff.next();
 ff.next(12);
 ff.next(13);
 ````
 ### 不想用next
 for...of循环可以自动遍历Generator函数生成的遍历器对象，且此时不再需要调用next方法。
 ````javascript
 function* fn() {
   yield 1;
   yield 2;
   yield 3;
   yield 4;
   return 5;
 }
 for(let v of fn()){
    console.log(v);
 }
 //1 2 3 4
 ````
 为啥没有5？
  原来，一旦next方法返回的对象的done属性为true，for...of循环就会终止，且不包括该返回的对象。
## 应用
 ### 斐波那契数列的实现
  ````javascript
  function* fibonacci() {
    let [pre,curr] = [0,1];
    for(;;){
        [pre,curr] = [curr,pre+curr];
        yield curr;
    }
  }
  for(let i of fibonacci()){
    if(i>1000) break;
    console.log(i);
  }
  ````
  ### 页面执行与隐藏
  ````javascript
  function* loadUI () {
    show();
    yield loadUI();
    hide();
  }
  var load = loadUI();
  //加载
  load.next();
  //隐藏
  load.next();
  ````
  充分利用暂停执行的效果，虽然没在代码中真正实现过，但是属实好用呀！！！
  就到这....
