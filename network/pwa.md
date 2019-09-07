---
title: 每天一点网站优化之：从 web 到 pwa
date: 2019-07-12 17:00:00
tags: 
    -JavaScript 
categories: JavaScript
---
上节课我们一起了解了sevice worker,它可以用于客户端资源缓存。但sevice worker的用处远远不止于此，它可以拦截所有的客户端http请求并存储返回的response，从而实现离线的客户端正常访问。
离线访问这一特性很容易让人联想到Native App的能力，实际上，sevice worker配合其他的技术，确实是可以让web页'Native'化，这就是我们常说的 PWA。
<!--more-->
# PWA介绍
PWA(progress web app)是致力于在网页应用中实现和原生应用相近的用户体验的渐进式网页应用，由google于2016年提出。
虽然是web页面，但通过一些新技术，使它具有离线访问和推送的能力，同时与native app相比，又具有安装方便、更新便捷的特点。

可以访问百度的LAVAS首页，获取更多关于pwa的API信息
 https://lavas.baidu.com/pwa/README

一个标准的PWA应该具有以下特点
- Discoverable, 内容可以通过搜索引擎发现。
- Installable, 可以出现在设备的主屏幕。
- Linkable, 你可以简单地通过一个URL来分享它。 
- Network independent, 它可以在离线状态或者是在网速很差的情况下运行。
- Progressive, 它在老版本的浏览器仍旧可以使用，在新版本的浏览器上可以使用全部功能。
- Re-engageable, 无论何时有新的内容它都可以发送通知。
- Responsive, 它在任何具有屏幕和浏览器的设备上可以正常使用——包括手机，平板电脑，笔记本，电视，冰箱，等。
- Safe, 在你和应用之间的连接是安全的，可以阻止第三方访问你的敏感数据。

## 浏览器兼容性
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1562833430187.png)

# PWA的实现
从技术层面来说，pwa应实现以下功能：
- 离线可访问
- 可以从桌面图标进入
- 可以实现用户推送

## 离线缓存 sevice worker
sevice worker是由js编写，运行在应用程序和浏览器之间的代理服务器，给 web 应用提供高级的可持续的后台处理能力。
它能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。

具体的sevice worker教程，可以参考我们之前的文章
[每天一点网站优化之：前端静态资源缓存 sevice worker](http://www.bingshangroup.com/blog/2019/06/28/carry/%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E7%BC%93%E5%AD%98%E4%B9%8Bservice%20worker/#more)

通过在sevice worker中设置资源的离线缓存规则，可以为web应用提供离线访问的能力。

注意：pwa要求web应用必须要有离线访问能力。

## 将站点添加到主屏幕
允许将站点添加至主屏幕，是 PWA 提供的一项重要功能。虽然目前部分浏览器已经支持向主屏幕添加网页快捷方式以方便用户快速打开站点，但是 PWA 添加到主屏幕的不仅仅是一个网页快捷方式，
它将提供更多的功能，更多的样式，让 PWA 具有更加原生的体验。
PWA 添加至桌面的功能实现依赖于 manifest.json，可以通过manifest.json文件配置应用的图标，名称等信息。

### 实现
1. 向项目目录中添加 manifest.json
```javascript
// manifest.json文件配置
{
    "short_name": "短名称",
    "name": "这是一个完整名称", //定义名称
    "icons": [ //自定义图标
        {
            "src": "love0.png",
            "type": "image/png",
            "sizes": "48x48"
        },
        {
            "src": "love.png",
            "type": "image/png",
            "sizes": "144x144"
        }
    ],
    "start_url": "index.html", //指定应用打开的url
    "display": "fullscreen", //应用打开的展示窗口样式
    "theme_color": "#ff4c43" //配置应用打开后窗口的颜色
}
```
2. 在项目首页引入 manifest.json 文件
```html
<link rel="manifest" href="manifest.json">
```
3. 打开网站并安装
pwa在pc端需要用户手动安装
此处以 mac os系统chrome浏览器举例
首先需要开启chrome浏览器的允许安装pwa功能
在地址栏输入 chrome://flags ，将Desktop PWAs 设置为Enabled并重启浏览器

打开web页，如果这个web页面支持pwa，则可以通过浏览器右上角的更多安装应用
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1562855421638.png)
浏览器弹出是否安装应用确认框，点击确认
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1562855385694.png)
安装成功后，就可以在应用程序中看到我们的pwa入口
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1562855086981.png)
点击pwa入口进入,没有tab标签和地址栏，但可以实现打开控制台，调试js等功能
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1562856113725.png)

