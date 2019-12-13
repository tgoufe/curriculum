---
title: 每天一点网站优化之：前端静态资源缓存 sevice worker
date: 2019-06-28 17:00:00
tags: 
    -JavaScript 
categories: JavaScript
---
在前一课我们讲过，通过在服务端设置http请求头字段的方式，控制浏览器的静态资源缓存规则
那么，作为前端开发，有没有不需要后端配合的缓存方式呢？
下面，我们就一起来了解一下，在客户端代码控制web离线缓存的sevice worker。
<!--more-->
Service Worker 是 Chrome 团队提出和力推的一个 WEB API，用于给 web 应用提供高级的可持续的后台处理能力。
该 WEB API 标准起草于 2013 年，于 2014 年纳入 W3C WEB 标准草案，当前还在草案阶段。

Service workers 本质上充当Web应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。
它们能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。
他们还允许访问推送通知和后台同步API。

当浏览器发送请求时，首先到达sw脚本中，如果没有命中，再转发给http请求。
# sevice worker的特点
- 网站必须使用 HTTPS。除了使用本地开发环境调试时(如域名使用 localhost)
- 运行于浏览器后台，可以控制打开的作用域范围下所有的页面请求
- 单独的作用域范围，单独的运行环境和执行线程
- 不能操作页面 DOM。但可以通过事件机制来处理

sevice worker浏览器支持情况
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1561966630925.png)

# sevice worker的生命周期
注册 -> 安装 -> 激活 ->  废弃
## 注册register
- service worker URL 通过 serviceWorkerContainer.register() 来获取和注册。
- 如果注册成功，service worker 就在 ServiceWorkerGlobalScope 环境中运行； 这是一个特殊类型的 woker 上下文运行环境，与主运行线程（执行脚本）相独立，同时也没有访问 DOM 的能力。
- service worker 现在可以处理事件了
- chrome 浏览器下，注册成功后，可以打开 chrome://serviceworker-internals/ 查看浏览器的 Service Worker 信息

也可以在开发者工具中查看浏览器中sevice worker的情况
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1561688910526.png)
注册sevice worker：
```javascript
f ('serviceWorker' in navigator) {
	    navigator.serviceWorker
	        .register('sw.js', {scope: '/'})
	        .then(registration => {
	        	console.log('ServiceWorker 注册成功！作用域为: ', registration.scope) 
	    	})
	        .catch(err => {
	        	console.log('ServiceWorker 注册失败: ', err)
	    	});
	}
```
代码解析：
- sw.js是sevice worker的脚本，sevice worker的所有行为逻辑都在其中呈现
- sw.js所在的位置决定了sevice worker的作用域，作用域内所有的页面请求都会被
sevice worker所监控， scope参数可以修改其作用域。

## 安装（install）和更新
### 初次打开受 service worker 控制的页面后，会触发install事件
- 当 oninstall 事件的处理程序执行完毕后，可以认为 service worker 安装完成了
### sw.js文件有更新，也会触发install事件
- 如果 sw.js 文件的内容有改动，当访问网站页面时浏览器获取了新的文件，它会认为有更新，于是会安装新的文件并触发 install 事件。但是此时已经处于激活状态的旧的 Service Worker 还在运行，新的 Service Worker 完成安装后会进入 waiting 状态。
直到所有已打开的页面都关闭，旧的 Service Worker 自动停止，新的 Service Worker 才会在接下来打开的页面里生效
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1561690352625.png
)
- 可以在 install 事件中执行 skipWaiting 方法跳过 waiting 状态，然后会直接进入 activate 阶段。接着在 activate 事件发生时，通过执行 clients.claim 方法，更新所有客户端上的 Service Worker。
示例代码：
```javascript
// 安装阶段跳过等待，直接进入 active
self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
});
```
## 激活active
- 当 service worker 安装完成后，会接收到一个激活事件(activate event)。 onactivate 主要用途是清理先前版本的service worker 脚本中使用的资源
- 通过监听 activate 事件你可以做一些预处理，如对于旧版本的更新、对于无用缓存的清理等

