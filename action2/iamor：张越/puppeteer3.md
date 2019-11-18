---
title: 万物皆可爬-puppeteer
date: 2019-09-16 16:30:00
tags: 
  - 爬虫
  - Node
categories: 
  - Node
---

puppeteer 是一个Chrome官方出品的headless Chrome node库。它提供了一系列的API, 可以在无UI的情况下调用Chrome的功能, 适用于爬虫、自动化处理等各种场景

<!--more-->

# puppteer

puppeteer 是一个Chrome官方出品的headless Chrome node库(没有图形用户界面的的web浏览器)。它提供了一系列的API, 可以在无UI的情况下调用Chrome的功能, 适用于爬虫、自动化处理等各种场景

可以用它来干什么？

- 生成页面截图和PDF
- 自动化表单提交、UI 测试、键盘输入等
- 创建一个最新的自动化测试环境。使用最新的 JavaScript 和浏览器功能，可以直接在最新版本的 Chrome 中运行测试。
- 爬取 SPA 页面并进行预渲染(即'SSR')
- ...

## 和cheerio的区别

- cheerio - 这货说白了就是累死jq语法操作的html文档库，只能爬取静态的html，无法获取ajax数据，一般都axios+cherrio结合使用
- puppteer - 能够模拟浏览器运行环境，能够请求网站信息。能够进行模拟操作(点击/滑动/hover等)，甚至能注入node脚本到浏览器内部环境运行


## puppteer架构图

![](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/v2-05af47562862229bcfd7263b13f362ee_hd.jpg)

- Puppeteer - 通过 devTools 与 browser 通信
- Browser -  一个可以拥有多个页面的浏览器(chroium)实例
- Page -  至少含有一个 Frame 的页面
- Frame -  至少还有一个用于执行 javascript 的执行环境，也可以拓展多个执行环境


# 轻松入门

```

const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(targetUrl);
  await page.screenshot({path: 'example.png'});
  await browser.close();
})();

```

## 分析代码

1.引入puppeteer
 ```
  const puppeteer = require('puppeteer');
  
```

2.生成实例

也就是通过Puppeteer启动一个浏览器环境

```
const browser = await puppeteer.launch(options);
```

