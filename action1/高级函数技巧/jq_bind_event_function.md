---
title: JS绑定函数时无法传参问题
date: 2019-04-28 11:00:00
tags: 
  - JavaScript
categories: JavaScript
---


> 在上一篇文章中已经讲过了怎么"优秀"的创建一个函数，本来打算在开发中一顿操作，没想到DOM绑定函数时的传参又懵了。

写在开始，关于传参内容写在第三部分，不推荐跳过前半段。
<!--more-->
### 一、初始的栗子
```
<style>
    button{
        border: none;
        outline: none;
        background: lightblue;
        color: #333;
        padding: 20px 40px;
        border-radius: 4px;
        line-height: 100%;
        font-size: 20px;
    }
    .red {
        background: lightcoral;
    }
    .white {
        color: #eee;
    }
</style>

<body>
    <div>
        <button id="btn_show">click变色</button>
        <button id="btn_goodShow">click变色</button>
    </div>
</body>

<script>
    var showBtn = document.getElementById('btn_show');
    var goodShowBtn = document.getElementById('btn_goodShow');

    showBtn.addEventListener('click', function() {
        this.classList.toggle('red')
        this.classList.toggle('white')
    })
</script>
```

在初始的栗子中我们完成了`show`按钮的功能，即点击变色。

接下来

```
    goodShowBtn.addEventListener('click', function() {
        this.classList.toggle('red')
        this.classList.toggle('white')
    })
```
看似已经完成了，没毛病。


### 二、在可行的范围内优化

虽然功能上是实现了，但是能力范围内还是要优化一下
- 函数体内容重复，不能重复使用
- 没有函数名描述函数的作用
- 代码缺乏结构
- 逻辑过多时维护困难

缺点好多，但是其实稍稍的改一下就能搞定大部分问题，上手！
```
    var showBtn = document.getElementById('btn_show');
    var goodShowBtn = document.getElementById('btn_goodShow');

    showBtn.addEventListener('click', toggleClass)
    goodShowBtn.addEventListener('click', toggleClass)

    function toggleClass() {
        this.classList.toggle('red')
        this.classList.toggle('white')
    }
```

其实就是提取了一个函数，不使用匿名函数了而已(匿名函数都不知道就赶紧去看上一篇)。

*其实在这里也推荐大家根据自己的习惯书写类似格式，仔细看可以发现，顶部是DOM提取部分，中部是业务逻辑部分，底部是具体函数，舒服的代码结构或许会让你的开发~~强迫症~~更愉快也说不定。*


### 三、应对传参

问题出在这里，"goodShow"作为比普通内容更棒的`class`,需要一个相对更炫一点点的展示方式，可以选择将`className`作为参数传到我们的`toggleClass`函数中，毕竟本质上，还是切换状态。
```
    // 新添一个类名 goodShow - background: -webkit-linear-gradient(left, rgba(243, 141, 8, 0.863), rgba(255,0,0,1));
    showBtn.addEventListener('click', toggleClass('red'))
    goodShowBtn.addEventListener('click', toggleClass('goodShow'))

    function toggleClass(className) {
        this.classList.toggle(className)
        this.classList.toggle('white')
    }
    // Uncaught TypeError: Cannot read property 'toggle' of undefined
```
竟然报错了，因为`toggleClass()`这种书写方式，会立即执行该函数，并不是我们想要的，匿名函数虽然可以解决这个问题，但是它的弊端仍然存在，不如想个办法操作一波规避这个问题。

- 操作1.0：
```
    var classNameStr;
    showBtn.addEventListener('click', function(ev) {
        classNameStr = 'red';
        toggleClass(ev,classNameStr)
    })

    goodShowBtn.addEventListener('click', function(ev) {
        classNameStr = 'goodShow';
        toggleClass(el,classNameStr)
    })


    function toggleClass(ev,className) {
        ev.target.classList.toggle(className)
        ev.target.classList.toggle('white')
    }
```

诶？虽然实现了，但是这不又变成了之前还被怼的格式了吗？而且注意一下，函数里的`this`关键字不能够用了(this指向全局)，也就是说，虽然解决了问题但是并不是我们想要的。


