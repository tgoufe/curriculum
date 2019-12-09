# 虚拟DOM之挂载

## 用 VNode 描述真实 DOM

虚拟DOM简而言之就是，用JS去按照DOM结构来实现的树形结构对象，一般称之为虚拟节点(VNode)

一个 html 标签有它的名字、属性、事件、样式、子节点等诸多信息，这些内容都需要在 VNode 中体现，我们可以用如下对象来描述一个红色背景的正方形 div 元素：

```javascript
const VNode = {
  tag: 'div',
  data: {
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: 'red'
    }
  }
}
```

这个例子中，使用tag表示标签的名字，data用来存储附加信息

我们再考虑存在子节点的情况，使用children表示div元素的子节点：

```javascript
const VNode = {
  tag: 'div',
  data: style: {
    width: '100px',
    height: '100px',
    backgroundColor: 'red'
  },
  children: {
    tag: 'span',
    data: null
  }
}
```

当然，元素的子节点可能会有多个，那么我们将children变为数组来接收子节点：

```javascript
const VNode = {
  tag: 'div',
  data: style: {
    width: '100px',
    height: '100px',
    backgroundColor: 'red'
  },
  children: [
    {
      tag: 'h1',
      data: null
    },
    {
      tag: 'p',
      data: null
    }
  ]
}
```

除了html标签之外，再考虑文本节点：

```javascript
const VNode = {
  tag: null,
  data: null,
  children: '文本内容'
}
```

现在我们知道如何用VNode来描述DOM结构了，但是如果开发中需要手写VNode，那绝对是反人类的，所以接下来，我们来介绍h函数。

## h函数

h函数作为创建VNode对象的函数封装，React中通过babel将JSX转换为h函数的形式，Vue中通过vue-loader将模板转换为h函数。

```javascript
function h(tag = null,data = null,children = null){
    // ...
}
```

假如在Vue中我们有如下模板：

```html
<template>
  <div>
    <h1></h1>
  </div>
</template>
```

用 h 函数来创建与之相符的 VNode：

```javascript
const VNode = h('div', null, h('span'))
```

得到的 VNode 对象如下：

```javascript
const VNode = {
  tag: 'div',
  data: null,
  children: {
    tag: 'span',
    data: null,
    children: null
  }
}
```

假如在Vue中我们有如下模板：

```html
<template>
  <div>我是文本</div>
</template>
```

用 h 函数来创建与之相符的 VNode：

```javascript
const VNode = h('div', null, '我是文本')
```

```javascript
const VNode = {
  tag: 'div',
  data: null,
  children: {
    tag: 'span',
    data: null,
    children: null
  }
}
```

得到的 VNode 对象如下：

```javascript
const VNode = {
  tag: 'div',
  data: null,
  children: {
    data: null,
    children: '我是文本'
  }
}
```

实现 h 函数:

```javascript
//创建一个纯文本的VNode
function createTextVNode(text) {
    return {
        tag: null,
        data: null,
        // 纯文本类型的 VNode，其 children 属性存储的是与之相符的文本内容
        children: text
    }
}

function h(tag = null, data = null, children = null) {
    if(Array.isArray(children) && children.length === 1){
        children = children[0];
    }else if(!Array.isArray(children)){
        children = createTextVNode(children + '')
    }
    return {
        tag,
        data,
        children
    }
}
```

## 挂载

所谓挂载就是将VNode转换为真实DOM的过程，通常称之为render。

render函数分为两部分：

1. mount（初始渲染）
2. patch（更新节点）

```javascript
function(vNode,container){
    //初始化渲染
    mount(vNode,container);
    //更新
    //patch(vNode,container)
}
```

```javascript
function mount(VNode, container) {
    // 挂载普通标签
    if (VNode.tag) {
        mountElement(VNode, container)
    }
    //挂载纯文本
    else if (!VNode.tag && typeof VNode === 'string') {
        mountText(VNode, container)
    }
}
```

今天主要来理解mount部分

我们封装mountElement函数用于挂载标签，mountText函数用于挂载文本节点。

先看mountText函数：

```javascript
function mountText(vNode, container) {
    const el = createTextNode(vNode.children); // document.createTextNode(vNode.children);
    appendChild(container, el); // container.appendChild(el)
}
```

再看mountElement函数：

```javascript
function mountElement(VNode, container) {
    let {
        tag,
        data,
        children
    } = VNode;
    const el = createElement(tag); // document.createElement(tag)
    //处理DOM属性
    for (let key in data) {
        data.hasOwnProperty(key) && patchData(el,key,null,data[key]);
    }
    //处理子节点
    //多子节点
    if (children && Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            mount(children[i], el)
        }
    }
    //单节点
    else if(children){
        mount(children, el)
    }
    appendChild(container, el); // container.appendChild(el)
}

//用于处理dom节点的属性，比如style class 事件等...
function patchData(){
  //...
}
```
