# 梯云纵


> 韦陀掌法,难陀时间善恶；梯云纵,难纵过乱世纷扰。

<!--more-->

现在开始写代码o(╯□╰)o 

## 什么是跨域
### **1.跨域的定义**
> 广义的跨域是指一个域下对的文档或者脚本试图去请求另外一个域下的资源。
>> * a链接、重定向、表单提交
>> * `<frame>、<link>、<script>、<img>`等标签
>> * `background:url()、@font-face()`
>> * ajax 跨域请求
>> * ……

> 狭义的跨域是指浏览器同源策略限制的一类请求场景。

####**同源策略**
![tongyuan](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/tongyuan.png)

## 前端跨域的主要解决方法
### **1.jsonp跨域**
原理：动态创建`<script>`标签，然后利用`<script>`的src不受同源策略约束来跨域获取数据。

缺点：只支持get方式请求

* 原生js实现

```javascript
    var script = document.createElement('script');
    script.type = 'text/javascript';

    // 传参一个回调函数名给后端，方便后端返回时执行这个在前端定义的回调函数
    script.src = 'http://www.domain2.com:8080/login?user=admin&callback=jsonPCallback';
    document.head.appendChild(script);

    // 前端回调执行函数
    function jsonPCallback(res) {
        alert(JSON.stringify(res));
    }
    
   //服务端返回如下（后端返回执行函数）：
	jsonPCallback({"status": true, "user": "admin"})
```
* jquery实现

```javascript
$.ajax({
    url: 'http://www.domain2.com:8080/login',
    type: 'get',
    dataType: 'jsonp',  // 请求方式为jsonp
    jsonpCallback: "handleCallback",    // 自定义回调函数名
    data: {}
});
```

### **2.CORS(跨域资源共享)**
CORS需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于IE10。

整个CORS通信过程，都是浏览器自动完成，不需要用户参与。浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。<br>
与jsonp相比：支持所有类型的HTTP请求。但JSONP支持老式浏览器。

#### **1.简单请求**
>（1) **请求方法是以下三种方法之一：**
>> * HEAD
>> * GET
>> * POST

