---
title: Promise 优化
date: 2019-06-04 11:22:06
tags:
  - Promise
  - 性能优化
  - JavaScript
---

总结一些 `Promise` 相关的优化

<!--more-->

在早期 `Node.js` 中，回调函数有一个约定俗成的规矩（**error-first callback style**），那就是异步的方法的回调函数中第一个参数将返回方法的错误信息，第二个参数则是方法的执行结果。回调函数当然是不好的，为回调地狱提供了土壤

在 `Promise` 加入到 `JavaScript` 后，人们对这种回调函数式的接口越来越不爽，最终在 `Node.js` 的 `v8.0` 版本中添加了一个 `util.promisify()` 方法，可以将这种符合 `Node.js` 回调函数规范的接口封装成 `Promise` 结构的返回值

`util.promisify` 的简化实现代码：

```javascript
function promisify(original){
    return function(...args){
    	return new Promise((resolve, reject)=>{
    		try{
    			args.push((e, rs)=>{
    				if( e ){
    					reject( e );
    					return;
    				}
    				
    				resolve( rs );
    			});
    
    			original( ...args );
    		}
    		catch(e){
    			reject(e);
    		}
    	});
    }
}
```

再后来，`Node.js` 的官方 `API` 在后续的各个版本陆续添加 `Promise` 版本的接口，如：

```javascript
let fs = require('fs')
    , fsPromise = require('fs').promises
    ;
    
fs.open('a.txt', (e, fd)=>{
    if( e ){
   		// error
    	return;
    }
    // do something
});

// open 的 promise 版本
fsPromises.open('a.txt').then((fd)=>{
    // do something
}, (e)=>{
    // error
});
```

尽管如此，但是也并不是所有的 `API` 接口都提供了 `Promise` 版本，尤其是一些 `npm` 包，所以 `util.promisify` 方法仍然有很大的价值。

在前端方面，可以自己封装一个 `promisify` 方法，将旧版本的框架、组件中的接口进行重新封装

说回到回调地狱，`Promise` 本质上仍然是回调函数，所以在使用回调函数导致编程回调地狱的时候，使用 `Promise` 同样有可能变成回调地狱，如：

```javascript
getUserByName('zhou').then((user)=>{
    getMessageByUserId( user.id ).then((messages)=>{
    	renderLastMessage( messages[messages.length -1] );
    	
    	messageRead( messages[messages.length -1].msgId ).then(()=>{
    		// do somethine
    	});
    });
});
```

这样的使用方式实际和回调函数没什么区别，正确的方式应该是这样的：

```javascript
getUserByName('zhou').then((user)=>{
    return getMessageByUserId( user.id );
}).then((messages)=>{
    renderLastMessage( messages[messages.length -1] );
    
    return messageRead( messages[messages.length -1].msgId );
}).then((avatars)=>{
	// do somethine
});
```

当然上面的情况还是理想情况下，一旦遇到特殊的场景，比如一个 `Promise` 会依赖于另一个 `Promise`，但是希望同时获得这两个 `Promise` 的输出，如：

```javascript
getUserByName('zhou').then(function(user){
    return getUserAccountById( user.id );
}).then(function(){
    // 需要 user 信息
});
```

为了避免前面的回调嵌套问题，可能会将 `user` 对象存在一个更高的作用域中的变量：

```javascript
let user
    ;

getUserByName('zhou').then(function(res){
    user = res;
    
    return getUserAccountById( user.id );
}).then(function(account){
    return doSomething(user, account);
});
```

虽然这样解决了问题，但我本人并不推荐这种做法，既然定义了一个变量，为什么不把这个变量指向 `Promise` 呢，然后利用 `Promise.all` 方法来达到期望的效果：

```javascript
let getUserName = getUserByName('zhou')
    ;

Promise.all([
    getUserName
    , getUserName.then((user)=>{
    	return getUserAccountById( user.id );
    })
]).then(([user, account])=>{
    return doSomething(user, account);
});
```

其实到现在应该有人已经注意到了，这个问题使用 `ES6` 中 `async` 和 `await` 来处理更加容易：

```javascript
let executor = async function(name){
    let user = await getUserByName( name )
    	, account = await getUserAccountById( user.id )
    	;
    
    return doSomething(user, account);
}
```

虽然 `async` 和 `await` 解决了问题，但是本质上它们是语法糖，并且执行的过程中，也会使用 `Promise`，所以在对 `Promise` 有深入理解前，不推荐使用