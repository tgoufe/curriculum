---
title: JS设计模式之单例模式
date: 2019-08-07 18:00:00
tags: JavaScript
categories: 设计模式
---
单例模式
<!--more-->
# JS设计模式之单例模式
## 设计模式前言
### 起源
首先要说明的是设计模式期初并非软件工程中的概念，而是起源于建筑领域。建筑学大师（克里斯托夫·亚历山大）曾经花了很长时间（传闻说20年）研究为了解决同一问题而采用的不同的建筑结构，在这些结构当中有很多优秀的设计，而在这些设计当中又有很多相似性，因此他用“模式”来描述这种相似性。并写了一本书《模式语言》。对整个建筑领域产生了很深远的影响。

![克里斯托弗·亚历山大《城市并非树形》笔记配图](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/2222.png)

![艾瑞克·伽玛](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/146579944402989595.JPEG)
而在编程领域，类似的情况会更加的多。微软杰出工程师（艾瑞克·伽玛）受到克里斯托夫·亚历山大和他的《模式语言》的启发，把这种模式的概念移植到了软件开发中，并且针对C++提出了23种设计模式，写成了《设计模式：可复用面向对象软件的基础》一书。

### 定义
原文定义：在面向对象的程序设计中，针对特定问题的简洁和优雅解决方案。
>解释：给解决方案取个好听的名字
### 作用
* 一定会增加代码量
* 一定会增加复杂度
* 有可能提升可维护性
* 有可能降低沟通成本
### JS中的设计模式
并不是所有的设计模式都适用于任何开发语言，每种语言因为本身的设计初衷就不相同，有些设计模式在C语言里非常适用，但是在JS里有更简单的解决方案，在这种情况下就没有必要一定按照设计模式中的描述通过强制模拟的方式来实现。比如我们常说JS中函数是一等公民，可以当做对象来使用，也可以当做参数来传递，还可以当成类来使用，而这些特性在很多静态类型语言中需要用特定的方式来实现，因此在JS中很多模式是解释器本身就实现的，不需要做额外的工作。
### 如何理解和使用设计模式
首先应该了解各种设计模式解决的问题，当你在开发的过程中遇到问题的时候，除了常规的解决方案之外，可以有更多的选择，当你去开发一个框架或者开发一套架构的时候能够考虑到更多的情况，并且设计出更容易拓展，更好维护的结构。
### 学习设计模式的前提
* 深入的了解函数 作用域 闭包
* 熟练应用this call bind apply
* 熟练使用高级函数（纯函数 高阶函数 记忆函数 偏函数....）
* 掌握函数式变成的思想以及理解其使用的意义

