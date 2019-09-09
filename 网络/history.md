---
title: 你以为的不是你以为的 History
date: 2019-05-13 17:00:00
tags: 
    -JavaScript  
categories: JavaScript
---
Window.history是一个只读属性，用来获取History 对象的引用，History 对象提供了操作浏览器会话历史（浏览器地址栏中访问的页面，以及当前页面中通过框架加载的页面）的接口，允许你在用户浏览历史中向前和向后跳转。

<!--more-->
# history
Window.history是一个只读属性，用来获取History 对象的引用，History 对象提供了操作浏览器会话历史（浏览器地址栏中访问的页面，以及当前页面中通过框架加载的页面）的接口，允许你在用户浏览历史中向前和向后跳转。

同时，从HTML5开始提供了对history栈中内容的操作。
History 对象是 window 对象的一部分，可通过 window.history 属性对其进行访问。
### History对象属性

|属性|描述|
|-|-|
|length |返回浏览器历史列表中的 URL 数量。 |
|state |返回一个表示历史堆栈顶部的状态的值。这是一种可以不必等待popstate 事件而查看状态而的方式 |

### History 对象方法

| 方法  | 属性  |
|:-------------: |:---------------:|
| back() | 加载 history 列表中的前一个 URL。|
| forward()| 加载 history 列表中的下一个 URL。 |
| go()| 加载 history 列表中的某个具体页面。|

History 对象最初设计来表示窗口的浏览历史。但出于隐私方面的原因，History 对象不再允许脚本访问已经访问过的实际 URL。唯一保持使用的功能只有 back()、forward() 和 go() 方法。
```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>history test</title>
    <script type="text/javascript" src="jquery.min.js"></script>
</head>

<body>
	<button onclick="count()">count</button>
    <button onclick="doForWard()">forward</button>        
    <button onclick="doBack()">back</button>          
    
    <script>
        var index=1;

        function count(){
            console.log(`window.history.length = ${history.length}`);
        }

        function doForWard(){
        	history.forward();
        }

        function doBack(){
        	history.back();
        }
    </script>
</body>

</html>

```
## html5新特性：利用history的pushState等方法来解决使用ajax导致页面后退和前进的问题
使用ajax，可以实现不需要刷新整个页面就可以进行局部页面的更新。这样可以开发交互性很强的富客户端程序，减少网络传输的内容。但长期以来存在一个问题，就是无法利用浏览器本身提供的前进和后退按钮进行操作。比如在页面执行某个动作，该动作利用ajax请求到服务器获取数据，更新了当前页面的某些内容，这时想回到操作前的界面，用户就会习惯点击浏览器的后退按钮，实际这里是无效的。
HTML5引入了histtory.pushState()和history.replaceState()这两个方法，它们会更新history对象的内容。同时，结合window.onpostate事件，就可以解决这个问题。

| 方法  | 属性  |
|:------------- |:---------------:|
| pushState()| 按指定的名称和URL（如果提供该参数）将数据push进会话历史栈|
| replaceState()| 按指定的数据，名称和URL(如果提供该参数)，更新历史栈上最新的入口|
```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>history test</title>
    <script type="text/javascript" src="jquery.min.js"></script>
</head>

<body>
	<button onclick="count()">count</button>
    <button onclick="doForWard()">forward</button>        
    <button onclick="doBack()">back</button>        
    <button onclick="doPushState()">pushState</button>        
    <button onclick="doReplaceState()">replaceState</button>        
    
    <script>
        var index=1;

        function count(){
            console.log(`window.history.length = ${history.length}`);
        }

        function doForWard(){
        	history.forward();
        }

        function doBack(){
        	history.back();
        }

        function doPushState(){
            history.pushState({page:index++}, null,'?page='+index);
        }

        function doReplaceState(){
            history.replaceState({page:index++}, null,'?page='+index);
        }
    </script>
</body>

</html>
```

pushState接受3个参数
1）第一个参数是个js对象，可以放任何的内容，可以在onpostate事件中获取到便于做相应的处理。

2）第二个参数是个字符串，目前任何浏览器都没有实现，但未来可能会用到,可以传个空串。

3）第三个参数是个字符串，就是保存到history中的url。


调用 pushState() 后浏览器并不会立即加载这个URL，但可能会在稍后某些情况下加载这个URL，比如在用户重新打开浏览器时。新URL不必须为绝对路径。如果新URL是相对路径，那么它将被作为相对于当前URL处理。新URL必须与当前URL同源，否则 pushState() 会抛出一个异常。该参数是可选的，缺省为当前URL。
pushState的作用是修改history历史，当调用方法时，将当前url存入history栈中，并在地址栏中显示参数中的url，但是并不会加载新的url。
replaceState的参数和pushState相同，但是调用时并不会将旧url存入history，而是将history中的url替换为参数中的url。

