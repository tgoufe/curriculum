---
title: 实现动态创建 Web Worker
date: 2019-03-27 17:35:23
tags:
  - 前端
  - Web Worker
  - 性能优化
  - JavaScript
---

何为 `Web Worker`

<!--more-->

`Web Worker` 可以独立于主线程的后台线程中，运行一个脚本操作。这样做的好处是可以在独立线程中执行费时的处理任务，从而允许主线程（通常是 `UI` 线程）不会因此被阻塞 `/` 放慢。

通常最简单的创建的方式为在页面的 `JS` 代码中使用 `Worker` 对象来加载另一个 `JS` 文件：
```javascript
let worker = new Worker('worker.js')
	;
 
worker.postMessage('hello, worker');
 
worker.onmessage = (e)=>{
	console.log('收到 worker 的消息', JSON.stringify(e.data));
}
```

在 `worker.js` 中的代码为：

```javascript
self.onmessage = (e)=>{
	console.log('收到主线程的消息', JSON.stringify(e.data));
 
	self.postMessage('hello, host');
}
```

那么该如何动态的创建 `Worker` 呢？

建立多个 `JS` 文件，根据情况来创建不同的 `Worker`?

那还有什么意思呢。。。

随着 `HTML5` 的不断发展，新提供的接口、对象可以提供另一种解决方案：

* `Blob` 对象，表示一个不可变、原始数据的类文件对象
* `URL` 对象的 `createObjectURL` 方法

这样，就可以用如下的代码实现上文的同样效果，但却少了一个文件：

```javascript
let code = `
self.onmessage = (e)=>{
	console.log('收到主线程的消息', JSON.stringify(e.data));
 		
	self.postMessage('hello, host');
}
`
	, blob = new Blob([code], {
		type: 'text/javascript'
	})
	, url = URL.createObjectURL(blob, {
		type: 'text/javascript'
	})
	, worker = new Worker( url )
	;
 
worker.postMessage('hello, worker');
 
worker.onmessage = (e)=>{
	console.log('收到 worker 的消息', JSON.stringify(e.data));
};
```

这样基于此，进一步封装：

```javascript
function createWorker(handler){
	let code = `
let handler = ${handler.toString}
	;
 
self.onmessage = (e)=>{
	self.postMessage( handler(e.data) );
};
`
		, blob = new Blob([code], {
			type: 'text/javascript'
		})
		, worker = new Worker( URL.createObjectURL(blob) )
		;
 
	return worker;
}
```

那么，这样有什么用呢，目前可用的场景有对大数据进行处理，其它的后续补充。。。

```javascript
let handleData = (data)=>{
		let rs
			;
 
		// 处理 data
 
		return rs;
	}
	, render = (data)=>{
		// 渲染
	}
	;
 
fetch('/bigData').then((res)=>{
	if( res.data.length > 100000 ){
		// 数据量太大，创建 worker 进行处理
		let worker = createWorker( handler )
			;
 
		worker.postMessage( res.data );
		worker.onmessage = function(e){
			render( e.data );
 
			worker.terminate();	// 结束 worker
		}
	}
	else{
		render( handleData(res.data) );
	}
});
```

参考文章：
[动态创建 Web Worker 实践指南](https://zhuanlan.zhihu.com/p/5998168)