---
title: Web Components 介绍（一）
date: 2019-09-03 13:05:25
tags:
  - 组件化
  - 框架
  - JavaScript
  - WebComponents
---

`Web Components` 是一套允许你创建自定义组件的技术

<!--more-->

`Vue` 和 `React`(`Angular` 不了解) 都借鉴了一些 `Web Components` 的设计思想，而后又用实践反馈来影响 `Web Components` 标准的制定，`Web Components` 虽然标准的制定还在进行中，但是看来大体已经稳定，当然不排除未来还会有改动。

`Web Componets` 大体分为四个部分：

* `Shadow DOM`
* `HTML templates`(`HTML` 模板)
* `Custom elements`(自定义元素)
* `HTML Imports`(`HTML` 导入)

无论如何，前端的核心是 `DOM` 操作，所以今天先介绍一下 `Shadow DOM`

那么 `Shadow DOM` 是如何创建的呢？`MDN` 上：

> `Element.attachShadow()` 方法给指定元素挂载一个 `Shadow DOM`，并且返回它的 `ShadowRoot`

该方法只有一个参数是一个对象类型，目前只有一个 `key` 值 `mode`，可以设置为 `open` 或者 `closed` 用来指定封装模式的开放或者关闭

参数设计成对象类型，想必是考虑到以后扩展变动的需要

但是实际测试时并不是所有对象都支持这个方法，虽然每个 `DOM` 对象都有这个方法，但是并不是所有 `DOM` 对象都可以使用的，当然我也没有测试所有的标签，我粗略的测试了一下可用的标签有 `div`、`h1`、`span`，而不可用则有 `ul`、`ol`、`dl`、`a`、`form`、`label`、`input`、`button`，这些标签调用此方法的时候会报错，提示：

> Uncaught DOMException: Failed to execute 'attachShadow' on 'Element': This element does not support attachShadow
      at <anonymous>:1:3

由以上测试我有一个推测，可以使用该方法的主要是一些用来展示内容的标签，而那些有明确功能性的标签则是不能使用，而类似 `ul`、`ol`、`dl` 等虽然也是用来展示内容但是对子标签有结构要求的标签也是不可以使用的

当参数没传、类型错误、对象类型没有 `mode` 属性或 `mode` 属性值不为 `open` 或 `closed` 时都会报错

当该方法已被调用过再次调用也会报错

另外 `MDN` 上还有一个 `Element.createShadowRoot()` 方法，但是已经被标记为不推荐使用，而且并没有参会选项

该方法返回的 `shadowRoot` 对象的 `constructor.name` 为 `ShadowRoot`，但是不能直接使用 `new ShadowRoot()`，查看原型链 `ShadowRoot` 类继承自 `DocumentFragment`，这也许能解释清楚很多事情（`DocumentFragment` 也是个有趣的东西）

接下来做一个小的 `demo`：

```html
<style>
.red{
    color: red;
}
</style>
<div id="component1">
    <div>233</div>
</div>
<div class="red">test test test</div>
<script>
let testComponent = document.getElementById('component1')
    ;

(function(){
    let root = testComponent.attachShadow({mode: 'open'})
        , list
        , input
        , btn
        ;

    function init() {
        root.innerHTML = `
<h1 class="red">A List</h1>
<input type="text" id="name">
<button type="button" id="add">添加</button>
<ul id="list"></ul>`;

        list = root.querySelector('#list');
        input = root.querySelector('#name');
        btn = root.querySelector('#add');
        btn.addEventListener('click', function(){
            if( input.value ){
                console.log( input.value );

                addTask( input.value );

                input.value = '';
            }
        });
    }

    function addTask(desc) {
        let task = document.createElement('li')
            ;

        task.textContent = desc;
        list.appendChild( task ); 

        return list.children.length -1;
    }

    function removeTask(index) {
        let task = list.children[index]
            ;

        if( task ){
            task.remove();
        }
    }
    
    window.testComponent = testComponent;
    window.init = init;
    window.addTask = addTask;
    window.removeTask = removeTask;
})();

init();
addTask('task1');
</script>
```

运行此 `demo`，可以在控制台看到 `#component1` 对象下出现了一个额外的节点 `#shadow-root (open)`，点开此节点则可以看到在 `demo` 中 `init` 函数中创建的 `HTML` 标签代码

另外可以看到代码中在 `#component1` 下还有一个 `div` 标签，但是并没有在页面中显示出来，这样可能有些类似 `noscript` 标签的效果，当不支持该功能时才显示出来，这样可以达到优雅降级的效果

但是我尝试将所有操作放到一个 `setTimeout` 里时发现，似乎是我想多了，在代码未执行前，仍然是按照常规的方式进行渲染，当代码执行后子标签才会隐藏，这样看来只能做加载效果了

在调用了 `attachShadow` 方法后对 `#component1` 对象的 `innerHTML` 进行操作都不会影响到 `shadowRoot`，但是其它正常标签还是会影响到 

当 `mode` 设置为 `open` 时，输出 `testComponent.shadowRoot`，可以输出已经创建的 `shadowRoot` 对象，此时仍然可以使用该对象对内部进行操作，但是当设置为 `closed` 时，输出则为 `null`，也就是说当 `mode` 为 `closed` 时，`shadowRoot` 对象只能由 `attachShadow` 方法返回来，一旦变量不在指向该对象后，则没有其它方法获取到该 `shadowRoot` 对象了

很有趣的，`shadowRoot` 对象仅支持 `getElementById`、`querySelector` 和 `querySelectorAll` 等方法，但是不支持 `getElementsByClassName`、`getElementsByTagName` 和 `getElementsByName` 等方法，应该是不支持使用 `HTMLCollection` 对象，考虑到它是动态的似乎也可以理解

接下来，再做个小实验，在全局监测一下 `DOM` 改变：
```javascript
let mo = new MutationObserver(function(){
        console.log(arguments)
    })
    ;

mo.observe(testComponent, {
    childList: true
    , subtree: true
});
```

在执行添加操作的时候可以看到控制台里毫无反应，这体现 `Shadow DOM` 一个特点：隔离 `DOM`，组件的 `DOM` 是独立的

另外经过测试，在 `shadowRoot` 对象里的节点仍然可以使用 `attachShadow` 方法，这样就可以实现组件套组件的操作了

另外注意一下 `style`，可以看到 `shadowRoot` 中的标签无法调用到全局的样式，但是当对 `#component1` 添加 `class="red"` 后 `shadowRoot` 内标签的文字都变为了红色，即这些标签都会继承容器的样式

参考文章：
[如何禁止开发者操作网页上的DOM对象？](https://github.com/akira-cn/FE_You_dont_know/issues/20)
[JavaScript 是如何工作: Shadow DOM 的内部结构+如何编写独立的组件！](https://segmentfault.com/a/1190000018033709)