### popState
当活动历史记录条目更改时，将触发popstate事件。如果被激活的历史记录条目是通过对history.pushState（）的调用创建的，或者受到对history.replaceState（）的调用的影响。
popstate事件的state属性包含历史条目的状态对象的副本，也是pushState以及replaceState函数跳转到当前页面时传递的第一个参数。

popstate事件在浏览器前进、后退时会触发,配合pushState和replaceState，可以解决使用ajax的页面前进后退的问题。

具体解决方案是在触发ajax事件时同时调用pushState事件修改url信息，当popState 被触发时，同时调用history事件，根据当前url的不同，调用ajax事件恢复对应的状态。

### history+popstate 应用

1. 网页不是你想走，想走就能走
只需添加几行代码
```javascript
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});
```
这段代码会把当前url先加入url历史中，此时history栈顶端有两个相同的url，当点击后退事件时，退回到前一个url，但是页面会监听后退事件并再次push一个相同的url进入栈中。
对于用户来说点击后退按钮后，url永远不变，页面也没有重新加载（出于道德伦理公约，此方法慎用）

2. 路由的history模式 详见路由实现

chrome在考虑新的history实现
https://baijiahao.baidu.com/s?id=1633187248972482689&wfr=spider&for=pc

## location

history是HTML5新方法，在旧版本的IE浏览器中有兼容性问题，并且history在更改url的时候不会发送请求刷新页面，
如果是想在切换url的同时加载url，则可以使用location.assign和location.replace方法

- window.location.assign(url) ： 加载 URL 指定的新的 HTML 文档。 就相当于一个链接，跳转到指定的url，当前页面会转为新页面内容，可以点击后退返回上一个页面。
- window.location.replace(url) ： 通过加载 URL 指定的文档来替换当前文档 ，这个方法是替换当前窗口页面，前后两个页面共用一个

## 用history和location实现简单的路由
路由要实现的功能：
- 点击按钮，url更新，不重新加载资源，仅动态执行js
- 刷新页面保持当前状态
- push方法把路由历史加入页面历史记录中，replace方法替换历史记录中的页面，点击返回
- 监听地址栏，用户手动输入时，显示对应内容
- 分为hash模式和history模式

hash
```javascript
/**
 * hash 模式
 */
function Route(){
    this.routes = {};// 存放路由path及callback
    this.currentUrl = '';

    window.addEventListener('hashchange', this.refresh);
}

// 切换路由后执行
Route.prototype.refresh = function(){
    console.log(location.hash +' dom is refresh')
}
// 事件和路由绑定
Route.prototype.route = function(path, callback){
    this.routes[path] = callback;
}
// 执行事件
Route.prototype.push = function(path){
    //更新视图 dosomething
    location.hash = path;
    this.currentUrl = location.hash.slice(1) || '/';
    this.routes[this.currentUrl] && this.routes[this.currentUrl]();
}

Route.prototype.replace = function(path){
    //更新视图 dosomething
    const i = location.href.indexOf('#');
    location.replace(location.href.slice(0, i >= 0 ? i : 0) + '#' + path);
    this.routes[path] && this.routes[path]();
}

var myRouter = new Route();

// 定义路由事件
myRouter.route('my', () => {
    console.log('page1');
})
myRouter.route('home', () => {
    console.log('page2');
})

// 使用路由
myRouter.push('my');
myRouter.replace('home');
```
history
```javascript
function Route(){
    this.routes = {};// 存放路由path及callback

    window.addEventListener('popState', this.refresh)
}

Route.prototype.refresh = function(path){
    console.log('dom has refresh');
}
// 事件和路由绑定
Route.prototype.route = function(path, callback){
    this.routes[path] = callback;
}

Route.prototype.replace = function (path) {
    //更新视图
    history.replaceState({path: path}, null, path);
    this.routes[path] && this.routes[path]();
}
Route.prototype.push = function (path) {
    //更新视图
    history.pushState({path: path}, null, path);
    this.routes[path] && this.routes[path]();
}

var myRouter = new Route();

// 定义路由事件
myRouter.route('/my', () => {
    console.log('page1');
})
myRouter.route('/detail', () => {
    console.log('page2');
})

// 使用路由
myRouter.push('/detail')
```

