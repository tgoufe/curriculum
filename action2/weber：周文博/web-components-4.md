---
title: Web Components 介绍（四）
date: 2019-11-06 10:26:25
tags:
  - 组件化
  - 框架
  - JavaScript
  - WebComponents
---

挺眼熟的东西。。。

<!--more-->

# Web Components 介绍（四）

## Templates 模块

`<template>` 标签，大家一定很眼熟，早在 `jQuery` 时代大家就以各种方式使用进行开发了，不过 `<template>` 标签那时还不是标准规范里的标签，直到 `HTML5` 规范的确立，现在又被应用到 `Web Components` 技术中

> HTML内容模板（<template>）元素是一种用于保存客户端内容机制，该内容在加载页面时不会呈现，但随后可以(原文为 may be)在运行时使用JavaScript实例化。

以上是 `MDN` 上的描述，很符合对这个标签的直观印象

`<template>` 标签对应的是 `HTMLTemplate` 对象，它除了标准属性外有一个额外的属性 `content`，这个属性是只读的，它是一个 `DocumentFragment` 类型的对象，包含了 `<template>` 标签下的 `DOM` 书。在浏览器中查看 `<template>` 标签，也可以看到一层 `#document-fragment`，然后才是 `HTML` 代码中 `<template>` 下的子标签

具体使用示例：
```html
<template id="testTemplate">
    <p>测试</p>
</template>

<div id="app"></div>

<script>
let app = document.getElementById('app')
    ;

app.appendChild( document.getElementById('testTemplate').content.cloneNode(true) );
</script>
```

示例代码中要注意到 `cloneNode` 方法，因为不对 `content` 进行克隆的话，再次使用 `content` 属性时将只有一个空的 `DocumentFragment` 对象了

顺带一提，`<template>` 标签中可以加入 `<style>`、`<link>` 和 `<script>` 标签的，而且 `<link>` 和 `<script>` 标签引用的外部文件只有在加入文档中才进行加载，对比一下 `Vue` 框架中 `<template>` 中则不能添加 `<style>` 标签（当然这个比较并不合适。。。）

`HTMLTemplate` 对象的 `children` 是一个空的 `HTMLCollection` 对象，但是输出 `innerHTML`，还是能获得在 `HTML` 代码中的子标签

修改 `innerHTML` 后，对应的 `#document-fragment` 中的内容也会变更，但是使用 `appendChild` 方法后，`#document-fragment` 中的内容却不会改变，再输出 `innerHTML` 时也不会输出 `appendChild` 方法添加的元素，但是 `children` 元素会显示它们

## slot 元素

这个用过 `Vue` 的应该很熟悉了

> HTML <slot> 元素 ，作为 Web Components 技术套件的一部分，是 Web 组件内的一个占位符。该占位符可以在后期使用自己的标记语言填充，这样您就可以创建单独的 DOM 树，并将它与其它的组件组合在一起。

以上是 `MDN` 的描述

`slot` 元素的存在是因为，`template` 模板有一些缺点，主要是静态内容，不允许渲染变量、数据，`slot` 可以让我们按照一般使用的标准 `HTML` 模板的习惯来编写代码。`slot` 是组件内部的占位符，用户可以使用自己的标签来填充

具体的使用则需要前几讲的知识了：`Shadow DOM` 和自定义元素，然而这其中的过程完全是黑盒的，并不能由我们来控制

示例代码：

```html
<template id="customTemplate">
    <div>
        <h2>我的自定义组件</h2>
        <hr>
        <slot name="slot-content">
        </slot>
    </div>
</template>

<my-component>
    <p slot="slot-content">测试内容</p>
</my-component>

<my-component>
    <ul slot="slot-content">
        <li>测试列表</li>
    </ul>
</my-component>  

<script>
class MyComponent extends HTMLElement{
    constructor(){
        super();
        
        let template = document.getElementById('customTemplate')
            , content = template.content
            ;
        
        this._shadowRoot = this.attachShadow({
            mode: 'open'
        });

        this._shadowRoot.appendChild( content.cloneNode(true) );
    }
}

customElements.define('my-component', MyComponent);
</script>
```

注意 `slot` 标签的 `name` 属性和一些标签上的 `slot` 属性，是一个对应关系，了解 `Vue` 的话应该就很熟悉了

`<slot>` 标签对应的是 `HTMLSlotElement` 对象，有 3 点值得注意：
* `name` 属性，示例中用到了，也没什么特别值得讲的
* `assignedNodes()` 方法，它返回替换当前 `slot` 元素的 `DOM` 对象
* 拥有一个独立的事件 `slotchange`

示例：
```javascript
this._shadowRoot.querySelector('slot').addEventListener('slotchange', function(e){
    let nodes = e.target.assignedNodes()
        ;
    
    console.log(`<slot name="${this.name}></slot> 替换为, ${nodes[0].outerHTML}`);
});
```

`Vue` 框架中则没有提供类似 `slotchange` 的事件，我想这是因为 `Web Components` 仍然是一个以 `HTML` 为核心的技术框架，而 `Vue` 则是以 `JavaScript` 为核心由数据对应 `HTML` 标签进行映射，通过改变数据来达到改变 `HTML` 的目的，由此能看出它们的设计思想上的一些区别 