> (2）**HTTP的头信息不超出以下几种字段：**

>>* Accept
>>* Accept-Language
>>* Content-Language
>>* Last-Event-ID
>>* Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

同时满足以上两个条件的就是简单请求

```
//简单请求，浏览器自动增加Origin字段，Origin字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。
Content-Type: text/plain
Origin: http://www.domain.com
User-Agent: Mozilla/5.0

//如果Origin指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应。浏览器检查这个响应的头信息有没有包含Access-Control-Allow-Origin字段，没有的话，就会抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。注意，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200。
//如果Origin指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。

Access-Control-Allow-Origin: http://www.domain.com  
//值要么是请求时Origin字段的值，要么是一个*，表示接受任意域名的请求。

Access-Control-Allow-Credentials: true
//值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可。
同时，请求中也要设置
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
//Access-Control-Allow-Origin此时不能设为星号

Access-Control-Expose-Headers: FooBar
//用于拿到XMLHttpRequest对象非基本字段
```

#### **2.复杂请求**
```
//与简单请求不同的是，复杂请求多了2个字段，进行服务器预检：
Access-Control-Request-Method：该次请求的请求方式
Access-Control-Request-Headers：该次请求的自定义请求头字段

//预检成功，服务器返回的响应
//指定允许其他域名访问
'Access-Control-Allow-Origin:
//是否允许后续请求携带认证信息（cookies）,该值只能是true,否则不返回
'Access-Control-Allow-Credentials:true'
//预检结果缓存时间
'Access-Control-Max-Age: 1800'
//允许的请求类型
'Access-Control-Allow-Methods:GET,POST,PUT,POST'
//允许的请求头字段
'Access-Control-Allow-Headers:x-requested-with,content-type'
```


### **4.iframe 家族**
#### **1.window.name**
> window.name有以下特征：
>>* 每个窗口都有独立的window.name与之对应；
>>* 在一个窗口被关闭前，窗口载入的所有页面同时共享一个window.name，每个页面对window.name都有读写的权限；
>>* window.name一直存在与当前窗口，即使是有新的页面载入也不会改变window.name的值；
>>* window.name可以存储最多2M的数据，数据格式按需自定义。

原理：在页面中动态创建一个iframe页面指向另一个域，将数据赋值给ifram的window.name属性。(此时页面不能直接读取iframe的window.name),我们还需要将将iframe的src指向相同域的空白页面。之后再将iframe删除就可以了

```html
<!--a.html-->
var proxy = function(url, callback) {
    var state = 0;
    var iframe = document.createElement('iframe');

    // 加载跨域页面
    iframe.src = url;

    // onload事件会触发2次，第1次加载跨域页，并留存数据于window.name
    iframe.onload = function() {
        if (state === 1) {
            // 第2次onload(同域proxy页)成功后，读取同域window.name中数据
            callback(iframe.contentWindow.name);
            destoryFrame();

        } else if (state === 0) {
            // 第1次onload(跨域页)成功后，切换到同域代理页面
            iframe.contentWindow.location = 'http://www.domain.com/aa.html';
            state = 1;
        }
    };

    document.body.appendChild(iframe);

    // 获取数据以后销毁这个iframe，释放内存；这也保证了安全（不被其他域frame js访问）
    function destoryFrame() {
        iframe.contentWindow.document.write('');
        iframe.contentWindow.close();
        document.body.removeChild(iframe);
    }
};
// 请求跨域b页面数据
proxy('http://www.domain1.com/b.html', function(data){
    alert(data);
});

<!--b.html-->
<script>
    window.name = 'This is domain1 data!';
</script>
```

#### **2.document.domain**
主域相同，子域不同的跨域应用场景。
原理：两个页面都通过js强制设置document.domain为基础主域，就实现了同域。

```html
<!--a.html-->
<iframe id="iframe" src="http://child.domain.com/b.html"></iframe>
<script>
    document.domain = 'domain.com';
    var user = 'admin';
</script>
<!--b.html-->
<script>
    document.domain = 'domain.com';
    // 获取父窗口中变量
    alert('get js data from parent ---> ' + window.parent.user);
</script>
```

#### **3.location.hash**
location.hash：指的是URL的#后面的部分，比如www.domain1.com/b.html#hello 的#hello，只改变hash是不会刷新页面。
原理：通过中间页面来实现。 三个页面，不同域之间利用iframe的location.hash传值，相同域之间直接js访问来通信。

```html
<!--http://www.domain.com/a.html-->
<iframe id="iframe" src="http://www.domain1.com/b.html" style="display:none;"></iframe>
<script>
    var iframe = document.getElementById('iframe');

    // 向b.html传hash值
    setTimeout(function() {
        iframe.src = iframe.src + '#user=admin';
    }, 1000);
    
    // 开放给同域c.html的回调方法
    function onCallback(res) {
        alert('data from c.html ---> ' + res);
    }
</script>

<!--http://www.domain1.com/b.html-->
<iframe id="iframe" src="http://www.domain.com/c.html" style="display:none;"></iframe>
<script>
    var iframe = document.getElementById('iframe');

    // 监听a.html传来的hash值，再传给c.html
    window.onhashchange = function () {
        iframe.src = iframe.src + location.hash;
    };
</script>

<!--http://www.domain.com/c.html-->
<script>
    // 监听b.html传来的hash值
    window.onhashchange = function () {
        // 再通过操作同域a.html的js回调，将结果传回
        window.parent.parent.onCallback('hello: ' + location.hash.replace('#user=', ''));
    };
</script>
```

### **5.window.postMessage**
otherWindow.postMessage(message, targetOrigin, [transfer]);
>window.postMessage() 方法被调用时，会在所有页面脚本执行完毕之后（e.g., 在该方法之后设置的事件、之前设置的timeout 事件,etc.）向目标窗口派发一个  MessageEvent 消息。 该MessageEvent消息有四个属性需要注意： message 属性表示该message 的类型； data 属性为 window.postMessage 的第一个参数；origin 属性表示调用window.postMessage() 方法时调用页面的当前状态； source 属性记录调用 window.postMessage() 方法的窗口信息。
优势：页面和其打开的新窗口的数据传递、 多窗口之间消息传递、嵌套的iframe消息传递的信息传递

```javascript
<!--http://www.domain.com/a.html-->
<iframe id="iframe" src="http://www.domain1.com/b.html" style="display:none;"></iframe>
<script>       
    var iframe = document.getElementById('iframe');
    iframe.onload = function() {
        var data = {
            name: 'aym'
        };
        // 向domain1传送跨域数据
        iframe.contentWindow.postMessage(JSON.stringify(data), 'http://www.domain1.com');
    };

    // 接受domain返回数据
    window.addEventListener('message', function(e) {
        alert('data from domain2 ---> ' + e.data);
    }, false);
</script>

<!--http://www.domain1.com/b.html-->
<script>
    // 接收domain的数据
    window.addEventListener('message', function(e) {
        alert('data from domain ---> ' + e.data);

        var data = JSON.parse(e.data);
        if (data) {
            data.number = 16;
            // 处理后再发回domain
            window.parent.postMessage(JSON.stringify(data), 'http://www.domain.com');
        }
    }, false);
</script>
```

**如果您不希望从其他网站接收message，请不要为message事件添加任何事件侦听器。**<br>
**如果您确实希望从其他网站接收message，请始终使用origin和source属性验证发件人的身份。**<br>
**当您使用postMessage将数据发送到其他窗口时，始终指定精确的目标origin，而不是`*`**

### **6. nginx**
请看之前的文章 [前端如何玩转Nginx](http://www.bingshangroup.com/blog/2019/04/23/carlo/nginx/)

### **7.  Nodejs中间件代理**

中间件代理跨域相关教程，请关注冰山工作室”中间件系列教程“，敬请期待~



[阮一峰CORS](http://www.ruanyifeng.com/blog/2016/04/cors.html)<br>
[window​.post​Message](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
