---
title: 函数记忆
date: 2019-05-31 11:00:00
tags: 
    - 性能优化
categories: JavaScript
password: tgfe
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---

函数可以将之前的操作结果缓存在某个对象中，当下次调用时，如果遇到相同的参数，就直接返回缓存中的数据，从而避免无谓的重复运算。这种优化被称作记忆。
<!--more-->

## 什么是函数记忆

函数可以将之前的操作结果缓存在某个对象中，当下次调用时，如果遇到相同的参数，就直接返回缓存中的数据，从而避免无谓的重复运算。这种优化被称作记忆。

举个例子：

```javascript
function add(a, b) {
    return a + b;
}

// 假设 memoize 可以实现函数记忆
let memoizeAdd = memoize(add);

memoizeAdd(1, 2) // 3
memoizeAdd(1, 2) // 相同的参数，第二次调用时，从缓存中取出数据，而非重新计算一次
```

记忆只是一种编程技巧，本质上是牺牲算法的空间复杂度以换取更优的时间复杂度，在客户端 Javascript 中代码的执行时间复杂度往往成为瓶颈，因此在大多数情况下，这种牺牲空间换取时间的做法是非常可取的。

## 适用场景

比如说，我们想要一个递归函数来计算 Fibonacci 数列。
一个 Fibonacci 数字是之前两个 Fibonacci 数字之和。
最前面的两个数组是 0 和 1。

```javascript
let count = 0; //用于记录函数调用次数
let fibonacci = function(n){
    count ++ ; // 每次调用函数将 count + 1
    return n < 2 ? n : fibonacci(n-1) + fibonacci(n - 2);
}

for(let i = 0; i < 10; i++){
    console.log(`i=${i}:`,fibonacci(i))
}

console.log('总次数:',count)

// i=0:0
// i=1:1
// i=2:1
// i=3:2
// i=4:3
// i=5:5
// i=6:8
// i=7:13
// i=8:21
// i=9:34

// 总次数: 276
```

上面的代码本身是没什么问题的，但它做了很多无谓的工作。我们在 for 循环中共调用了 10 次 fibonacci 函数，但实际上 fibonacci 函数被调用了 276 次，它自身调用了 266 次去计算可能已被刚刚计算过的值。如果我们让该函数具备记忆功能，就可以显著地减少运算量。

## 实现

接下来我们来思考如何实现一个通用函数( memoize )来帮助我们构造带记忆功能的函数。

原理上很简单，只是将函数的参数和对应的结果一并缓存至闭包中，待调用时判断参数对应的数据是否存在，存在就直接返回缓存的数据结果。

代码实现如下：

```javascript
let memoize = function(fn){
    let cache = {};
    return function(...args){
        let key = JSON.stringify(args);
        if(!cache.hasOwnProperty(key)){
            cache[key] = fn.apply(this,args);
        }
        return cache[key];
    };
}
```

上面的代码，我们将函数的参数转换为JSON字符串后用作缓存的 key，这以基本能够保证每次函数调用可通过参数获取精确的 Key 值。

但对于一些特殊的参数通过 JSON.stringify 转换后，并不能获得真实的 key 值，比如 undefined、NaN、Infinity、正则对象、函数等。

考虑给 memoize 函数增加一个函数类型的参数 resolver ，用于将缓存的 key 的生成规则转交给用户。

实现如下:

```javascript
let memoize = function(fn,resolver){
    let cache = {};
    return function(...args){
        let key = typeof resolver === 'function' ? resolver.apply(this,args) :JSON.stringify(args);
        if(!cache.hasOwnProperty(key)){
            cache[key] = fn.apply(this,args);
        }
        return cache[key];
    };
}
```

## 验证

依然使用 Fibonacci 的例子来验证一下我们完成的 memoize 函数。

### 函数调用次数是否减少

```javascript
let count = 0; //用于记录函数调用次数
let fibonacci = function(n){
    count ++ ; // 每次调用函数将 count + 1
    return n < 2 ? n : fibonacci(n-1) + fibonacci(n - 2);
}

fibonacci = memoize(fibonacci);

for(let i = 0; i < 10; i++){
    console.log(`i=${i}:`,fibonacci(i))
}

console.log('总次数:',count)

// i=0: 0
// i=1: 1
// i=2: 1
// i=3: 2
// i=4: 3
// i=5: 5
// i=6: 8
// i=7: 13
// i=8: 21
// i=9: 34

// 总次数: 10
```

### 函数调用时间是否减少了

未使用 memoize 时，n 为 30 时 fibonacci 函数执行时间如下:

```javascript
console.time('no memoize time');
fibonacci(30);
console.timeEnd('no memoize time');

// no memoize time: 10.919ms
```

使用 memoize 时，n 为 30 时 fibonacci 函数执行时间如下:

```javascript
fibonacci = memoize(fibonacci);

console.time('memoize time');
fibonacci(30);
console.timeEnd('memoize time');

// memoize time: 0.331ms
```

二者时间比较，我们可以很清晰的看到使用 memoize 函数后，函数的调用时间大幅降低。

## 总结

1. 函数记忆：
    + 让函数记住处理过的参数和处理结果
2. 函数记忆的作用：
    + 为避免重复运算
3. 什么时候使用函数记忆:
    + 函数可能反复计算相同的数据时
4. 如何实现:
    + 使用闭包保存住曾经计算过的参数和处理结果
