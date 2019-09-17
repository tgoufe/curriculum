---
title: JavaScript 事件委托
date: 2019-05-30 11:00:00
tags: JavaScript
categories: 开发技巧
password: tgfe
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---
JavaScript 事件委托
<!--more-->

事件委托，通俗地来讲，就是把一个元素响应事件（click、keydown......）的函数委托到另一个元素;

一般来讲，会把一个或者一组元素的事件委托到它的父层或者更外层元素上，真正绑定事件的是外层元素，当事件响应到需要绑定的元素上时，会通过事件冒泡机制从而触发它的外层元素的绑定事件上，然后在外层元素上去执行函数。

举个例子，比如一天中午大家去楼下买饭，一种方法就是他们都傻傻地一个个去买,
另一种方法就是王总不想去，就让振哥帮忙带一下，然后小宇表示让振哥带一下个，最后大家都没去，就振哥
自己去买饭了，然后回来再根据每个人的名字一一分发给大家

在这里，买饭就是一个事件，每个人指的是需要响应事件的 DOM 元素，而出去统一去买饭的振哥就是代理的元素，所以真正绑定事件的是这个元素，按照收件人分发快递的过程就是在事件执行中，需要判断当前响应的事件应该匹配到被代理元素中的哪一个或者哪几个。


事件冒泡
前面提到 DOM 中事件委托的实现是利用事件冒泡的机制，那么事件冒泡是什么呢？
````html
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>aaa</title>
</head>
<body>
	<div id="dom1" style="width: 400px;height: 400px;background: blue">
		dom1
		<div id="dom2" style="width: 200px;height: 200px;background: red">
			dom2
		</div>
	</div>
    <script>
    	var dom1 = document.getElementById('dom1');
    	dom1.onclick =function (){
    		console.log('dom1');
    	}
    	// dom1.addEventListener('click',function(){
    	// 	console.log('dom1');	
    	// },true);

    	var dom2 = document.getElementById('dom2');
    	dom2.onclick =function (){
    		console.log('dom2');
    	}
    	// dom2.addEventListener('click',function(){
    	// 	console.log('dom2');	
    	// },true);
    </script>
</body>
</html>
````

在 document.addEventListener  的时候我们可以设置事件模型：事件冒泡、事件捕获，一般来说都是用事件冒泡的模型；


![事件冒牌](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1559203814792.png)

上图所示，事件模型是指分为三个阶段：

捕获阶段：在事件冒泡的模型中，捕获阶段不会响应任何事件；
目标阶段：目标阶段就是指事件响应到触发事件的最底层元素上；
冒泡阶段：冒泡阶段就是事件的触发响应会从最底层目标一层层地向外到最外层（根节点），事件代理即是利用事件冒泡的机制把里层所需要响应的事件绑定到外层；

委托的优点

1. 减少内存消耗

试想一下，若果我们有一个列表，列表之中有大量的列表项，我们需要在点击列表项的时候响应一个事件；

````html
<ul id="list">
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
  <li>item n</li>
</ul>
````
如果给每个列表项一一都绑定一个函数，那对于内存消耗是非常大的，效率上需要消耗很多性能；

因此，比较好的方法就是把这个点击事件绑定到他的父层，也就是 `ul` 上，然后在执行事件的时候再去匹配判断目标元素；

所以事件委托可以减少大量的内存消耗，节约效率。

````javascript
document.getElementById('list').addEventListener('click', function (e) {
		  // 兼容性处理
		  var event = e || window.event;
		  var target = event.target || event.srcElement;
		  // 判断是否匹配目标元素
		  if (target.nodeName.toLocaleLowerCase() === 'li') {
		    console.log('the content is: ', target.innerHTML);
		  }
});
````

在上述代码中， target 元素则是在 #list 元素之下具体被点击的元素，然后通过判断 target 的一些属性（比如：nodeName，id 等等）可以更精确地匹配到某一类 #list li 元素之上；


比如 focus、blur 之类的事件本身没有事件冒泡机制，所以无法委托；
mousemove、mouseout这样的事件，虽然有事件冒泡，但是只能不断通过位置去计算定位，对性能消耗高，因此也是不适合于事件委托的；

jQuery 中的事件委托
jQuery 中的事件委托相信很多人都用过，它主要这几种方法来实现：
$.on: 基本用法: $('.parent').on('click', 'a', function () { console.log('click event on tag a'); })，它是 .parent 元素之下的 a 元素的事件代理到 $('.parent') 之上，只要在这个元素上有点击事件，就会自动寻找到 .parent 元素下的 a 元素，然后响应事件；
$.delegate: 基本用法: $('.parent').delegate('a', 'click', function () { console.log('click event on tag a'); })，同上，并且还有相对应的 $.delegate 来删除代理的事件；
$.live: 基本使用方法: $('a', $('.parent')).live('click', function () { console.log('click event on tag a'); })，同上，然而如果没有传入父层元素 $(.parent)，那事件会默认委托到 $(document) 上；(已废除)


错误案例
````html
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>闭包</title>
</head>
<body>
    <ul id="list">
	  <li>item 1</li>
	  <li>item 2</li>
	  <li>item 3</li>
	  <li>item n</li>
	</ul>
    <script>
        var lis = document.querySelectorAll("li");
        for(var i = 0,len = lis.length;i < len;i++){
            lis[i].onclick = function(){
                console.log(i+1);
            }
        }
    </script>
</body>
</html>
````

````javascript
for(var i = 0,len = lis.length;i < len;i++){
    lis[i].onclick = (function(tmpI){
       return function(){
            console.log(tmpI+1);
       } 
    })(i);
}
````
