---
title: 架构设计：控制反转
date: 2019-12-09 12:52:37
tags:
  - JavaScript
  - 面向对象
  - DI
  - 依赖注入
  - IoC
  - 控制反转
---

解决复杂的问题要用复杂的方法？

<!--more-->

# 架构设计：控制反转

## 控制反转容器

在上一篇文章中，我们介绍了依赖注入，但是依赖注入有些问题，首先是复用

之前的案例，每一次使用都需要手动传入依赖，难以维护的问题。我们可以在一个地方统一进行依赖管理，即在一个容器里。一个简单控制反转容器实现：

```javascript
// ioc.js
export default function createIoC(){
    let iocMap = new Map()
        ;

    return {
        bind(key, callback){
            iocMap.set(key, {
                callback
            });
        }
        , use(key){
            let {callback} = iocMap.get(key)
                ;

            return callback();
        }
    };
}   

// ioc-config.js
import createIoC from 'ioc.js';
const ioc = createIoC();

// 手动绑定依赖关系
ioc.bind('CookieModel', ()=>{
    return new CookieModel();
});
ioc.bind('LocalStorageModel', ()=>{
    return new LocalStorageModel();
});
ioc.bind('IndexedDBModel', ()=>{
    return new IndexedDBModel();
});
ioc.bind('Model', ()=>{
    let model
        ;
    
    if( isSupportIndexedDB ){
        model = ioc.use('IndexedDBModel');
    }
    else if( isSupportLocalStorage ){
        model = ioc.use('LocalStorageModel');
    }
    else{
        model = ioc.use('CookieModel');
    }

    return model;
});


ioc.bind('Setting', ()=>{
    let model = ioc.use('Model');
        ;

    return new Setting( model );
});

export default ioc;

// main.js
import ioc from 'ioc-config.js';

let setting = ioc.use('Setting');
```

这样的实现后，虽然代码复杂度较高，逻辑复制，但是：

* 代码复杂度较高，逻辑较复杂，使用方便，要什么就注入什么就行了
* 便于维护，只需在一个地方（ioc-config.js）定义依赖关系，这个文件可以抽离出来作为单独的配置文件，实现数据驱动
* 便于测试，不同模块之间可以单独的进行单元测试

## 更多依赖

解决了复用的问题，我们继续思考，假设 `Setting` 仅仅是应用中的一个模块，类似的模块还有很多，如下：

```javascript
class App{
    constructor(setting, service, router, track){
        this.setting = setting;
        this.service = service;
        this.router = router;
        this.track = track;
    }
}
```

在这时候我们在添加一个 `Share` 模块，该怎么办呢，你不得不在参数后面添加一个 `share`，构造函数内再添加一行代码。当然，聪明的小伙伴想到把参数换为对象类型的，遍历添加赋值，但是这样是存在风险的，如果对象内某个 `key` 与类的内部方法或变量重名，就引发问题，所以我们应该进一步抽象 `App` 模块：

```javascript
const modules = []
    ;

class App{
    constructor(options){
        this.options = options;
        this.init();
    }

    init(){
        App.modules.forEach((module)=>{
            module.init && module.init( this );
        });
    }

    static use(...module){
        modules.push.apply(modules, module);
    }
    static get modules(){
        return modules;
    }
}
```

这样抽象后 `App` 内部已经没有“具体实现”了，看不到任何业务代码，那么该怎么应用 `App` 来管理依赖：

```javascript
// setting.js
export default class Setting{
    // ...
    static init(app){
        app.setting = new Setting( app.options.setting );
        
        // app do something
    }
}

// service.js
export default class Service{
    // ...
    static init(app){
        app.service = new Service( app.options.service ); 

        // app do something
    }
}

// index.js
import App from 'app.js';
import Setting  from 'setting.js';
import Service  from 'service.js';

App.use(Setting, Service);

new App({
    setting: {
        // ...
    }
    , service: {
        // ...
    }
});
```

现在 `App` 模块在使用上非常的方便，通过 `App.use()` 方法来“注入”依赖，在每个模块中按照一定的“约定”去初始化相关配置，比如此时需要新增一个 Share 模块的话，无需到 App 内部去修改内容：

```javascript
// share.js
export default class Share{
    // ...
    static init(app){
        app.share = new Share( app.options.share );

        // app do something
    }
}

// index.js
App.use( Share );

new App({
    share: {
    }
});
```

`App` 模块此时应该称之为“容器”比较合适了，跟业务已经没有任何关系了，它仅仅只是提供了一些方法来辅助管理注入的依赖和控制模块如何执行