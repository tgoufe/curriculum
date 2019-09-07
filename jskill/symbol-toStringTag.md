---
title: 如何判断自定义数据类型
date: 2019-04-23 17:49:08
tags:
  - 前端
  - JavaScript
  - 数据类型
---

看到判断数据类型，首先必然想到 `typeof` 运算符，如：

<!--more-->

```javascript
let obj = {}
	;
 
console.log( typeof obj );	// object
```

但是自定义数据类型么。。。

那么接下来又会想到 `instanceof` 运算符，如：

```javascript
class User{
	// ...
}
 
let user = new User()
	;
 
console.log( user instanceof User );	// true
console.log( obj instanceof User );		// false
```

这样你可以明确知道 `user` 是由 `User` 类构造的，但当不是的时候，怎么办呢？穷举其它的 `class`？

而且 `instanceof` 运算符有很多其它问题啊，比如对有继承关系的类的判断很模糊，即所有对象 `instanceof Object` 都会返回 `true`

再接下来就是判断对象的 `constructor` 属性

```javascript
console.log( user.constuctor );	// User 的代码
console.log( user.constuctor === User );	// true
```

还是同样的问题，当不等于的时候怎么办，还是要穷举啊

同样也是有很多问题，`constructor` 属性并不是一个只读属性，它可以被覆盖，那就无法保证准确性了

突然，一个灵感一闪而过，在 `ES5` 之前是如何判断数据是数组的呢？基本都是使用如下方法：

```javascript
function isArray(target){
	return Object.prototype.toString.call( target ) === '[object Array]';
}
```

那么有没有办法，使 `Object.prototype.toString.call` 调用的时候返回一个特殊的值呢？

查了一下，还真有。。。

随着 `Symbol` 对象在规范中的出现，同时出来了很多内置 `symbol`，其中 `Symbol.toStringTag` 就是其中一个，`MDN` 中描述：

>它通常作为对象的属性使用，对应的属性值应该为字符串类型，这个字符串用来表示对象的自定义类型标签，通常只有内置的 `Object.prototype.toString()` 方法会去读取这个标签并把它包含在自己的返回值里。

这简直太完美了

这样改写后的代码：

```javascript
class User{
	//...
	get [Symbol.toStringTag](){
		return 'User';
	}
}
class VipUser extends User{
	constructor(){
		super();
	}
	//...
	get [Symbol.toStringTag](){
		return 'VipUser';
	}
}

let user = new User()
	, vip = new VipUser()
	;
 
console.log( Object.prototype.toString.call(user) );	// [object User]
console.log( Object.prototype.toString.call(vip) );		// [object VipUser]
```

这样只需要加些判断就可以知道，`user` 对象是由 `User` 类构造的，`vip` 对象是由 `VipUser` 类构造的

此外，因为使用了 `getter` 的方式定义，`Symbol.toStringTag` 属性无法被覆盖，如：

```javascript
vip[Symbol.toStringTag] = 'adfasdff';
 
console.log( Object.prototype.toString.call(vip) );		// [object VipUser]
```

那么对于某些以字面量的方式生成的对象，就必须小心了，应该以 `Object.defineProperty` 的方式来定义 `Symbol.toStringTag` 属性，否则是可能被覆盖的，如：

```javascript
let obj1 = {}
	, obj2 = {}
	;
 
obj1[Symbol.toStringTag] = 'User';
Object.defineProperty(obj2, Symbol.toStringTag, {
	get(){
		return 'User';
	}
});
 
console.log( Object.prototype.toString.call(obj1) );	// [object User]
console.log( Object.prototype.toString.call(obj2) );	// [object User]
 
obj1[Symbol.toStringTag] = 'VipUser';
obj2[Symbol.toStringTag] = 'VipUser';

console.log( Object.prototype.toString.call(obj1) );	// [object VipUser]
console.log( Object.prototype.toString.call(obj2) );	// [object User]
```

但是，这些都是基于 `Object.prototype.toString.call` 调用的返回结果，如果真有人作死把 `Object.prototype.toString` 覆盖了怎么办。。。
 
 
 
 
 
 
 
 
还好这个 `toStringTag` 是可以直接调用的。。。

```javascript
console.log( user[Symbol.toStringTag] );	// User
``` 