## 附录 
vue-router源码导读
1-1 VueRouter构造函数
```javascript
// src/index.js

export default class VueRouter{
  mode: string; // 传入的字符串参数，指示history类别
  history: HashHistory | HTML5History | AbstractHistory; // 实际起作用的对象属性，必须是以上三个类的枚举
  fallback: boolean; // 如浏览器不支持，'history'模式需回滚为'hash'模式
  
  constructor (options: RouterOptions = {}) {
    
    let mode = options.mode || 'hash' // 默认为'hash'模式
    this.fallback = mode === 'history' && !supportsPushState // 通过supportsPushState判断浏览器是否支持'history'模式
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract' // 不在浏览器环境下运行需强制为'abstract'模式
    }
    this.mode = mode

    // 根据mode确定history实际的类并实例化
    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }

  init (app: any /* Vue component instance */) {
    
    const history = this.history

    // 根据history的类别执行相应的初始化操作和监听
    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }

    history.listen(route => {
      this.apps.forEach((app) => {
        app._route = route
      })
    })
  }

  // VueRouter类暴露的以下方法实际是调用具体history对象的方法
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.push(location, onComplete, onAbort)
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.replace(location, onComplete, onAbort)
  }
}
```
1.  在初始化对应的history之前，会对mode做一些校验：若浏览器不支持HTML5History方式(通过supportsPushState变量判断)，则mode设为hash;若不是在浏览器环境下运行，则mode设为abstract;
2.  VueRouter类中的onReady(),push()等方法只是一个代理，实际是调用的具体history对象的对应方法，在init()方法中初始化时，也是根据history对象具体的类别执行不同操作;

1-2 HashHistory
流程：

$router.push()-->HashHistory.push()-->History.transitionTo()-->History.updateRoute()-->{app._route=route}-->vm.render()

HashHistory.push()
```javascript
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  this.transitionTo(location, route => {
    pushHash(route.fullPath)
    onComplete && onComplete(route)
  }, onAbort)
}

function pushHash (path) {
  window.location.hash = path //对hash进行直接赋值
}
```
HashHistory.replace()
```javascript
replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  this.transitionTo(location, route => {
    replaceHash(route.fullPath)
    onComplete && onComplete(route)
  }, onAbort)
}
  
function replaceHash (path) {
  const i = window.location.href.indexOf('#')
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path //调用location.replace()直接替换hash
  )
}
```
1-3 transitionTo()
```javascript
//父类History中的transitionTo()方法
transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const route = this.router.match(location, this.current)
  this.confirmTransition(route, () => {
    this.updateRoute(route)
    ...
  })
}

updateRoute (route: Route) {
  
  this.cb && this.cb(route)
  
}

listen (cb: Function) {
  this.cb = cb
}

//VueRouter类中定义了listen方法
init (app: any /* Vue component instance */) {
    
  this.apps.push(app)

  history.listen(route => {
    this.apps.forEach((app) => {
      app._route = route
    })
  })
}

//install.js在插件加载的地方混入了_route
// 通过Vue.mixin()方法，全局注册一个混合，影响注册之后所有创建的每个Vue实例，
// 该混合在beforeCreate钩子中通过Vue.util.defineReactive()定义了响应式的_route属性。
// 所谓响应式属性，即当_route值改变时，会自动调用Vue实例的render()方法，更新视图
export function install (Vue) {
  
  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      }
      registerInstance(this, this)
    },
  })
}
```
1-4 监听地址栏
```javascript
setupListeners () {
  window.addEventListener('hashchange', () => {
    if (!ensureSlash()) {
      return
    }
    this.transitionTo(getHash(), route => {
      replaceHash(route.fullPath)
    })
  })
}
```
1-5 HTML5History
```javascript
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  this.transitionTo(location, route => {
    pushState(cleanPath(this.base + route.fullPath))
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}

replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  this.transitionTo(location, route => {
    replaceState(cleanPath(this.base + route.fullPath))
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}

// src/util/push-state.js
export function pushState (url?: string, replace?: boolean) {
  saveScrollPosition()
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  const history = window.history
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url)
    } else {
      _key = genKey()
      history.pushState({ key: _key }, '', url)
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url)
  }
}

export function replaceState (url?: string) {
  pushState(url, true)
}
```
popState监听地址栏变化
```javascript
constructor (router: Router, base: ?string) {
  
  window.addEventListener('popstate', e => {
    const current = this.current
    this.transitionTo(getLocation(this.base), route => {
      if (expectScroll) {
        handleScroll(router, route, current, true)
      }
    })
  })
}
```
supportsPushState检查浏览器是否支持HTML5的history
```javascript
// src/util/push-state.js

export const supportsPushState = inBrowser && (function () {
  const ua = window.navigator.userAgent

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})()
```

