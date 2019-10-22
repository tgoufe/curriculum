---
title: Web Components 介绍（三）
date: 2019-10-17 11:23:25
tags:
  - 组件化
  - 框架
  - JavaScript
  - WebComponents
---

这次研究点新东西

<!--more-->

# Web Components 介绍（三）

## 自定义元素

上一篇讲了 `Shadow DOM`，其中提到支持创建 `Shadow DOM` 的 `HTML` 只有 18 个，但是它们都是标准中常规标签，本身的语义比较抽象，而且都说了组件化，你不可能每个组件都使用 `div` 或者 `section` 这样太常见的东西来描述，那么必然想到要自定义元素

`HTML` 因为要向下兼容，并没有对页面里的标签特别严格要求。也就是说你在页面里随便写些非标准的标签，浏览器也能解析，它们是 `HTMLUnknownElement` 类型的，虽然继承自 `HTMLElement`，但是没有任何可用的附加属性或方法。当然更早期的浏览器，可能不会这样，所以要使用 `document.createElement` 方法创建一下，让老旧的不支持自定义标签的浏览器激活对某种自定义标签的支持

现在，在 `Web Components` 中，提供了 `customElements.define` 方法来创建自定义元素，参数如下：

|  名称  |  可选  |  描述  |
|:-----:|:-----:|:-----|
|  name  |    |  自定义元素名  |
|  constructor  |    |  自定义元素构造器  |
|  options  |  可选  |  控制元素如何定义  |

其中，`name` 必须用小写字母开头，并且至少有一个连字符，`options` 目前只有一个选项支持：`extends`，指定继承的已创建的元素，被用于创建自定义元素

重头戏就是 `constructor` 了，目前可以创建两种类型的自定义元素：

+ 自主定制元素：独立元素；它们不会从内置 `HTML` 元素继承，该构造器要继承 `HTMLElement` 对象，可以直接把它们写成 `HTML` 标签的形式，在页面上使用，如 `<tg-header></tg-header>`，或者是 `document.createElement('tg-header')`，如：
```html
<tg-header></tg-header>
<script>
class TgHeader extends HTMLElement{
	constructor(){
		super();
	}
	connectedCallback(){
		console.log('connected', this);
		this.innerHTML = this.template;
	}
	disconnectedCallback(){
		console.log('disconnected');
	}
    adoptedCallback(){
        console.log('adopted');
    }

	get template(){
		return `<div>header</div>`;
	}
}

customElements.define('tg-header', TgHeader);
```
+ 自定义内置元素：这些元素继承自并扩展内置 `HTML` 元素，该构造器要继承自一个现有的元素对象的构造器（如：`HTMLParagraphElement `、`HTMLUListElement` 等等），在创建时，你必须指定所需扩展的元素，使用时需要先写出基本的元素标签，并通过 `is` 属性指定自定义元素的名称如 `<p is="tg-context"></p>`，如：
```html
<p is="tg-content">test test</p>
<script>
class TgContent extends HTMLParagraphElement{
    constructor(){
        super();
    }
	connectedCallback(){
		this.innerHTML += '[tg]';
	}
}
</script>
```

然后，可以注意看代码，仅仅只有构造器还是不行的，`Web Components` 为自定义元素提供了生命周期回调，是一些在自定义元素的类定义中的特殊回调函数，将会影响其行为：

+ `connectedCallback`，当自定义元素被连接到文档 `DOM` 时被调用 
+ `disconnectedCallback`，当自定义定义元素与文档 `DOM` 断开连接时被调用
+ `adoptedCallback`，当自定义元素被移动到新文档时被调用
+ `attributeChangedCallback`，当自定义元素的一个属性被增加、移除或更改时被调用

一种常见错误是将 `connectedCallback` 用做一次性的初始化事件，然而实际上你每次将节点连接到 `DOM` 时都会被调用。取而代之的，在 `constructor` 这个 `API` 接口调用时做一次性初始化工作会更加合适

`disconnectedCallback` 和 `adoptedCallback` 方法整体上的价值可能不太大，可以用于记录操作

每当元素的属性变化时，`attributeChangedCallback` 回调函数会执行，作为参数会依次传入属性名、变更前的值和变更后的值。需要注意的是，你必须声明你需要监听的属性，才能使 `attributeChangedCallback` 的函数被触发，而声明监听哪些属性，你就要定义一个名为 `observedAttributes` 的静态 `getter` 函数，返回值为一个字符串数组， 如：

```javascript
class TgMain extends HTMLElement{
	constructor(){
		super();

		this.className = this.getAttribute('theme');
	}

	connectedCallback(){
		console.log('tg-main connected');
	}

	attributeChangedCallback(name, oldVal, newVal){
		console.log(`${name} 从 ${oldVal} 变为 ${newVal}`);

		if( name === 'theme' ){
			this.className = newVal;
		}
	}

	static get observedAttributes(){
		return ['theme', 'code'];
	}
}
```