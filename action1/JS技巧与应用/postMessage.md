---
title: 你能用多少种对象 postMessage？
date: 2019-06-19 13:47:47
tags:
  - 前端
  - postMessage
  - 浏览器
  - JavaScript
  - 异步

abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---

两个不同的运行时只能通过 `postMessage` 方法进行通信

<!--more-->

看到 `postMessage`，大家应该很熟悉，之前分享 `Web Worker` 以及跨域相关的知识时有提到

但是细心的人一定注意到了，它们的调用对象是不同的。后来随着不断的查资料，`postMessage` 这个方法不断的出现，所以本着探(xian)索(de)精(dan)神(teng)就来统计一下，到底有哪些对象可以使用 `postMessage` 方法

在此之前，值得一提的是，各个 `postMessage` 方法的参数以及机制是惊人的一致：

|  参数 | 可选 | 描述 |
|:------:|:------:|:------:|
| message |  | 将要发送的数据。它将会被结构化克隆算法序列化 |
| targetOrigin |  | 来制定那些域可以接收到消息，其值可以是字符串 `'*'`(表示无限制) 或者一个 `URI`。在发送消息时，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配 `targetOrigin` 提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送 |
| transfer | 可选 |是一串和 `message` 同时传递的 `Transferable` 对象。这些对象的所有权将被转移给消息的接收方，而发送方将不再保有所有权 |

接收消息目标监听 `message` 事件来接收传递的数据，具体的属性：

| 属性 | 描述 |
|:------:|:------:|
| data | 从其它上下文传递过来的对象 |
| origin | 调用 `postMessage` 时小时发送方的 `origin` |
| source | 对发送消息的对象的引用；可以使用此来在具有不同 `origin` 的两个上下文直接建立双向通信 |

首先就是大家的老朋友了 `window` 对象，但是也不仅仅是那个全局对象，还有 `iframe.contentWindow` 和 `window.open()` 的返回值。接收消息的方式都是在对应页面里的 `window` 对象监听 `message` 事件

接下来就是 `Web Worker` 了，这个以前分享过，就不再赘述了

再接下来是 `Service Worker` 了，值得一提的是 `Service Worker` 本身并没有 `postMessage` 方法，而是在 `Service Worker` 的全局上下文中（可以使用 `self` 引用）中提供了 `clients` 对象，而后再通过 `clients` 的 `get` 或者 `matchAll` 方法获得到一个或多个 `client` 对象，而这个 `client` 对象才拥有 `postMessage` 方法。`client` 对象对应的在同域下的 `Window`、`Worker` 或 `SharedWorker` 对象。那么到底有什么场景能用到这个 `postMessage` 方法呢，具体说就是 `Service Worker` 是有推送功能的，但是由于一些你懂的的原因该功能无法使用了，这样自然也就没有使用 `postMessage` 方法来发送消息的场景了

接下来就要讲一些不常见的东西了

上面提到了一个 `SharedWorker` 对象，那么这是什么呢？

`SharedWorker` 是一种特定类型的 `Worker`，可以从几个浏览器上下文中访问。这样看来它与 `Web Worker` 最大的区别就是共享了（都写在名字上了。。。）。也就是说，在多个页面里都创建一个 `Web Worker`，即使它们的文件路径是相同的，它们也是不同的实体。而 `SharedWorker` 只要是同一个文件路径，那么它们都指向同一个实体

```javascript
// index.html 下 JavaScript 代码
let sharedWorker = new SharedWorker('sharedWorker.js')
    ;

sharedWorker.port.start();
sharedWorker.port.onmessage = function(e){
    console.log( e.data );
};

sharedWorker.port.postMessage('from index');

// page.html 下 JavaScript 代码
let sharedWorker = new SharedWorker('sharedWorker')
    ;

sharedWorker.port.start();
sharedWorker.port.onmessage = function(e){
    console.log( e.data );
};

sharedWorker.port.postMessage('from page');

// sharedWorker.js
let cache = []
    , ports = []
    ;

self.onconnect = function(e){
    if( e.ports && e.ports[0] ){
        ports.push( e.ports[0] );
        e.ports[0].onmessage = function(e){
            cache.push( e.data );
    
            if( cache.length > 1 ){
                ports.forEach((port)=>{
                    port.postMessage( cache );
                });
            }
        }
    }
};
    
// index 和 page 输出
["from index", "from page"]
```

