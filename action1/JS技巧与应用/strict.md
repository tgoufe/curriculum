
---
title: 严格模式究竟讲了什么
date: 2019-08-29 17:00:00
tags: JavaScript
categories: 开发技巧 
---
 

> 我们的代码可是敲严格的哟~

<!--more-->

> ECMAScript 5的严格模式是采用具有限制性JavaScript变体的一种方式，从而使代码显示地脱离“马虎模式/稀松模式/懒散模式“（sloppy）模式。
> 
严格模式不仅仅是一个子集：它的产生是为了形成与正常代码不同的语义。

不支持严格模式与支持严格模式的浏览器在执行严格模式代码时会采用不同行为。
所以在没有对运行环境展开特性测试来验证对于严格模式相关方面支持的情况下，就算采用了严格模式也不一定会取得预期效果。

严格模式代码和非严格模式代码可以共存，因此项目脚本可以渐进式地采用严格模式。


## 开启严格模式

```
	// 全局开启严格模式，为整个脚本文件开启严格模式，需要在所有语句之前放一个特定语句（单双引号均可）
	 'use strict';
	 
	// 为函数开启严格模式,放在函数体所有语句前面
	function strict() {
  		'use strict';
  		return "hi";
	}
```

## 严格模式有哪些变化
### ——变量——###
#### **变量必须声明才能使用**####
如果一个变量没有声明就赋值

* 非严格模式下解释器主动把他提升为全局变量。
* 严格模式会报错

```javascript
	'use strict';
	a =99;
	console.log(a) //ReferenceError: a is not defined
```

#### **静默失败显示为异常**####
给不可写属性赋值, 给只读属性(getter-only)赋值赋值, 给不可扩展对象(non-extensible object)的新属性赋值

* 非严格模式下会静默失败，不会有提示。
* 严格模式会报错

```javascript
	'use strict';
	NaN = 88;
	
	const a = 1;
	a=88;//这种写法，现代浏览器，无论是否严格模式都会抛出错误
	
	var obj = {};
	Object.defineProperty(obj, "x", { value: 88, writable: false });
	obj.x = 9; // 给对象创建一个不可写的属性
	
	// 给不可扩展对象的新属性赋值
	var obj = {};
	Object.preventExtensions(obj);
	obj.value = "88"; // 给不可拓展对象新属性赋值
```

#### **增加保留字**####
增加了后续版本可能用到的保留字，禁止他们作为变量名或者形参

`implements, interface, let, package, private, protected, public, static和yield`

```javascript
	'use strict';
	var  public = '88';
	
	console.log(public);
```
#### **禁止使用delete**####
使用delete删除声明变量

* 非严格模式下正常执行
* 严格模式会报错

```javascript
	'use strict';
	var a = '88';

	delete  a;
	console.log(a);
```
### **——对象——**###
#### **不可delect删除不可删除属性**####
使用delete删除删除不可删除属性

* 非严格模式下不执行，不报错
* 严格模式会报错

```javascript
	'use strict';
	delete Object.prototype;
	console.log(Object.prototype);//尝试删除prototype
```

#### **属性名必须唯一**####
给对象创建相同名称的属性

* 非严格模式下，后面的会覆盖前面的
* 严格模式会报错

```javascript
	'use strict';

	var a = { x: 88, x: 99 };
	console.log(x)
```
### **——函数——**###
#### **函数参数名必须唯一**####
给函数创建相同名称的参数

* 非严格模式下，参数名允许重复，后面匹配的参数会覆盖之前匹配的参数
* 严格模式会报错

```javascript
	'use strict';
	function x(a,a,c){
		console.log(...arguments)//非严格模式依然可以通过arguments取到值
		console.log(a,c)
	}

	x(1,2,3)
```
#### **函数声明的限制 **####
在块级作用域内定义函数

* 非严格模式下函数可以在任何作用域下进行定义
* 严格模式下函数的定义只能在全局作用域与函数作用域(不能在块级作用域定义函数)

```javascript
	'use strict';
	for (var i=0; i<10; i++){
	    function x() {
	        console.log('88888');//块级作用域
	    }
	}
	
	x();
```

### **——arguments——**###
#### **arguments对象获取参数的值的改变**####
给获取到参数重新赋值。

* 非严格模式下arguments对象获取参数的值与形参有关的
* 严格模式下arguments对象获取参数的值与形参无关的

```javascript
	'use strict';
	function x(a){
		var a = 99;
		console.log(...arguments)//如果局部变量与形参名相同 - 就根据就近原则进行获取
		console.log(a)
	}

	x(1)
```

### **——其他——**###
#### **增加eval()作用域**####
eval()作用域

* 非严格模式下eval()函数创建的变量可以在其他位置进行调用
* 严格模式下eval()函数创建的变量只能在当前eval()函数中使用
```javascript
	'use strict';
	eval('var a = "88";');
	console.log(a);
```

#### **禁止使用with**####

* 非严格模式下正常使用
* 严格模式下禁用 with

```javascript
	"use strict";
	var a = 88;
	with (obj) { 
	  // 如果没有开启严格模式，with中的这个a会指向with上面的那个a，还是obj.a？
	  // 如果不运行代码，我们无法知道，一切都是在运行时决定的
	  a;
	}
```

#### **禁止使用八进制**####

* 非严格模式下正常使用
* 严格模式下禁用

```javascript
	"use strict";
	var n = 0100; //整数第一位为0代表八进制，严格模式下整数第一位为0则报错
```

#### **禁止this关键字指向全局对象**####

* 非严格模式下正常使用
* 严格模式下全局作用域中定义的函数中的this为undefined

```javascript
	 function x(){
   console.log(!this); //返回的是false，因为this指向的是全局对象，!对象 == false
 }
 function x1(){
   "use strict"
   console.log(!this) ; //返回的是true，因为严格模式下，this的值为undefined，!undefined == true
 }


x();x1();
```



[MDN 严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)
