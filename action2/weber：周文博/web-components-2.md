---
title: Web Components 介绍（二）
date: 2019-09-25 13:22:25
tags:
  - 组件化
  - 框架
  - JavaScript
  - WebComponents
---

书接上回，继续说 `Web Components`

<!--more-->

# Web Components 介绍（二）

## 补充一下

上回说哪些对象可以使用 `Shadow DOM`，我有一个推论，这个是很不严谨的，我因为懒而没有更详细的考证一下。其实，`W3C` 是有一个规范明确规定了哪些元素可以使用 `Shadow DOM`：

> The attachShadow(init) method, when invoked, must run these steps:
> 1. If context object’s namespace is not the HTML namespace, then throw a "NotSupportedError" DOMException.
> 2. If context object’s local name is not a valid custom element name, "article", "aside", "blockquote", "body", "div", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "main" "nav", "p", "section", or "span", then throw a "NotSupportedError" DOMException.
> 3. If context object’s local name is a valid custom element name, or context object’s is value is not null, then:
>   1. Let definition be the result of looking up a custom element definition given context object’s node document, its namespace, its local name, and its is value.
>   2. If definition is not null and definition’s disable shadow is true, then throw a "NotSupportedError" DOMException.
> 4. If context object is a shadow host, then throw an "NotSupportedError" DOMException.
> 5. Let shadow be a new shadow root whose node document is context object’s node document, host is context object, and mode is init’s mode.
> 6. Set shadow’s delegates focus to init’s delegatesFocus.
> 7. Set context object’s shadow root to shadow.
> 8. Return shadow.  