执行上面的代码，可以发现 `cache` 里的数据分布来自 `index` 和 `page` 两个页面，也就是说这两个页面共享了同一个 `SharedWorker` 实例

再仔细看代码的话，就会发现和 `Web Worker` 不同有很多不同。首先每个页面生成 `SharedWorker` 对象实例后，还要使用其 `port` 属性来进行操作，`postMessage` 和监听 `message` 事件都要在其上操作，更重要的是之前还要调用 `start` 方法。其实仔细想一下也是很合理的，`SharedWorker` 是要达到一对多的关系，就必须对信息来源添加某种标识。

在看 `SharedWorker` 调用的文件内部实现，没有了 `Web Worker` 的 `onmessage` 方法，而使用 `onconnect` 方法。这样就明了了，调用 `start` 方法时会触发 `connect` 事件，来通知 `port` 被启用了，然后在对对应的 `port` 进行监听或发送消息

顺便一提，`Worker` 和 `SharedWorker` 对象都继承自 `AbstractWorker` 对象，而 `ServiceWorker` 则继承自 `Worker` 对象

再顺便一提，在 `Safari` 上并不支持 `SharedWorker`

接下来又一个新东西，`BroadcastChannel`

`BroadcastChannel` 可以创建一个在同域下所有全局上下文共享的信息通道，先看一段代码

```javascript
// index.html 下 JavaScript 代码
let bc = new BroadcastChannel('channel')
    ;

bc.onmessage = function(e){
    console.log('接收到', e.data);
};

bc.postMessage('from index');

// 输出
// 接收到 from iframe
// 接收到 from page

// iframe.html 下 JavaScript 代码
let bc = new BroadcastChannel('channel')
    ;

bc.onmessage = function(e){
    console.log('接收到', e.data);
};

bc.postMessage('from ifame');

// 输出
// 接收到 from index
// 接收到 from page

// page.html 下 JavaScript 代码
let bc = new BroadcastChannel('channel')
    ;

bc.onmessage = function(e){
    console.log('接收到', e.data);
};

bc.postMessage('from index');
    
// 输出
// 接收到 from index
// 接收到 from iframe
```

也就是说在任何其它页面，只要创建了名为 `'channel'` 的 `BroadcastChannel` 对象的实例，且能够满足 `targetOrigin` 设置域，那么消息会被发给所有这些页面，同时也能接收到这些页面发送来的消息。但是好像唯独没有接收到自己发送的消息，这似乎和我们通常所知道的广播似乎有些区别。说到缺点，那么肯定是没法做一些只发送给特定目标的操作，只能由接收方来决定是否接收，也不容易分辨消息具体是由哪个页面或全局上下文发送的

总结一下，它和 `SharedWorker` 最大的区别就是 `SharedWorker` 是一个独立的脚本，拥有自己的全局上下文，而 `BroadcastChannel` 则只能依赖于其它的全局上下文

再顺便一提，`Safari` 下也不支持 `BroadcastChannel`

那么说到没法分辨消息的来源，有没有其它的办法呢，有的就是接下来要说的是 `MessageChannel` 对象

使用 `MessageChannel()` 构造函数来创建通讯信道。一旦创建，信道的两个端口即可通过 `MessageChannel.port1` 和 `MessageChannel.port2` 属性进行访问。简单看一下代码：

```javascript
// index.html 下 JavaScript 代码
let iframePort
    ;
    
window.onmessage = function(e){
    if( e.ports && e.ports[0] ){
        iframePort = e.ports[0];

        console.log('iframe 建立连接');
        iframePort1.onmessage = function(e){
            console.log( e.data );
        };

        iframePort1.postMessage('from index');
    }
};

// 输出
// ifame 建立连接
// from iframe

// iframe.html 下 JavaScript 代码
let mc = new MeesageChannel()
    ;

mc.port1.onmessage = function(e){
    console.log( e.data );
};

window.parent.postMessage('create', '*', [mc.port2]);
    
mc.port1.postMessage('from iframe');

// 输出
// from index
```

