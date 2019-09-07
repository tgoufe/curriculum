
---
title: 【辟邪剑法】探秘void
date: 2019-07-25 17:00:00
tags: JavaScript
categories: 开发技巧 
---
 

> 和辟邪剑法一样，欲练此功必先……

<!--more-->

## **void是什么**
### **导读**
```java
public class Test {
	public static void main(String[] args) {
		for(int i=0;i<args.length;i++) {
			System.out.println(args[i]);
		}
	}
}
```
**不好意思，放错了，我们换一个**

```html
<a href="javascript:void(0);">
</a>
```
**这下是不是就不陌生了呢**
### **void定义**
**MDN说明**
> void expression

> 这个运算符能向期望一个表达式的值是undefined的地方插入会产生副作用的表达式。

> void 运算符通常只用于获取 undefined的原始值，一般使用void(0)（等同于void 0）。在上述情况中，也可以使用全局变量undefined 来代替（假定其仍是默认值）。

**ES5说明**

The production UnaryExpression : void UnaryExpression is evaluated as follows:

1. Let expr be the result of evaluating UnaryExpression.
2. Call GetValue(expr).
3. Return undefined.

### **怎么理解**
* **`运算符`**：void 是一元运算符，出现在操作数之前，操作数是任意类型。void 0；
* **`返回值`**：any -> undefined;
* **`有副作用的表达式`**：也就是说后面的表达式会照常计算，此表达式可能产生副作用。


### **表达式副作用**
> 大部分表达式没有副作用。
> 有关表达式的副作用的概念一般说计算一个表达式的值需要引用一些变量，在表达式求值过程中，需要提取这些变量的值，但并不改变这些变量的值，这样的表达式称为无副作用的表达式．从传统意义上讲，表达式的作用就是计算，它除了产生一个计算结果外，不应该改变参与计算过程的任何变量的值或产生其它的效应。

**举个例子**

```javascript
var a = 1;
var b = a++; //有副作用
var c = a+1; //无副作用
```
这也向我们解释了一个问题`既然返回永远是undefined，那么GetValue有啥用?(知乎问题)`

**因为JavaScript的表达式是可以有副作用（side effect）的，void会对其后的运算数作取值操作，因此若属性有个getter函数，那么就会调用getter函数（产生副作用）**

```javascript
var num = 0;
var test = {
    get plus() {
        num++;
    },
    get num() {
        return num;
    }
};

void test.plus; //调用了plus的get方法    而delete就不会触发（不取值）
console.log(test.num); // 1
```

## **为什么不直接用undefined**
**void是关键字，而undefined并不是！！！**

**先看这段代码**

```javascript
let undefined = 123;
console.log(123 === undefined)//true
```
**我只在浏览器端用，而且是现代浏览器是不是就没问题了**

```javascript
function test() {
  let undefined = 123;
  console.log(123 === undefined)
}

test(); //true
```
**在IE5.5~8中我们可以将undefined当作变量那样对其赋值、node环境全局和局部环境都可以、浏览器环境中的局部作用域中也是可以得，因此很容易被污染**

**所以一般严谨的库的判断都是使用void 0;来作为undefined的值**

```javascript
let undefined = 123;
console.log(123 === void 0)//false
```
**拓展**

下面这些方法也可以用来生成纯粹的undefined

* 未赋值的变量 var test；
* 无返回值的函数 var test = function(){};
* 未定义的属性 var test = {}[''];
* 未赋值实参 

```javascript
(function(window, document, undefined) {
    return undefined;
})(window, document);
```

## **void用途**
### **用作定义或者判断undefined**
不再赘述

### **立即执行函数**

```javascript
(function () {
  console.log(123)
})(); 

void function () {
  console.log(321)
}(); 
```
>在使用立即执行的函数表达式时，可以利用void运算符让JavaScript引擎把一个function关键字识别成函数表达式而不是函数声明（语句）。

### **URIs**
**保证点击之后不会跳转**

```html
<a href="javascript:void(0);">
  这个链接点击之后不会做任何事情
</a>
<a href="javascript:void(document.body.style.backgroundColor='green');">
  点击这个链接会让页面背景变成绿色。
</a>
<a href="javascript:void(0);" onclick="document.body.style.backgroundColor='green'">猜一下会发生什么？
</a>
```

### **或许可以这样**

```javascript
function middleware(next) {
    somethingAsync((err, value) => {
            // 在错误的时候调用next,但是不使用next()的返回值
            // 区别于 next(err)
            if (err) {
                next(err)
                return; 
            } else {
                //dosomething
            })
    }
}

//写成这样
function middleware(next) {
    somethingAsync((err, value) => {
            if (err) {
                return void next(err)
            } else {
                //dosomething
            })
    }
}
```

**一定有人会问，既然都是返回undefined，为什么使用void 0;而不是void其他呢？**

答案很简单啦：以为0比较短~（不要笑，在很多打包及代码压缩过程中都会把undefined转成void 0;就是因为它比较短）