- 操作 1.5
```
    showBtn.addEventListener('click', toggleClass('red'))
    goodShowBtn.addEventListener('click', toggleClass('goodShow'))

    function toggleClass(className) {
        return function (ev) {
            ev.target.classList.toggle(className)
            ev.target.classList.toggle('white')
        }
    }
```

好的，那就从规范格式下手，既然函数语法规定`函数名()`即立即执行函数体，那我顺水推舟就让他执行，利用闭包搞一个planB。执行的是将参数存入返回函数内部并绑定(赋值)该函数。
也许有点绕，汉译汉就是“搞个备胎安上”。
正像表述的很绕一样，这种实现方法在代码格式上没有问题，但是在可读性上差强人意；同时需要注意，在绑定时就已经在执行函数了(尽管是备胎赋值操作)，可能会引发一些奇怪的误操作，而且`this`关键字依然不能为我所用。


- 操作 2.0
```
    <!-- HTML -->
    <div>
        <button id="btn_show" data-showType='show'>click变色</button>
        <button id="btn_goodShow" data-showType='goodShow'>click更炫的变色</button>
    </div>
```
```
    // js
    showBtn.addEventListener('click', toggleClass)
    goodShowBtn.addEventListener('click', toggleClass)

    function toggleClass() {
        var classType = this.getAttribute("data-show-type");
        var className = classType === 'show' ? 'red' : 'goodShow';
        this.classList.toggle(className)
        this.classList.toggle('white')
    }
```
这次方法利用了HTML5的`data-*`属性，在页面中储存自定义的变量或数据内容，这样就可以规避绑定函数时传参的问题，在代码格式OK的情况下，`this`关键字也有正确指向。
不过呢，这只是规避了问题，而不是解决问题，如果遇到内部数据需要传递的情况怎么办呢，难道在HTML中写一个隐藏框之后绑定吗，那万一数据量略大呢？逃避可耻但有用，不过问题还是要解决的。


- 操作 3.0
```
    var showBtn = document.getElementById('btn_show');
    var goodShowBtn = document.getElementById('btn_goodShow');

    showBtn.addEventListener('click', toggleClass.bind(showBtn, 'red'))
    goodShowBtn.addEventListener('click', toggleClass.bind(goodShowBtn, 'goodShow'))

    function toggleClass(className, ev) {
        console.log(this) // DOM
        console.log(ev) // MouseEvent
        this.classList.toggle(className)
        this.classList.toggle('white')
    }
```

使用了`bind`关键字用来绑定改变`this`指向的同时，利用偏函数预设参数。（关于`bind`*补1*）
- 虽然`bind`在绑定时看似传递了两个参数(不限格式和个数)，但是了解`bind`方法可以知道，第一个参数是指向对象，第二个参数开始，才是真正的预设参数。
- 预设参数，也就是在函数执行前预先设置占位参数，可以同理对比ES6中的默认参数，`toggleClass`方法接收了两个参数，但绑定函数时只传递了一个`className`，另一个是JS事件执行时都会默认接收的`event`参数，在预设参数接收完成后，仍然有变量来接收`event`。
- 如果在`bind`时传递了两个预设参数，那么`ev`将变成第二个预设参数，`event`由于排在第三位，没有被接收到。
- 所以`toggleClass`方法中在接收预设参数完毕后，仍有空余变量接收事件默认的`event`，MouseEvent因此而来。

`bind`不仅解决了格式问题，`this`指向问题，更重要的是在代码的扩展和可读性上有了更棒的体验。


PS：
1. 以上并没有哪种方式一定是最棒的，要依据具体的业务场景来具体选择；
2. jQ事件绑定 / 事件委托 同样适用；
3. 仍然推荐后两种操作方式；


*补1：*
关于`bind`的学习，[关于bind具体内容](https://segmentfault.com/a/1190000018804457)

引用：
1. https://ultimatecourses.com/blog/avoiding-anonymous-javascript-functions