在下面的示例中，我们实现对旧版本的缓存资源清理
```javascript
this.addEventListener('activate', event => {
    const cacheWhitelist = ['lzwme_cache_v1.6.0'];

    event.waitUntil(
        // 遍历当前的缓存，删除 指定版本号 之外的所有缓存
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
```
传给 waitUntil() 的 Promise 会阻塞其他的事件，直到它完成。这可以确保清理操作会在第一次 fetch 事件之前完成
## fetch事件与缓存策略
- 当浏览器发起请求时，会触发 fetch 事件, fetch事件会拦截所有作用域内的请求
- 拦截请求后，根据request url和缓存做比对，如果当请求资源已经在缓存里了，直接返回缓存里的内容；否则使用 fetch API 继续请求，并且将请求成功后的response存入缓存中

参考下面的示例：
```javascript
self.addEventListener('fetch', function(event) {
  // console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    
    // Opens Cache objects that start with 'font'.
    caches.open(CURRENT_CACHES['carry']).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        // 如果命中了缓存，直接返回缓存中的数据
        if (response) {
          console.log(' Found response in cache:', response);
          return response;
        }

        // 请求是stream，只能使用一次
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest)
            .then(function(response) {
                //请求不成功，则不存入缓存
                if(!response || response.status !== 200) {
                    return response;
                }
                // 如果没有命中缓存，将请求和响应缓存到cache中
                // 响应也是stream，只能使用一次，一次用于缓存，一次用于浏览器响应
                var responseToCache = response.clone();
                caches.open(CURRENT_CACHES['carry'])
                    .then(function(cache) {
                        // 抓取请求及其响应，并将其添加到给定的cache
                        cache.put(event.request, responseToCache);
                    });
                return response;
            }); 

      }).catch(function(error) {
        
        // Handles exceptions that arise from match() or fetch().
        console.error('  Error in fetch handler:', error);

        throw error;
      });
    })
  );
});
```
## 缓存策略优化
- 指定缓存的接口类型，如只缓存js和css请求，其他类型依然发送http请求

## 清除旧缓存
- 给缓存增加版本号，当修改版本号之后，在active阶段，所有上一版本的缓存都会被清空

以下完整代码
```javascript
var CACHE_VERSION = 2;

// Shorthand identifier mapped to specific versioned cache.
var CURRENT_CACHES = {
  carry: 'version' + CACHE_VERSION
};

const cacheList = [
    'css',
    'js'
]

// 安装阶段跳过等待，直接进入 active
self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  // Active worker won't be treated as activated until promise resolves successfully.
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        // 更新客户端
        clients.claim(),
        // 清理旧版本
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) == -1) {
            console.log('Deleting out of date cache:', cacheName);
            
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  let cached = cacheList.find(c => {return event.request.url.indexOf(c) !== -1 });

  event.respondWith(
    if(cached){
        // 打开指定版本的缓存列表
        // 每个cache对象和请求的request url 匹配
        caches.open(CURRENT_CACHES['carry']).then(function(cache) {
          return cache.match(event.request).then(function(response) {
            // 如果命中了缓存，直接返回缓存中的数据
            if (response) {
              console.log(' Found response in cache:', response);
              return response;
            }

            // 请求是stream，只能使用一次
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest)
                .then(function(response) {
                    if(!response || response.status !== 200) {
                        return response;
                    }
                    // 如果没有命中缓存，将请求和响应缓存到cache中
                    // 响应也是stream，只能使用一次，一次用于缓存，一次用于浏览器响应
                    var responseToCache = response.clone();
                    caches.open(CURRENT_CACHES['carry'])
                        .then(function(cache) {
                            // 抓取请求及其响应，并将其添加到给定的cache
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                }); 

          }).catch(function(error) {
            
            // Handles exceptions that arise from match() or fetch().
            console.error('  Error in fetch handler:', error);

            throw error;
          });
        })
    }else{
        return fetch(fetchRequest)
            .then(response => {
                return response;
            })
    }
  );
});

```
## 废弃Redundant
导致废弃的原因
- 安装(install)失败
- 激活(activating)失败
- 新版本的 Service Worker 替换了它并成为激活状态
- 手动在浏览器开发者工具中停止sevice worker


## 总结
sevice worker的作用，远远不止请求资源缓存这一条，基于 Service Worker API 的特性，结合 Fetch API、Cache API、Push API、postMessage API 和 Notification API，可以在基于浏览器的 web 应用中实现
如离线缓存、消息推送、静默更新等 native 应用常见的功能，以给 web 应用提供更好更丰富的使用体验。