## 单例模式
### 普通构造函数
单例模式是指一个构造函数，无论new多少次，返回的都是同一个实例，比如alert，在我们使用的时候页面上只会有一个alert弹窗。
先来看一个普通的构造函数
~~~
function Test(){}
let a=new Test;
let b=new Test;
console.log(a===b)//false
~~~
### 通过函数属性构造单例
如果我们希望a,b是完全相等的应该怎样做？
> 可以在构造函数上增加一个instance属性来保存实例，并增加一个getInstance方法来获取实例。如果实例存在则直接返回，如果不存在则创建一个保存在instance属性中并返回。
~~~
function Single(){}
Single.getInstance=function(){
    if(!this.instance){
        this.instance=new Single();
    }
    return this.instance
};
let a=Single.getInstance();
let b=Single.getInstance();
console.log(a===b);//true
~~~
这样做虽然解决的问题，但是又造成了两个新的问题
* 第一：没有对参数进行处理
* 第二：并不是是用new方法来创建的实例，和常规操作不符。
### 解决传参问题
先来解决第一个问题，参数的处理
~~~
function Alert(content){
    this.content=content;
}
Alert.getInstance=function(content){
    if(!this.instance){
        this.instance=new Alert(content);
    }else{
        this.apply(this.instance,arguments)
    }
    return this.instance
};
Alert.prototype.showContent=function(){
    console.log(this.content)
}
let a=Alert.getInstance('this is a');
a.showContent();//this is a
let b=Alert.getInstance('this is b');
b.showContent();//this is b
console.log(a===b);//true
~~~
### 通过new操作符实现单例构造
这样就解决了传参的问题，接下来我们来解决是用new操作符的问题。由于要通过变量对生成的实例进行保存，又不能污染全局环境，所以这里我们使用IFFE来执行，并返回构造函数。
~~~
let Alert=(function(){
    let instance;
    function Alert(content){
        if(!instance){
            instance=this;
        }
        instance.init(content);
        return instance;
    }
    Alert.prototype.init=function(content){
        this.content=content;
    };
    return Alert;
})();
let a=new Alert('this is a');
a.showContent();//this is a
let b=new Alert('this is b');
b.showContent();//this is b
console.log(a===b);//true
~~~
### 省略new操作符
至此基础的单例就完成了，但还远远没有结束，在我们使用一些基础对象的时候，如数组，我们可以使用New Array的方式，也可以不使用new操作符 直接使用Array也是可以的，因此我们对函数进行改造；
~~~
let Alert=(function(){
    let instance;
    function Alert(content){
        if(this instanceof Alert){
            if(!instance){
                instance=this;
            }
        }else{
            if(!instance){
                instance=new Alert(content);
            }
        }
        instance.init(content);
        return instance;
    }
    Alert.prototype.init=function(content){
        this.content=content;
    };
    return Alert;
})();
let a=Alert('a');
console.log(a.content);//a
let b=Alert('b');
console.log(b.content)//b
console.log(a===b);//true
~~~
对上面的代码进行一下优化
~~~
let Alert=(function(){
    let instance;
    function Alert(content){
        instance=instance||(
            this instanceof Alert?this:new Alert(content)
        )
        instance.init(content);
        return instance;
    }
    Alert.prototype.init=function(content){
        this.content=content;
    };
    return Alert;
})();
~~~
前文说到设计模式是基于C++提出的，而每种语言又有自己的独特性，比如JS中“一切皆对象”，而对象本身就是一种单例，任何对象只要指针不同就不相等，我们前面做的仅仅是通过一个独立的变量来保存结果并返回，借助ES6的import export可实现的更加简单，也不会涉及到全局污染，如此看来似乎并不能体现出单例的优势，所以下面我们来说单例模式中最重要的概念----惰性单例
## 惰性单例
上面的案例只是一个理论上的DEMO，在实际的开发中并没有太大的用途，接下来我们来看一下单例模式最核心的应用，惰性单例。
我们平时如果只做弹窗，一定是自己通过DOM节点来模拟一个弹窗，所以必然涉及到DOM操作,也就是在上面的代码中的init函数中去创建DOM元素，但是这样操作就会导致每次创建实例的时候都创建一次DOM节点，这显然是不正确的，因此，我们可以把DOM的创建过程提到函数顶部，也就是程序一开始直接创建一个DOM节点，仅在init中去修改里面的内容。
~~~
let Alert=(function(){
    let instance=null;
    let dom=document.createElement('div');
    dom.style.display='none';
    document.body.appendChild(dom);
    function Alert(content){
        instance=instance||(
            this instanceof Alert?this:new Alert(content)
        )
        instance.init(content);
        return instance;
    }
    Alert.prototype.init=function(content){
        dom.style.display='block';
        dom.innerText=content;
    };
    Alert.prototype.hide=function(content){
        dom.style.display='none'
    };
    return Alert;
})();
let a=new Alert('this is a');
~~~
虽然功能都实现了，但是在页面打开之后就在网页中建立的DOM节点，造成不必要的浪费，其实我们完全可以在生成alert实例的时候再去生成这些dom节点，因此我们可以再次使用单例将创建DOM节点的操作制作成一个单例。
~~~
let Alert=(function(){
    let instance=null;
    let dom;
    function creatDom(){
        if(!dom){
            dom=document.createElement('div');
            dom.style.display='none';
            document.body.appendChild(dom);
        }
        return dom;
    }
    function Alert(content){
        instance=instance||(
            this instanceof Alert?this:new Alert(content)
        )
        instance.init(content);
        return instance;
    }
    Alert.prototype.init=function(content){
        creatDom();
        dom.style.display='block';
        dom.innerText=content;
    };
    Alert.prototype.hide=function(content){
        dom.style.display='none'
    };
    return Alert;
})();
let a=new Alert('this is a');
~~~
现在功能都完成了，但还是存在一些问题，creatDom操作违背了设计模式中的“单一职责”原则，这个函数应该只负责创建节点，以便在其他地方复用，我们更希望creatDom的操作是这样的。
~~~
function creatDom(){
        let dom=document.createElement('div');
        dom.style.display='none';
        document.body.appendChild(dom);
        return dom;
    }
~~~
因此我们可以将单例的逻辑提取出来，制作成高阶单例函数，当我们需要创建单例的时候直接调用这个函数就可以了，这里我们将creatDom作为参数传递给getSingle来使用，这种方式也被称为通用惰性单例。
## 通用惰性单例
~~~
let getSingle=(function(){
    let single;
    return function(fn){
        return single||(single=fn.apply(this,arguments))
    }
})();
function creatDom(){
    let dom=document.createElement('div');
    dom.style.display='none';
    document.body.appendChild(dom);
    return dom;
}
let Alert=(function(){
    let instance=null;
    let dom;
    function Alert(content){
        instance=instance||(
            this instanceof Alert?this:new Alert(content)
        )
        instance.init(content);
        return instance;
    }
    Alert.prototype.init=function(content){
        dom=getSingle(creatDom);
        dom.style.display='block';
        dom.innerText=content;
    };
    Alert.prototype.hide=function(content){
        dom.style.display='none'
    };
    return Alert;
})();
~~~
你可以将上面的这个代码块的内容粘贴到控制台，然后运行以下测试代码查看效果
~~~
let a=Alert('123')//页面上插入一个DIV内容为123
let b=new Alert('345')//123变成456
b.hide()//div隐藏
~~~
