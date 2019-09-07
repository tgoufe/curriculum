---
title: 设计一个类似 document.cookie 的 API  
date: 2019-07-26 17:50:25
tags:
  - defineProperty
  - API
  - JavaScript
---

大家一定都操作过 `cookie` 吧，难道就没有什么想法么？

<!--more-->

在我第一次知道 `JavaScript` 中如何操作 `cookie` 后，深深觉得很神奇，因为这个操作方式完全不符合语法逻辑，如：

```javascript
// 当你要设置 cookie 的时候：
document.cookie = 'a=1; path=/; domain=; expires=; ';

// 当你要获取 cookie 的时候：
let cookie = dcument.cookie
    // 返回的是所有的 cookie 所组成的字符串
    ; 
```

这个不符合逻辑的地方就是当我设置 `cookie` 的时候，明明是给 `document.cookie` 赋值，并且只是众多 `cookie` 中的一个，但当取值的时候，返回来的却是全部的 `cookie`，而并不是之前赋值的单个 `cookie`

简而言之，`document.cookie` 的内部实现是有一个队列，当对 `document.cookie` 赋值的时候，这个值会被放入这个队列中，而当把取 `document.cookie` 的值的时候，将把这个队列里的所有值都返回来。当然内部还有一些其它的操作，比如对过期时间进行检查之类的

这个操作在当时真心觉得有些神奇，毫无疑问，这个功能是由浏览器提供，必然不是使用 `JavaScript` 的语法来实现的，随着深入学习，我知道了这是基于 `setter/getter` 来实现的，很多语言都提供了这种功能的支持，但当时的 `JavaScript` 并不支持此功能

随着 `ES5` 的以后，`JavaScript` 的功能不断丰富，这个操作也变得可以实现了

具体来说就是由 `Object.defineProperty` 方法来实现，它能够对属性提供 `setter/getter` 功能：

```javascript
let doc = {
        _cookie: []        
    }
    ;

Object.defineProperty(doc, 'cookie', {
    enumerable: true
    , configurable: true
    , get(){
        return this._cookie.join();        
    }
    , set(value){        
        this._cookie.push( value );        
    }
});
```

这样当使用上述方法的构建的对象时，就会出现一些有趣的操作：

```javascript
doc.cookie = '王总喜欢打篮球';

console.log( doc.cookie );    // 王总喜欢打篮球

doc.cookie = '王总打篮球像 cxk';

console.log( doc.cookie );    // 王总喜欢打篮球,王总打篮球像 cxk
```

当然上述代码还是有些问题的，因为遍历 `doc` 的时候，还是会把 `_cookie` 显示出来，并且因为加了 `configurable` 属性，所以 `cookie` 还是可以被 `delete` 的，这样再对 `cookie` 赋值，这时 `cookie` 属性就变成了普通的属性了

所以调整一下，并丰富一些功能，让它更像 `document.cookie` 的功能：

```javascript
let doc = Object.defineProperties({}, {
        _cookie: {
            value: []
        }
        , cookie: {
            enumerable: true
            , get(){
                let date = (new Date()).toUTCString()
                    ;

                // 你可以在这里添加各种过滤操作
                return this._cookie.filter((c)=>{
                    return c.expires > date
                }).map((c)=>{
                    return `${c.name}=${c.value}`;
                }).join('; ');
            }
            , set(value){
                // 你可以在这里添加各种过滤操作
                this._cookie.push( value );
            }
        }
    })
    ;

// 解析字符串太麻烦了，所以这里直接用对象了。。。
doc.cookie = {
    name: 'a'
    , value: 1
    , expires: (new Date( Date.now() + 600000)).toUTCString()   // 一分钟后过期
    , path: '/'
    , domain: ''
};
doc.cookie = {
    name: 'b'
    , value: 2
    , expires: (new Date( Date.now() + 10*600000)).toUTCString()    // 十分钟后过期
    , path: '/'
    , domain: ''
};

console.log( doc.cookie );
// a=1; b=2

// 一分钟后
console.log( doc.cookie );
// b=2
```

到这里，你一定会觉得，这个东西在什么场景下用呢？

这个不如就交给你的想象力了，嘿嘿嘿。。。