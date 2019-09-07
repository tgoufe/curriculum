---
title: 给一个对象的属性赋值可能发生些什么
date: 2019-08-15 15:03:51
tags:
  - 继承
  - 原型链
  - defineProperty
  - JavaScript
  - 严格模式

abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---

假设有一个对象 `myObject`，它继承自一个对象
```javascript
// 填写代码
myObject.foo = 'bar';
console.log( myObject.foo );
```
在“填写代码处”填写对应代码，要求不能强制抛出异常，不能直接赋值，没有变量未定义，没有语法错误，以实现下述目标：
<!--more-->
### 正常执行

这个太简单了：
```javascript
let myObject = Object.create({})
    ;

myObject.foo = 'bar';
            
console.log( myObject.foo );	// "bar"
```
就如你所想，仅仅是一段平平无奇的赋值代码，输出的值为 `"bar"`

如果 `myObject` 对象中包含名为 `foo` 的普通数据访问属性，这条赋值语句只会修改已有的属性值

如果 `foo` 不是直接存在于 `myObject` 中，原型链就会被遍历，类似 `Getter` 操作。如果原型链上找不到 `foo`，`foo` 就会被直接添加到 `myObject` 上

如果 `foo` 既出现在 `myObject` 中也出现在原型链上层，那么就会发生屏蔽。`myObject` 中包含的 `foo` 属性会屏蔽原型链上层的所有 `foo` 属性，因为 `myObject.foo` 总是会选择原型链中最底层的 `foo` 属性

### `myObject` 对象自身有 `foo` 属性，但输出 `myObject.foo` 时值不是 `"bar"`

这个的话可能有两种情况，一是 `myObject` 自身有 `foo` 属性并被设置为只读，或者是以 `Getter` 的方式定义的：
```javascript
let myObject = Object.create({})
    ;

Object.defineProperty(myObject, 'foo', {
    writable: false
    , value: 'foo'
});
// 或者
Object.defineProperty(myObject, 'foo', {
    get(){
    	return 'foo';
    }
});

myObject.foo = 'bar';
            
console.log( myObject.foo );	// "foo"
```
之前分享过属性描述符，这里就不再复述了

### `myObject` 对象自身有 `foo` 属性，执行报错

题目已经要求了不能强制抛出异常，那么应该想一下，什么时候赋值语句会抛出异常，答案是在严格模式下，对只读属性赋值会报错：
```javascript
'use strict';
let myObject = Object.create({})
    ;

Object.defineProperty(myObject, 'foo', {
    writable: false
    , value: 'foo'
});

myObject.foo = 'bar';	// 异常
            
console.log( myObject.foo );
```
严格模式下，很多原本可以执行的代码也会报错

### `myObject` 对象自身没有 `foo` 属性，但原型链上有，正常执行

这个也很简单：
```javascript
let myObject = Object.create({
    	foo: 'foo'
    })
    ;

myObject.foo = 'bar';
            
console.log( myObject.foo );	// "bar"
```
如果 `foo` 不直接存在于 `myObject` 中而是存在于原型链上层时，如果在原型链上层存在名为 `foo` 普通数据访问属性并且没有被标记为只读（`writable: true`），那就会直接在 `myObject` 中添加一个名为 `foo` 的新属性，它是屏蔽属性

### `myObject` 对象自身没有 `foo` 属性，但原型链上有，正常执行，但输出 `myObject.foo` 时值不是 `"bar"`

之前提到了只读的问题：
```javascript
let obj = Object.defineProperty({}, 'foo', {
    	writable: false
    	, value: 'foo'
    })
    , myObject = Object.create( obj )
    ;

myObject.foo = 'bar';

console.log( myObject.foo );	// "foo"
```
如果在原型链上层存在 `foo`，但是它被标记为只读（`writable: false`），那么无法修改已有属性或者在 `myObject` 上创建屏蔽属性

### `myObject` 对象自身没有 `foo` 属性，但原型链上有，执行报错

之前已经提到严格模式下的报错问题了，那么：
```javascript
'use strict';
let obj = Object.defineProperty({}, 'foo', {
    	writable: false
    	, value: 'foo'
    })
    , myObject = Object.create( obj )
    ;

myObject.foo = 'bar';	// 异常

console.log( myObject.foo );
```

### `myObject` 对象自身没有 `foo` 属性，但原型链上有，正常执行，但输出 `myObject.foo` 时值是 `undefined`(即没有该属性)

```javascript
let obj = Object.defineProperty({}, 'foo', {
    	set(){}
    })
    , myObject = Object.create( obj )
    ;

myObject.foo = 'bar';

console.log( myObject.foo );	// undefined
```
如果在原型链上层存在 `foo` 并且他是一个 `Setter` 那就一定会调用这个 `Setter`。`foo` 不会被添加到 `myObject`，也不会重新定义 `foo` 这个 `Setter`

### `myObject` 对象自身没有 `foo` 属性，但原型链上有，正常执行，输出 `myObject.foo` 时值是 `"bar"`，同时原型链上的 `foo` 属性值也被修改为 `"bar"`

经过前面的代码我们已经知道了，赋值是时会生成屏蔽属性，所以屏蔽属性和原型链上的 `foo` 必然不是同一个值。但是赋值仍然将两个属性同时修改，那么说明这两个属性指向同一个外部变量：
```javascript
let foo = 'foo'
    , obj = Object.defineProperty({}, 'foo', {
    	set(value){
    		foo = value;
    	}
    	, get(){
    		return foo;
    	}
    })
    , myObject = Object.create( obj )
    ;

myObject.foo = 'bar';

console.log( myObject.foo );	// "bar"
console.log( obj.foo );			// "bar"
```

### ps.

如果希望解决上面在原型链上使用 `Object.defineProperty` 定义只读属性的问题，那就不能使用 `=` 操作符来赋值，而是使用 `Object.defineProperty` 来添加属性

### pps

有些情况下会隐式的产生屏蔽：
```javascript
let obj = {
    	count: 2
    }
    , myObject = Object.create( obj )
    ;

console.log( obj.count );	// 2
console.log( myObject.count );	// 2
console.log( obj.hasOwnProperty('count') );	// true
console.log( myObject.hasOwnProperty('count') );	// false

myObject.count++;	// 隐式屏蔽

console.log( obj.count );	// 2
console.log( myObject.count );	// 3
console.log( myObject.hasOwnProperty('count') );	// true
```