参考[链接](https://dom.spec.whatwg.org/#dom-element-attachshadow)

具体就是第二条，也就是说可以直接使用 `attachShadow()` 方法的元素目前是固定的这 18 个，不过看一下，大致上也是符合我的推测的

另一个就是，也许有的浏览器并不是默认显示 `Shadow DOM` 的，需要在 'Settings -> Preferences -> Elements' 中把 'Show user agent shadow DOM' 打上勾才能看。由于我很早很早就勾选了，导致已经遗忘这件事了，另外也不确定现在的 `Chrome` 浏览器里是否已经默认勾选了

开启了以后，去浏览一些网页，一定会注意到有些元素已经有 `#shadow-root` 节点了，最常见的就是 `input`、`video` 和 `audio` 元素，也就是说 `Chorome` 等浏览器已经开始使用 `Web Components` 我们之前知道 `attachShadow` 方法一旦执行之后，就无法再次执行了，那么规范里面没有它们也就不奇怪了

另外一个比较有意思的事，你可以找一些带 `placeholder` 属性的 `input` 标签，打开 `#shadow-root` 节点向下找，会找到一个 `id` 为 `placeholder` 的 `div` 标签，它上面有个 `pseudo` 属性，值为 `-webkit-input-placeholder`，再想一下 `CSS` 中如何设置 `placeholder` 的样式，是 `Chrome` 提供了 `::-webkit-input-placeholder` 的伪对象，有前缀说明还没有进入标准。。。嗯，这里一定有些 PY 交易。。。未来我们也许可以使用这种方式来定义伪对象了。顺带一提 `pseudo` 翻译过来是虚假的、虚伪的的意思

上回最后还提到了样式的问题，但是更有趣的事情是你可以使用 `link` 标签引入外部样式文件

顺着这个思路我也尝试看看是否可以加入 `script` 标签，发现并不行，但是标签是在 `#shadow-root` 里面，但是代码并没有执行，网络面板里也并没有显示 `js` 文件的的加载，这可能是因为页面加载完成后，在向文档中添加 `&lt;script&gt;` 标签也不会执行的原因

```javascript
let testComponent = document.getElementById('component1')
    , root = testComponent.attachShadow({mode: 'open'})
    ;

root.innerHTML = `
    <link rel="stylesheet" href="./test.css">
    <h1 class="red">A List</h1>
    <input type="text" id="name">
    <button type="button" id="add">添加</button>
    <ul id="list"></ul>
    <script src="./test.js" defer async><\/script>
`;
```

那么，异步加载呢。。。答案是可以，但是执行环境则与其它异步加载的脚本没有不同，唯一的区别也就是生成的 `script` 对象被添加到的地方不同，其它的被添加到 `head` 或 `body` 里，而这个则是被添加到 `shadowRoot` 里，代码示例：

```javascript
let script = document.createElement('script')
    ;

script.src = './test2.js';

root.appendChild(script);

// test2.js 代码

'use strict';

(function(){
	let ul = document.getElementById('list')
		, i = 0
		, temp
		;

	for(; i < 6; i++ ){
		temp = document.createElement('li');
		temp.innerHTML = i;

		ul && ul.appendChild( temp );
	}
})();
```

上面的代码正常执行了，但是因为执行环境是全局，而这样是无法找到 `id` 为 `list` 的对象，因为它在 `Shadow DOM` 中，所以创建的那些 `li` 对象并没有被加入到页面中。也就是说目前想要访问到 `Shadow DOM` 内部的方法只有使用 `shadowRoot`，前提是使用 `open` 模式创建，所以修改 `test2.js` 代码如下：

```javascript
'use strict';

(function(){
	let testComponent = document.getElementById('component1')
        , shadowRoot = testComponent.shadowRoot
        , ul = shadowRoot.getElementById('list')
        , i = 0
        , temp
        ;

    for(; i < 6; i++ ){
        temp = document.createElement('li');
        temp.innerHTML = i;

        ul && ul.appendChild( temp );
    }
})();
```

`Shadow DOM` 并没有像 `Worker` 一样创造一个全新的上下文，不过仔细想一下，`Worker` 的上下文都是不支持 `DOM` 操作的。。。

## 一些其它

`shadowRoot` 对象，有 2 个特有的属性：

+ `mode` 是创建时传入的，为 `'open'` 或 `'closed'`
+ `host` 指向创建时的宿主 `DOM` 元素

顺带提一下，`shadowRoot` 的 `nodeType` 是 `11`，和 `DocumentFragment` 是一样的

`Shadow DOM` 的规范中定义了一个名为 `DocumentOrShadowRoot` 的 `mixin`，定义了可在文档和 `shadowRoot` 对象中使用的功能，不过这个是浏览器的内部实现，并不能直接查看，所以就不过多介绍了，具体可以查看 `W3C` 的规范

随着 `Web Components` 和 `Shadow DOM` 一起加入标准的，还有一些已有对象的扩展：

`Element` 对象添加了 `attachShadow()` 方法和 `shadowRoot` 属性，这个之前说过了

`Node` 对象添加了 `getRootNode()` 方法和 `isConnected` 属性  

+ `getRootNode()` 方法返回上下文对象的根节点。有可选参数，是对象类型，只有 `composed` 一个 `key`，值是 `Boolean` 类型，当 `composed` 为 `false` 时有 `shadowRoot` 会优先返回，否则都是返回 `document`，如：

```javascript 
let input = root.querySelector('#name')
    ;

console.log( input.getRootNode() ); // #shadow-root (open)
console.log( input.getRootNode({composed: true}) ); // #document 
console.log( input.getRootNode({composed: false}) ); // #shadow-root (open)

console.log( testComponent.getRootNode() ); // #document 
console.log( testComponent.getRootNode({composed: true}) ); // #document 
console.log( testComponent.getRootNode({composed: false}) ); // #document 
```

这样以后开发公共方法的时候，可以通过这个方法来获取当前 `DOM` 对象的根节点，而不能直接使用 `document` 了

+ `isConnected` 属性返回一个布尔值表示节点是否连接（直接或间接）到上下文对象。例如，在普通 `DOM` 的情况下为 `Document` 对象，或者在 `Shadow DOM` 的情况下为 `shadowRoot`。这个值得一提的是，一般一个新创建的元素被添加到 `DocumentFragment` 中，它的 `isConnected` 是为 `false`，而 `shadowRoot` 继承自 `DocumentFragment`，所以这是一个特殊处理

`Event` 对象添加了 `composed` 属性，和 `composedPath()` 方法

+ `composed` 是一个 `Boolean` 值，用来指示该事件是否可以从 `Shadow DOM` 传递到一般的 `DOM`

+ `composedPath()` 方法可以查看事件从 `Shadow DOM` 传播到普通 `DOM` 的路径

当然前提是 `shadowRoot` 的 `mode` 为 `open`。。。