options: 

 - executablePath: puppeteer.executablePath() - 获取默认可执行的chrome位置
 - headless: false - 是否开启headless模式
 - slowMo: 250 - 该选项会是puppeteer操作减慢指定的毫秒数
 - devtools: true - 在应用程序代码浏览器中使用调试器
 - defaultViewport<object> - 默认800 x 600
    - width<number>
    - height<number>
    - deviceScaleFactor<number> - 比例因子
    - isMobile<boolean> - 是否考虑meta viewport 标签， 默认为false
    - hasTouch<boolean> - 指定viewport是否支持触摸事件，默认为false
    - isLandscape<boolean> - 指定之口是否处于横向模式
 - 更多参数请参照[Puppeteer.launch()](https://github.com/GoogleChrome/puppeteer/blob/v1.20.0/docs/api.md#puppeteerlaunchoptions)    

3.打开一个新页面

```angular2html
const page = await browser.newPage();

```

4.前往目标页面

```angular2html
await page.goto(targetUrl);

```
注意： 这里可接受第二个参数，是个对象，用来进行一些简单的配置，带选项有


waitUntil: 
- load - 请求到数据后立即返回
- domcontentloaded - dom加载完成后返回
- networkidle0 - 没有超过0个网络连接500ms后返回
- networkidle2 - 没有超过2个网络连接500ms后返回

timeout: 跳转等待时间，单位是毫秒, 默认是30秒, 传 0 表示无限等待,可以通过page.setDefaultNavigationTimeout(timeout)方法修改默认值

referer<string>(不常用): 引用页头的值。如果提供，它将优先于page.setExtraHTTPHeaders()设置的referer头值(Referer header value. If provided it will take preference over the referer header value set by page.setExtraHTTPHeaders().)


5.关闭浏览器
```
 browser.close();
```
 
 
# 花里胡哨

其实轻松入门节已经将我们常用的功能进行了相对完善的描述，总结一下，爬一个网页需要几步

1. 打开浏览器
2. 爬
3. 关闭浏览器

是不是很简单？问题来了？怎么爬？会不会用jq？
- 
**会用jq你就会用爬虫！**
- 


找到一个自己喜欢的视频网站，（以下内容仅供教学！）

```
const demo = async () => {
  const browser = await (puppeteer.launch({
    executablePath: puppeteer.executablePath(),
    headless: false
  }))
  var arr = []
  for (let i = 1; i <= 40; i++) {
    console.log('正在抓取全职高手第' + i + '集')
    const targetUrl = `https://goudaitv1.com/play/78727-4-${i}.html`
    console.log(targetUrl)
    const page = await browser.newPage()
    await page.goto(targetUrl, {
      timeout: 0,
      waitUntil: 'domcontentloaded'
    })
    const baseNode = '.row'
    const movieList = await page.evaluate((sel) => {
      var stream = Array.from($(sel).find('iframe#Player').attr('src'))
      stream && (stream = stream.join(''))
      return stream
    }, baseNode)
    arr.push(movieList)
    page.close()
  }
  console.log(arr)
  browser.close()
}
```

我们发现了一个上述没有讲到的api - page.evaluate（）它是干什么的？

## page.evaluate(pageFunction[, ...args])

- pageFunction <function|string> 要在页面实例上下文中执行的方法
- ...args 要传给 pageFunction 的参数
- 返回: <Promise> pageFunction执行的结果

如果pageFunction返回的是Promise，page.evaluate将等待promise完成，并返回其返回值。

如果pageFunction返回的是不能序列化的值，将返回undefined

给pageFunction传参数示例：


```
const result = await page.evaluate(x => {
  return Promise.resolve(8 * x);
}, 7); // （注： 7 可以是你自己代码里任意方式得到的值）
console.log(result); // 输出 "56"
```

也可以传入一个字符串

```
console.log(await page.evaluate('1 + 2')); // 输出 "3"
const x = 10;
console.log(await page.evaluate(`1 + ${x}`)); // 输出 "11"
```


## 存入数据库

搞定！你可以用这些数据做自己想做的一切，比如


![](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1568603775944)

![](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1568603881148)


# 最后

当然，'爬'只是它的冰山一角，上述demo比较偷懒的直接获取了<a>标签的地址进行跳转，我们还可以使用点击事件进行页面跳转，感兴趣的可以试试。


## page.click(selector[, options])

- selector <string> 要点击的元素的选择器。 如果有多个匹配的元素, 点击第一个。
- options <Object>
  - button <string> left, right, 或者 middle, 默认是 left。
  - clickCount <number> 默认是 1. 查看 UIEvent.detail。
  - delay <number> mousedown 和 mouseup 之间停留的时间，单位是毫秒。默认是0
- 返回: <Promise> Promise对象，匹配的元素被点击。 如果没有元素被点击，Promise对象将被rejected。


此方法找到一个匹配 selector 选择器的元素，如果需要会把此元素滚动到可视，然后通过 page.mouse 点击它。 如果选择器没有匹配任何元素，此方法将会报错。

要注意如果 click() 触发了一个跳转，会有一个独立的 page.waitForNavigation() Promise对象需要等待。 正确的等待点击后的跳转是这样的：


```

const [response] = await Promise.all([
  page.waitForNavigation(waitOptions),
  page.click(selector, clickOptions),
]);

```


- page.waitForNavigation([options])

此方法在页面跳转到一个新地址或重新加载时解析，如果你的代码会间接引起页面跳转，这个方法比较有用。

更多参照[page.waitForNavigation([options])](https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v1.20.0&show=api-pagewaitfornavigationoptions)

# 参考

[Puppeteer 中文网](https://zhaoqize.github.io/puppeteer-api-zh_CN/)

[Puppeteer npm](https://www.npmjs.com/package/puppeteer)