manifest.json文件写定的规则一旦安装，就会一直生效，如果想要修改manifest信息并生效，需要卸载旧的应用程序并重新安装。
可以在pwa中点击右上角三个点选择卸载，或者是在文件夹中直接删除应用。


## 消息推送与提醒
pwa的推送功能通过Push API 和 Notifications API 实现，其中 PUSH API负责消息推送，
Notification API负责展示提醒。
### 消息推送
web push 的原理
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1562909689298.png)
上面的原理图中有一个重要角色：push Service，你可以认为它是一个第三方的推送服务器，web 推送的消息必须通过
push Service转发。google和FireFox都有自己的 pushService，但他们遵循同一套push协议规则。

push Service可以在用户离线时保存消息队列，在上线后统一发送。并且，Push Service会为每个发起订阅的浏览器生成一个唯一的URL，
这样，我们在服务端推送消息时，向这个URL进行推送后，Push Service就会知道要通知哪个浏览器，保存url信息的字段是endpoint.

1. Subscribe：浏览器（客户端）需要向Push Service发起订阅（subscribe），订阅后会得到一个PushSubscription对象
2. Monitor：订阅操作会和Push Service进行通信，生成相应的订阅信息，Push Service会维护相应信息，并基于此保持与客户端的联系
3. Distribute Push Resource：浏览器订阅完成后，会获取订阅的相关信息（存在于PushSubscription对象中），
我们需要将这些信息发送到自己的服务端，在服务端进行保存。
4. Push Message:服务端把消息发送给push Service。
5. Push Message:push Service接收到推送消息，跟维护的订阅列表比对，把消息发送给指定的客户端

- google的push Service在国内不可用，所以以下我们用firefox举例
### 发起订阅和保存订阅信息
```javascript
// 注册sevice worker
if ('serviceWorker' in navigator) {
    var publicKey = 'BOEQSjdhorIf8M0XFNlwohK3sTzO9iJwvbYU-fuXRF0tvRpPPMGO6d_gJC_pUQwBT7wD8rKutpNTFHOHN3VqJ0A';
    registerServiceWorker()
        .then(registration => {
            console.log('ServiceWorker 注册成功！作用域为: ', registration.scope) 
            // 发起订阅 push sevice 给客户端返回唯一标识
            return subscribeUserToPush(registration, publicKey); 
        })
        .then(subscription => {
            var body = {subscription: subscription};
            // 将生成的客户端订阅信息存储在自己的服务器上
            return sendSubscriptionToServer(JSON.stringify(body));
        })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err)
        });
}
// 注册
function registerServiceWorker() {
    return navigator.serviceWorker.register('sw.js', {scope: '/'});
}

// 发起订阅
function subscribeUserToPush(registration, publicKey) {
    var subscribeOptions = {
        userVisibleOnly: true,  //推送是否需要显性发送给用户
        applicationServerKey: publicKey 
    }; 
    return registration.pushManager.subscribe(subscribeOptions).then(function (pushSubscription) {
        console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
        return pushSubscription;
    });
}
```
- publicKey是为了保证安全推送，保存在客户端。
- 客户端通过registration.pushManager.subscribepush方法调用 push 服务器，同时在参数中带上了推送的设置和公钥，
随后push服务器将订阅信息公钥加密处理之后返回到客户端
- 客户端将加密过的订阅信息 subscription 发送到自己的服务器存储, 服务器必须使用 subscription 才能给客户端推送。

