---
title: 如何可定制的序列化数据
date: 2019-03-05 17:32:36
tags:
  - 前端
  - JavaScript
  - JSON
---

所谓序列化（`Serialization`）是将对象的状态信息转换为可以存储或传输的形式的过程（百度百科）。一般结果即为字符串

<!--more-->

通常看到序列化，一般都会想到 `JSON.stringify` 方法

`JSON.stringify` 方法接受 `3` 个参数，后两个为可选：

|  参数  |  可选  |  描述  |
|:------:|:------:|:------:|
|  value  |    |  将要序列化成 JSON 字符串的值  |
|  replacer  |  可选  |  如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 `JSON` 字符串中；如果该参数为 `null` 或者未提供，则对象所有的属性都会被序列化  |
|  space  |  可选  |  指定缩进用的空白字符串，用于美化输出（`pretty-print`）；如果参数是个数字，它代表有多少的空格；上限为 `10`。该值若小于 `1`，则意味着没有空格；如果该参数为字符串（字符串的前十个字母），该字符串将被作为空格；如果该参数没有提供（或者为 `null`）将没有空格  |

其中值得注意的是 `replacer` 参数如果为函数类型的时候，第一次调用时会传入的参数为空字符串和要序列化的 `value`，根据返回的值继续执行

这样问题似乎解决了，只要在调用 `JSON.stringify` 时传入第二个参数：一个函数或者一个数组，就可以实现定制序列化结果了，如：

```javascript
let value = {
		a: 1
		, b: 2
		, c: 3
	}
	;
 
JSON.stringify(value, function(key, value){
	if( typeof value === 'object' ){
		return value;
	}
	else{
		if( key === 'a' ){	// 只输出 a 属性
			return value;
		}
	}
});	// 输出 {"a": 1}
// 或者
JSON.stringify(value, ['a']);	// 输出 {"a": 1}
```
但是，现实不总是那么美好

因为大多数需要序列化的场景里，都会包含一定程度的业务逻辑被封装在某些公共方法中，而这些方法则很少会提供设置 `JSON.stringify` 第二个参数的接口，这样就只能在调用公共方法前对数据对象进行处理

但是，又有了转机

据规范，如果一个被序列化的对象拥有 `toJSON` 方法，那么该 `toJSON` 方法就会覆盖该对象默认的序列化行为：不是那个对象被序列化，而是调用 `toJSON` 方法后的返回值会被序列化

先说说 `toJSON` 方法，乍一看，这个方法有点像 `toString` 方法，但实际上，这个方法的被重视程度完全无法与 `toString` 方法相比，并没有像 `toString` 方法可以从原型继承而来

只有少数对象自带 `toJSON` 方法， 这其中最常用的应该是 `Date` 对象了

这样看来 `toJSON` 方法更像是一种约定性的接口，但既然已经被提出并写在规范里，那么它的兼容性就可以保证

无论如何 `toJSON` 的存在就可以更容易实现上述代码中的需求：

```javascript
value.toJSON = function(){
	return {
		a: this.a
	};
};
 
JSON.stringify( value );	// 输出 {"a": 1}
```

这样也使得代码耦合度更高，是 `value` 自身的方法来决定 `value` 的序列化结果

关于使用场景，在前端上目前至少有 `2` 个场景，想到其它再补充：

1. 发送 `ajax` 请求时，对数据进行处理，如：
```javascript
fetch('/a', {
	method: 'POST'
	, body: JSON.stringify( value )
});	// 将只发送 {"a": 1}
```

2. 将数据缓存到本地

在 `node` 端则更是大有可为，如：

```javascript
class User{
	constructor(name, lv, info){
		this.name = name;
		this.lv = lv;
		this.info = info;
	}
 
	toJSON(){
		return {
			name: this.name
			, ...this.info
		};
	}
}
 
let user = new User('aa', 1, {
		gender: '男'
	})
	;
 
res.send( user );	// 发送 {"name": "aa", "gender": "男"}
```