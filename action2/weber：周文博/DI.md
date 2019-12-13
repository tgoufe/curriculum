---
title: 依赖注入
date: 2019-12-09 12:52:37
tags:
  - JavaScript
  - 面向对象
  - DI
  - 依赖注入
  - IoC
  - 控制反转
---

大家一起学习。。。

<!--more-->

# 依赖注入

## 缘起

一直想讲讲依赖注入，依赖注入是一种面向对象的开发模式，更多的是在后端开发中常见，不过我对面向对象没有什么特别深的造诣，所以还是大家一起学习吧。。。

第一次知道依赖注入是从 `angular.js` 框架，在当时 `jQuery` 时代，配合各种 `jQuery` 插件做一些命令式的开发，甚至还没有 `class`，虽然说 `javascript` 也是一种面向对象语言，但是与常规的面向对象语言有很大的区别，也很别扭，虽然有一些优秀的人能做一些封装，但总体上并没有做出特别优秀的效果。这之后 `angular.js` 出现了，它的出现引发了很大的影响，对前端的工程化起到了促进作用，引入了一些后端开发常见的开发模式，也将很多曾经的后端开发人员吸引到前端开发中，可以说对现在前端百花齐放的状态起到了铺垫的作用

## 何为依赖注入

依赖注入（`Dependency Injection`，缩写为 `DI`），在软件工程中，依赖注入是种实现控制反转用于解决依赖性设计模式。一个依赖关系指的是可被利用的一种对象（即服务提供端）。依赖注入是将所依赖的传递给将使用的从属对象（即客户端）。该服务将会变成客户端的状态的一部分。传递服务给客户端，而非允许客户端来建立或寻找服务，是本设计模式的基本要求

简单来说，把过程放在外面，将结果带入内部，对于依赖模块的模块，则把依赖作为参数使用

## 依赖倒置原则

随着不断学习，最终了解到，其实依赖注入仅仅是一种实现方式，它的背后是基于一个设计原则，这就是依赖倒置原则

依赖倒置（`Dependency inversion principle`，缩写为 `DIP`）是面向对象六大基本原则之一，指一种特定的解耦形式，使得高层次的模块不依赖于低层次的模块的实现细节，依赖关系被颠倒（反转），从而使得低层次模块依赖于高层次模块的需求抽象

该原则规定：
* 高层次的模块不应该依赖于低层次的模块，两者都应该依赖于抽象接口
* 抽象接口不应该依赖于具体实现，而具体实现则应该依赖于抽象接口

## 控制反转

上面说了依赖倒置原则，那么该如何实现这一原则，这里就有了控制反转的概念

控制反转（`Inversion of Control`，缩写为 `IoC`）是面向对象编程中的一种设计原则，用来降低计算机代码之间的耦合度。是实现依赖倒置原则的一种代码设计思路。其中最常见的方式叫做依赖注入，还有一种方式叫依赖查找

如果说依赖倒置原则告诉我们该依赖谁，那么控制反转则告诉我们谁应该来控制依赖

现在总结它们之间的关系如下：

```
+----------------------------------+
|                                  |
|    依赖倒置原则                   |
|  Dependency Inversion Principle  |
|                                  |
+----------+-----------------------+
           |
           | 思 路
           v
+----------+-------------+              +--------------------+
|                        |              |                    |
|    控制反转             |  第三方容器   |    控制反转容器     |
|  Inversion of Control  +------------->+  IoC Container     |
|                        |              |                    |
+----------+-------------+              +--------------------+
           |
           | 方 法
           v
+----------+-------------+
|                        |
|    依赖注入             |
|  Dependency Injection  |
|                        |
+------------------------+
```

## 案例

一般来说，控制反转在后端架构中应用的更多，这是因为后端的架构至少可以分为 3 层：

* `web` 层，接收前端请求，处理请求参数，匹配后端路由，调用对应的 service 层处理业务
* `service` 层，接收 `web` 层的参数，处理业务逻辑，如果需要读取数据，会调用 `database` 层
* `database` 层，处理数据库相关的层，负责连接数据库，以及常用的增删改查方法的封装

正常的逻辑是：`web` 层依赖 `service` 层，`service` 层依赖 `database` 层，通过控制反转，可以使它们相互解耦

那么具体在前端又是什么样的呢？

假设有这样一个场景，用户做了某些操作，我们要将数据保存在本地，当用户下次登录的时候，我们就可以取出这些数据来做些设置

在以前，我们都知道要将这些数据保存在 `cookie` 中，那么代码可能是这样的：

```javascript
import cookie   from 'cookie'
class Setting{
    init(){
        let userInfo = cookie.get('userInfo')
            ;
        
        // do something
    }
}
```

这就是传统的处理依赖关系的方式，在这里 `Setting` 是高层次模块，`cookie` 是低层次模块，依赖关系创建与高层次模块，且高层次模块直接依赖低层次模块，这种依赖关系限制了高层次模块的复用性

直白的说，这段代码依赖于 `cookie`，这样代码与 `cookie` 操作耦合在了一起，在以前这是没有问题的，因为本地存储我们只有 `cookie` 可用。但是时代变了，在后来 `localStorage` 等本地存储出现了，我们都知道应该使用 `localStorage` 来替代 `cookie`。这个过程很麻烦，因为可能操作 `cookie` 的模块有很多个，我们需要找出所有对 `cookie` 依赖的模块然后替换掉相关代码

但是还要考虑兼容性，在浏览器不支持 `localStorage` 的情况下还要使用 `cookie`，如果把这个逻辑放在上面代码中，则会变成如下：

