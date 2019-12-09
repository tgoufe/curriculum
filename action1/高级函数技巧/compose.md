---
title: 函数组合
date: 2019-0801 11:00:00
tags: 
    - 高阶函数
categories: JavaScript
---

函数组合就是一种将已被分解的简单任务组织成复杂的整体过程。

<!--more-->

## 引言

之前我们了解了两种函数式编程的重要技术：柯里化和偏应用。讨论了这两种技术的运行机制。今天我们来了解一下函数式组合的含义及其实际用例。

函数组合是函数式编程中最精髓的地方之一，在函数式编程中，很多情况下都是以组合的方式来编写代码，这也是改变你从一个面向对象，或者结构化编程思想的一个关键点。

函数组合就是一种将已被分解的简单任务组织成复杂的整体过程。

## 组合的用处

假设我们有这样一个需求：给你一个字符串，将这个字符串转化成大写，然后逆序。

我们的常规思路如下：

```javascript
let str = 'bingshanfe'

// 一行代码搞定
function fn1(str) {
    return str.toUpperCase().split('').reverse().join('')
}

// 或者 按要求一步一步来，先转成大写，然后逆序
function fn2(str) {
    let upperStr = str.toUpperCase()
    return upperStr.split('').reverse().join('')
}

console.log(fn1(str)) // "EFNAHSGNIB"
console.log(fn2(str)) // "EFNAHSGNIB"
```

这段代码实现起来没什么问题，但现在更改了需求，需要在将字符串大写之后，将每个字符拆开并封装成一个数组：`bingshanfe` => `["B","I","N","G","S","H","A","N","F","E"]`

```javascript
function fn(str){
    //...忽略
}
fn('bingshanfe') // ["B","I","N","G","S","H","A","N","F","E"]
```

为了实现这个目标，我们需要更改我们之前封装的函数，这其实就破坏了设计模式中的开闭原则。

那么在需求未变更，依然是字符串大写并逆序，应用组合的思想来怎么写呢：

假定有`compose`函数可以实现如下功能：

```javascript
function compose(...fns){
    //忽略
}
// compose(f,g)(x) === f(g(x))
// compose(f,g,m)(x) === f(g(m(x))
// compose(f,g,m)(x) === f(g(m(x))
// compose(f,g,m,n)(x) === f(g(m(n(x))
```

原需求，我们可以这样实现：

```javascript
let str = 'bingshanfe'

function stringToUpper(str) {
    return str.toUpperCase()
}

function stringReverse(str) {
    return str.split('').reverse().join('')
}

let toUpperAndReverse = compose(stringReverse, stringToUpper)
let res = toUpperAndReverse(str) // "EFNAHSGNIB"
```

那么当我们需求变化的时候，我们根本不需要修改之前封装过的东西：

```javascript
let str = 'bingshanfe'

function stringToUpper(str) {
    return str.toUpperCase()
}

function stringReverse(str) {
    return str.split('').reverse().join('')
}

function stringToArray(str) {
    return str.split('')
}

let toUpperAndArray = compose(stringToArray, stringToUpper)
let res = toUpperAndArray(str)
// ["B","I","N","G","S","H","A","N","F","E"]
```

可以看到当变更需求的时候，我们没有打破以前封装的代码，只是新增了函数功能，然后把函数进行重新组合。

> 这里可能会有人说，需求修改，肯定要更改代码呀，你这不是也删除了以前的代码么，也不是算破坏了开闭原则么。我这里声明一下，开闭原则是指一个软件实体如类、模块和函数应该对扩展开放，对修改关闭。是针对我们封装，抽象出来的代码，而不是调用的逻辑代码。所以这样写并不算破坏开闭原则。

我们假设，现在又修改了需求，现在的需求是，将字符串转换为大写之后，截取前6个字符，然后转换为数组，那么我们可以这样实现：

```javascript
let str = 'bingshanfe'

function stringToUpper(str) {
    return str.toUpperCase()
}

function stringReverse(str) {
    return str.split('').reverse().join('')
}

function getSixCharacters(str){
    return str.substring(0,6)
}

function stringToArray(str) {
    return str.split('')
}

let toUpperAndGetSixAndArray = compose(stringToArray, getSixCharacters,stringToUpper)
let res = toUpperAndGetSixAndArray(str)
// ["B","I","N","G","S","H"]
```

我们发现并没有修改之前封装的代码，只是新增了一个函数，更换了函数的组合方式。

可以看到，组合的方式是真的就是抽象单一功能的函数，然后再组成复杂功能。

这种方式既锻炼了你的抽象能力，也给维护带来巨大的方便。

## 实现

我们已经知道了,compose函数的作用就是，接收若干个函数，返回一个新函数，接收的函数依次执行，前一个函数的结果作为后一个函数的入参。

先考虑只接收两个函数的情况：

```javascript
function compose(f,g){
    return function(x){
        return f(g(x))
    }
}
```

在考虑接收多个函数的情况，此时我们考虑用 reduceRight 来实现：

```javascript
function compose(...fns){
    return function(x){
        return fns.reduceRight((init,f)=>{
            return f(init)
        },x)
    }
}
```

现在我们已经实现了一个 compose 函数了~