### 发送推送
服务端代码：
```javascript
const webpush = require('web-push');

// pwa推送信息
const pushMessage = async (ctx) => {
	/**
	 * VAPID值
	 * 这里可以替换为你业务中实际的值
	 */
	const vapidKeys = {
	    publicKey: 'BOEQSjdhorIf8M0XFNlwohK3sTzO9iJwvbYU-fuXRF0tvRpPPMGO6d_gJC_pUQwBT7wD8rKutpNTFHOHN3VqJ0A',
	    privateKey: 'TVe_nJlciDOn130gFyFYP8UiGxxWd3QdH6C5axXpSgM'
	};

	// 设置web-push的VAPID值
	webpush.setVapidDetails(
	    'mailto:xxx@qq.com',
	    vapidKeys.publicKey,
	    vapidKeys.privateKey
	);

	 // 需要推送的客户端信息，此处可以根据业务场景从数据库中获取
	let subscription = {
		 	endpoint:'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABdJ-rl96NWkfof3N3cHVJ0vO2-i_9K5eg2WoS9XumIJyYSp-Eeu2MpEV0qoisZipI2mbsYRvceM7F_62QJ0hjsAES8qGflnMmkB_UZjzIi8dI5SGIGrCh2RPurGdrdVL4o9yVo6dx8RfI6MHIqNyaqxYTOC_jH61EtSP9inn_eYdMRw3c',
		 	keys:{
		 		auth:'ehJWs1HwbokEKzf7VDhORQ',
		 		p256dh:'BBNLr0Qjib3QOHN2sFnjWR9Xtcm0kGSzDbqyh7FoXBalUD_yqRBCgBa8oXYIRL_vhdTW5x0hNI_vc_noT_1ekPc'
		 	}
		},
		data = {
			title : '我是通知标题',
		  	body : 'We have received a push message.',
		  	icon : 'love.png',
		  	tag : 'simple-push-demo-notification-tag'
		}

	webpush.sendNotification(subscription, data).then(data => {
        console.log('push service的相应数据:', JSON.stringify(data));
        ctx.body = {
			success:true,
			message:'推送消息成功！'
		}
        return;
    }).catch(err => {
        // 判断状态码，440和410表示失效
        if (err.statusCode === 410 || err.statusCode === 404) {
            console.log('该subscription已失效');
        }
        else {
            console.log(err);
        }
    })
}
```
- 服务端存储 privateKey , 与客户端发送订阅时的 publicKey一一对应，这样就可以保证其他服务器即使得到了subscription，
也不能随意向客户端推送消息。
- 发送推送依赖web push库，可以通过 npm install web-push 的方式安装
- 调用 webpush.sendNotification 方法并传入唯一标识信息 subscription 就可以向指定的客户端发送推送消息

### 接收推送消息并显示
notification负责把消息从sw传递给客户端
```javascript
// sw.js文件
self.addEventListener('push', function(event) {
    var 
  var body = 'We have received a push message.'; //吐送内容
  var icon = '/love.png'; //显示在推送上的图标
  var tag = 'simple-push-demo-notification-tag'; //string类型，tag相同的推送将自动覆盖，防止推送消息太多导致的用户体验差
  var data = {
    doge: {
        wow: 'such amaze notification data'
    }
  };
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag,
      data: data
    })
  );
});
self.addEventListener('notificationclick', event => {
    console.log('用户点击了推送消息')
});
```
- registration.showNotification 负责展示推送消息
- 不同的系统会有不同的推送样式
- 用户点击推送消息可以被 notificationclick 监听到，可以根据业务场景为点击事件增加不同的行为
用postMan调用pushMessage接口，结果如下：
![image](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1562912837158.png)