```javascript
import cookie   from 'cookie';
class Setting{
    init(){
        let userInfo
            ;
        
        if( isSupportLocalStorage ){
            userInfo = localStorage.getItem('userInfo');
        }
        else{
            userInfo = cookie.get('userInfo');
        }

        // do something
    }
}
```

而这样，这段代码又同时依赖了 `cookie` 和 `localStorage`，随着以后发展，可能依赖会变得越来越多。

然而实际上我们想做的是获取数据，并不关心从哪里取

这样，就像上文说的，我们将过程放在外面，将结果带入内部，将最终结果以参数的形式传进来

但还有一个小问题，`cookie` 和 `localStorage` 的接口是不一样的，这样我们应该设计一些抽象的接口。我们对 `localStorage` 和 `cookie` 进行抽象为一种 `Model` 数据类型，都提供了 `setData` 和 `getData` 方法，但是我们还应该注意，本地存储并不只有 `localStorage` 和 `cookie`，还有 `IndexedDB` 等，以及谁知道未来还会有些什么东西呢，而关于 `IndexedDB` 最大的问题是它的所有接口是异步的，那么应该使用 `Promise` 再将同步和异步统一进行抽象，那么最终满足所有情况的抽象代码应该如下：

```javascript
class Model{
    /**
     * @summary 设置数据
     * @param   {string}    key
     * @param   {*}         value
     * @return  {Promise<boolean>}
     * */
    setData(key, value){
        return Promise.resolve( true );
    }
    /**
     * @summary 获取数据
     * @param   {string}    key
     * @return  {Promise<*>}
     * */
    getData(key){
        return Promise.resolve( null );
    }
}
```

上面的 `Setting` 类的代码变为：

```javascript
class Setting{
    constructor(model){
        this.model = model;
    }
    init(){
        let userInfoPromise = this.model.getData('userInfo')
            ;

        userInfoPromise.then((userInfo)=>{
            // do something
        });
    }
}
```

可以看出 `Setting` 类不在依赖 `cookie`，任何继承自 `Model` 的类都可以使代码执行下去，这样 `localStorage`、`cookie` 和 `IndexedDB` 相关模块的抽象代码如下：

```javascript
// cookie 模块继承 Model 抽象
class CookieModel extends Model{
    /**
     * @summary 设置数据
     * @param   {string}    key
     * @param   {*}         value
     * @return  {Promise<boolean>}
     * */
    setData(key, value){
        return Promise.resolve( cookie.set(key, value) ); 
    }
    /**
     * @summary 获取数据
     * @param   {string}    key
     * @return  {Promise<*>}
     * */
    getData(key){
        return Promise.resolve( cookie.get(key) );
    }
}

// localStorage 模块继承 Model 抽象
class LocalStorageModel extends Model{
    /**
     * @summary 设置数据
     * @param   {string}    key
     * @param   {*}         value
     * @return  {Promise<boolean>}
     * */
    setData(key, value){
        return Promise.resolve( localStorage.setItem(key, value) ); 
    }
    /**
     * @summary 获取数据
     * @param   {string}    key
     * @return  {Promise<*>}
     * */
    getData(key){
        return Promise.resolve( localStorage.getItem(key) );
    }
}

// IndexedDB 模块继承 Model 抽象
class IndexedDBModel extends Model{   
	/**
	 * @param   {string}    key
	 * @param   {*}         value
	 * @return  {Promise<boolean>}  返回一个 Promise 对象，在 resolve 时传回 true
	 * */
	setData(key, value){   
        return new Promise((resolve, reject)=>{
            let objectStore = indexedDB.transaction(['store'], 'readwrite').objectStore( 'store' )
                , objectStoreRequest = objectStore.put({
                    key
                    , value
                })
                ;
    
            objectStoreRequest.onsuccess = function(e){
                resolve( !!e.target.result );
            };
            objectStoreRequest.onerror = function(e){
                console.log( e );
                reject( e );
            };
        });
    }
    /**
	 * @param   {string}    key
	 * @return  {Promise<*>}
	 * */
	getData(key){
        return new Promise((resolve, reject)=>{
            let objectStore = indexedDB.transaction(['store'], 'readwrite').objectStore( 'store' )
                , objectStoreRequest = objectStore.get( key )
                ;

            objectStoreRequest.onsuccess = function(e){
                resolve( e.target.result );
            };
            objectStoreRequest.onerror = function(e){
                reject( e );
            };
        });
    }
}
```

至此，我们就实现了控制反转，具体应用代码时：

```javascript
let model
    ;

if( isSupportIndexedDB ){
    model = new IndexedDBModel();
}
else if( isSupportLocalStorage ){
    model = new LocalStorageModel();
}
else{
    model = new CookieModel();
}

let setting = new Setting( model )
    ;
```

这其实就实现了依赖注入，有如下的优点：

* 代码复杂度低，逻辑清晰
* 便于维护，代码耦合度低，各个模块互不依赖
* 便于测试，不同模块之间可以单独的进行单元测试

但是缺点还是有的，每一次使用都需要手动传入依赖，当依赖太多时，也会造成难以维护的问题，那么怎么解决呢，接听下回分解

参考文章：
[你需要知道的依赖注入](https://zhuanlan.zhihu.com/p/74590237)
[从前端角度彻底搞懂 DIP、IoC、DI、JS](https://zhuanlan.zhihu.com/p/61018434)
[前端中的 IoC 理念](https://zhuanlan.zhihu.com/p/53832991)