这个和 `MDN` 官方给的 `demo` 差不多，看完这个代码，你一定会觉得不明所以，因为这个这个代码中所要达到的效果完全就可以使用 `index` 页面和 `iframe` 页面之间互相通过 `window.postMessage` 来达到，完全没有显示出 `MessageChannel` 的用处

所以我们重新设计一下：

```javascript
// index.html 下 JavaScript 代码
let mc = new MessageChannel()
    ;

$('#iframe1').on('load', function(){
    this.contentWindow.postMessage('mc', '*', [mc.port1]);
});
$('#iframe2').on('load', function(){
    this.contentWindow.postMessage('mc', '*', [mc.port2]);
});
    
// iframe1.html 下 JavaScript 代码
let port
    ;

window.onmessage = function(e){
    if( e.ports && e.ports[0] ){
        port = e.ports[0];
        console.log('接收到 port');
    
        port.postMessage('from iframe 1');
    }
};
    
// 输出结果
// 接收到 port
// from iframe 2

// iframe2.html 下 JavaScript 代码
let port
    ;

window.onmessage = function(e){
    if( e.ports && e.ports[0] ){
        port = e.ports[0];
        console.log('接收到 port');
    
        port.postMessage('from iframe 2');
    }
};

// 输出结果
// 接收到 port
// from iframe 1
```

这样就体现出来 `MessageChannel` 的价值了，`iframe1` 和 `iframe2` 页面可以直接通过 `postMessage` 方法来互相沟通了，而不需要上层页面作为中间商来传递，虽然 `MessageChannel` 对象仍然是在上层页面中生成

回过来看 `MessageChannel` 对象，生成时候后会带有两个端口对象 `port1` 和 `port2`，这个是写死的，多了也没有。但是有一个比较麻(dan)烦(teng)的是你要将两个 `port` 中的一个传给目标上下文，这时候还是要用当前执行上下文的 `postMessage` 方法

最初我想，我在把 2 个 `port` 发送出去前，都先设置监听函数，那么在发送出去之后，是不是就能监听两个 `port` 直接的消息传递了，那么进一步多个地方监听，不也就变成了一对多甚至多对多通信了么。通过反复试验，发现并没有达到我预期的目标，回过头来再查询文档，发现原因已经在最开头提到了，“这些对象的所有权将被转移给消息的接收方，而发送方将不再保有所有权”，指的就是这些 `port` 对象一旦被通过 `postMessage` 方法发送出去后，原来的监听函数就失效了，那这样看来 `MessageChannel` 是可以保证一对一的传递消息，不必担心消息在中间被拦截

目前我所知道的，`MessageChannel` 应用最广泛的库是 `Vue`，然而并不是用来发送消息，而是用来模拟 `marco task`。。。具体的操作就是，在页面里生成一个 `MessageChannel` 对象，`port1` 用来监听，`port2` 用来发送消息，如果当前环境不支持 `MessageChannel` 的话，就使用 `setTimeout 0` 来替代。目前，我并没有查到这个操作的优势在哪里。总之，这个操作真的是打开了新世界的大门，也就是说 `MessageChannel` 并不一定是两个 `页面` 或者 `Worker` 之间来操作，也可以是在同一页面内各个组件间建立通信

顺带一提，`BroadcastChannel` 和 `MessageChannel` 也是可以在 `Worker` 和 `SharedWorker` 中创建的

再顺带一提，这个 `port1` 和 `port2` 和 `SharedWorker` 的 `port` 是同一种类型，都是 `MessagePort` 对象的实例，`MessagePort` 本身也有 `addEventListener` 方法，但是使用前需要先调用 `start` 方法，而设置 `onmessage` 时候则不需要

再再顺带一提，开发 `Chrome` 扩展的时候，会使用到 `postMessage` 方法

再再再顺带一提，`WebView` 与 `Web` 页面通信时候会用到由源生提供的一个对象的 `postMessage` 方法，不过那是另一个故事了。。。