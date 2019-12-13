---
title: async这颗糖，很甜，也很咸
date: 2019-07-02 11:00:00
tags: ES6
categories: ES6
---
async这颗糖，很甜，也很咸。
<!--more-->
## 关于标题
为什么，async这颗糖很甜，也很咸呢？  
大家都知道，async函数是Generator函数的语法糖，那什么是Generator函数呢？ 如果你还没了解Generator，[Generator异步调用](https://juejin.im/post/5d08af35e51d45554877a5e0)，这篇文章为你介绍了Generator函数的原理和使用方法。  
我们先来看一个最简单的Generator函数  
```javascript
function * generator(x){
    var y  = yield x + 1;
    return y;
}
var gen = generator();
gen.next(1); //{value:2,done:false}
```
这个案例是最简单的Generator函数的实现，我们再来看一下，async函数的简单例子
```javascript
async function generator(x){
    var y = await x + 1;
    return y;
    }
genertor(1).then(value => console.log(value)); //2
```
## async真甜
### 对标Generator
对比上面两段代码，明显感觉到，使用async后，代码变得更加清晰，同时，不再需要手动调用next方法，就行实现异步加载，当然，为了代码清晰，上面的代码并没用异步调用，正常情况下，await后面的表达式为promise对象。  
相对于Generator函数，async有下面几点好处 ：  
1. 内置执行器。
2. 更好的语义化。
3. 更广的适用性。
4. 返回Promise对象。  
我们分别来解释一下上面的几点好处 ：  
第1点，内置执行器，在以前的文章我们讲到过，Generator函数如果想自动执行，需要引入CO模块，而async不必，内置了执行器，可自动执行异步调用，获得结果后，再继续执行。
第2点，更好的语义化，这个从字面上就能看得出来，很明显，async函数更像是同步函数。  
第3点，更广的适用性，看过Generator函数那节课的同学都能知道，yield后面只能适用promise对象或者是thunk 函数（最新版本只能使用promise对象），async函数不必，就像例子，可接原始类型的值。  
第4点，很重要的一点。async函数返会的值是promise对象，还是上面的例子，虽然return y，但是，运行函数后，返回的是promise对象。而Generator函数返回的是Iterator函数。如果有小伙伴不知道什么事Iterator函数的，给你个链接[Iterator函数](https://juejin.im/post/5cf4884951882503050ee320)。看完，你就知道，async函数有多好用。  
### 用代码说话
先定义一个 Fetch 方法用于获取 github user 的信息：
```javascript
function fetchUser() { 
    return new Promise((resolve, reject) => {
        fetch('https://api.github.com/users/superman66')
        .then((data) => {
            resolve(data.json());
        }, (error) => {
            reject(error);
        })
    });
}
```   

Promise 方式    

```javascript  
function getUserByPromise() {
    fetchUser()
        .then((data) => {
            console.log(data);
        }, (error) => {
            console.log(error);
        })
}
getUserByPromise();
```
使用promise后，代码的执行变的很清晰，这能解决我们当前问题，但有一种情况，如果我们的需求有多次请求，切每次请求都需要上次请求的结果，这就变的很麻烦了。当然，有的小伙伴说了，那我们就可以继续的then()下去啊，可以，绝对可以，但是，随着请求次数的增多，代码中出现更多数量的then，如果不加以注释，也会变的晦涩难懂，这不是我们想要的结果。继续。。。  

Generator 方式
```javascript
function* fetchUserByGenerator() {
    const user = yield fetchUser();
    return user;
}
const g = fetchUserByGenerator();
const result = g.next().value;
result.then((v) => {
    console.log(v);
}, (error) => {
    console.log(error);
})
```
Generator 的方式解决了 Promise 的一些问题，流程更加直观、语义化。但是 Generator 的问题在于，函数的执行需要依靠执行器，每次都需要通过 g.next() 的方式去执行。  
async 方式
```javascript
async function getUserByAsync(){
     let user = await fetchUser();
     return user;
 }
getUserByAsync()
.then(v => console.log(v));
```
哇。。。同样的结果，async像丝般顺滑，搞定了。真甜。。。  
### 关于async函数的返回值
前文说到，async函数返回一个Promise对象。  
```javascript
async function generator(x){
    var y = await x + 1;
    return y;
    }
genertor(1).then(value => console.log(value)); //2
```
promise函数then方法的执行前提是，await后面的表达式以获取到值。然后将值以参数的形式传入后面的函数中（例子中直接在控制台中打印出来）。
await后面可以是promise对象，也可以是基础数据。async 函数返回的 Promise 对象，必须等到内部所有的 await 命令的 Promise 对象执行完，才会发生状态改变。
```javascript
const delay = timeout => new Promise(resolve=> setTimeout(resolve, timeout));
async function f(){
    await delay(1000);
    await delay(2000);
    await delay(3000);
    return 'done';
}

f().then(v => console.log(v)); // 等待6s后才输出 'done'
```
正常情况下，await 命令后面跟着的是 Promise ，如果不是的话，也会被转换成一个 立即 resolve 的 Promise。
```javascript
async function  f() {
    return await 1
};
f().then( (v) => console.log(v)) // 1
```
### 关于错误捕获
如果await后面的异步操作出错，那么等同于async函数返回的 Promise 对象被reject。
```javascript
async function f() {
  await new Promise(function (resolve, reject) {
    throw new Error('出错了');
  });
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// Error：出错了
```
上面代码中，async函数f执行后，await后面的 Promise 对象会抛出一个错误对象，导致catch方法的回调函数被调用，它的参数就是抛出的错误对象。
防止出错的方法，也是将其放在try...catch代码块之中。
```javascript
async function f() {
  try {
    await new Promise(function (resolve, reject) {
      throw new Error('出错了');
    });
  } catch(e) {
  }
  return await('hello world');
}
```
如果有多个await命令，可以统一放在try...catch结构中。
```javascript
async function main() {
  try {
    const val1 = await firstStep();
    const val2 = await secondStep(val1);
    const val3 = await thirdStep(val1, val2);

    console.log('Final: ', val3);
  }
  catch (err) {
    console.error(err);
  }
}
```
## 吃多可能也会咸
### 再次解析一下async 函数的执行方式
当我们在编写JavaScript异步代码的时候,人们经常在一个接着一个的函数调用前面添加await关键字.这会导致性能问题,因为在通常情况下,一个语句的执行并不依赖前一个语句的执行,但是因为添加了await关键字,你仍旧需要等待前一个语句执行完才能执行一个语句.
```javascript
(async () => {
  const pizzaData = await getPizzaData()    // async call
  const drinkData = await getDrinkData()    // async call
  const chosenPizza = choosePizza()    // sync call
  const chosenDrink = chooseDrink()    // sync call
  await addPizzaToCart(chosenPizza)    // async call
  await addDrinkToCart(chosenDrink)    // async call
  orderItems()    // async call
})()
```
解释：
1.获得披萨的列表.
2.获得饮料的列表.
3.从披萨列表中选择披萨.
4.从饮料列表中选择饮料.
5.把选择的披萨加入购物车
6.把选择的饮料加入购物车.
7.确认订单
错误：获得披萨列表和饮料列表可以同时进行，没必要等待获取披萨列表后再去获取饮料列表。
如何解决这个问题呢？
```javascript
async function selectPizza() {
  const pizzaData = await getPizzaData()    // async call
  const chosenPizza = choosePizza()    // sync call
  await addPizzaToCart(chosenPizza)    // async call
}

async function selectDrink() {
  const drinkData = await getDrinkData()    // async call
  const chosenDrink = chooseDrink()    // sync call
  await addDrinkToCart(chosenDrink)    // async call
}

(async () => {
  const pizzaPromise = selectPizza()
  const drinkPromise = selectDrink()
  await pizzaPromise
  await drinkPromise
  orderItems()    // async call
})()

// 我更喜欢下面这种实现.
(async () => {
  Promise.all([selectPizza(), selectDrink()]).then(orderItems)   // async call
})()
```
很清晰的展现出，代码的执行顺序，相较于上一个，性能有了明显的提高。
## 总结
还是题目的那句话，async函数很甜，也很咸。不要过分的去使用async/await，因为完全不影响异步执行的操作，如果非要同步执行，随着调用接口的增加，回严重影响性能。瑕不掩瑜，async的便利性，很大程度上会减少开发量，同时代码的可读性也有很大的提高。