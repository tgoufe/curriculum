
# 万物皆可爬-puppeteer进阶
# 开始前

上篇文章，讲解了如何快速使用puppeteer爬取一个简单的视频网站，但是，逻辑比较简单，投机取巧，直接利用详情页分页的逻辑爬取电视剧，但是这样只能爬取
某一部电视剧，电影。这样比较烦。想做自己的视频网站还是有点鸡肋。当然还有一个棘手的问题，如果详情页有**token**验证怎么办。

> 本文涉及相关仅供学习交流，侵联改

## 内容预告

本文就这几个问题进行解答：
1. 一键爬取某视频网站全部电影/电视剧
2. 自动填充基础表单
3. page.click()


# 视频站

梳理一下爬取视频网站需要干那些事：

1. 找到一个你喜欢的网站
2. 爬取列表页 - 获取每个视频的详情页地址（注意：一般的列表页都有分页）
3. 跳转至详情页
4. 获取视频播放地址 - 如果还需要选择资源则再进行一次跳转
5. 关闭详情页


重复 3 ～ 5，待当前列表页所有内容爬取后，跳转至列表第二页，以此类推，等全部列表页爬取完毕后关闭浏览器。

知道步骤后，那么开始吧

## 找到网站，分析它

> 为了避免广告的嫌疑，demo中的视频网址使用假地址，如果想要地址，请评论


![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1568859478148)

这是它的列表页，可以看出来，他是有分页的。有两种办法

1. 分析它的分页规则
2. 使用page.click()

先使用分析分页规则的方案实现

```
http://www.xxxxxxx.xx
http://www.xxxxxxx.xx/page/2
http://www.xxxxxxx.xx/page/3
...
```

它是什么规则不用多介绍了吧

## 开始爬

### 列表页

如果对puppeteer API 不熟悉的，请移步[万物皆可爬-puppeteer实战](https://juejin.im/post/5d81d5096fb9a06ae17dad87)

```
const findAllMovie = async () => {
  console.log('开始参观这个网站')
  const browser = await (puppeteer.launch({
    executablePath: puppeteer.executablePath(),
    headless: false
  }));
  /* @params 
   * pageSize：你想爬多少页
   */
  for (let i = 1; i <= pageSize; i++) {
    // 用来存爬到的详情页地址
    var arr = []
    const targetUrl = `https://www.xxxxxxx.xx/page/${i}`
    const page = await browser.newPage();
    // 进入页面
    await page.goto(targetUrl, {
      timeout: 0,
      waitUntil: 'domcontentloaded'
    });
    // 获取根节点
    const baseNode = 'ul#post_container'
    const movieList = await page.evaluate(sel => {
      const  movieBox = Array.from($(sel).find('li'))
      var ctn = movieBox.map(v => {
        const url = $(v).find('.article h2 a').attr('href');
        return {url: url}
      })
      return ctn
    }, baseNode)
    arr.push(...movieList)
    // 准备爬取详情页
    await detailMovie(arr, page)
  }
  browser.close();
  console.log('Visit Over')
  return {msg: '同步完成'}
}
```


### 详情页


```
const detailMovie = async (arr, page) => {
  var detailArr = []
  console.log('当页影片数：' + arr.length)
  for (let i = 0; i < arr.length; i++) {
    await page.goto(arr[i].url, {
      timeout: 0,
      waitUntil: 'domcontentloaded'
    })
    const baseNode = '.article_container.row.box' 
    // jq大法 不用过多说明了吧
    const movieList = await page.evaluate(sel => {
      const movieBox = Array.from($(sel).find('#post_content').find('p'))
      const urlBox = $(sel).find('#蓝光高清 td a').attr('href')
      var tmp = [{}]
      var ctn = tmp.map((v,i) => {
        const imgUrl = $(movieBox[0]).find('a').attr('href');
        var info = $(movieBox[1]).text()
        return {
          imgUrl: imgUrl,
          name: info,
          urlBox: urlBox
        }
      })
      return ctn
    }, baseNode)
    console.log(movieList)
    detailArr.push(...movieList)
    console.log('抓取第 ' +  detailArr.length + ' 页完成')
  }
  console.log('开始向数据库添加数据')
  await addMovie(detailArr)
  page.close()
  return detailArr
}

```

### 过程

![](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1568860333775)

![](http://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1568860681595)

感觉很爽有没有！


### 结果

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1568861126661)


自己的视频网站就建好了。


# Form

puppeteer 强大之处，他可以进行模拟操作，比如我们可以让它自己进行百度


## 实现

很简单，一个方法搞定

page.type(selector, text[, options])


- selector,要输入内容的元素选择器。如果有多个匹配的元素，输入到第一个匹配的元素
- text，要输入的内容
- options
  - delay 每个字符输入的延迟，单位是毫秒。默认是0
  
  
> 注意： 每个字符输入后都会触发keydown,keypress/input 和 keyup事件。 


```javascript

page.type('#mytextarea', 'Hello'); // 立即输入
page.type('#mytextarea', 'World', {delay: 100}); // 输入变慢，像一个用户

```


接下来打开百度试试


```javascript

const getForm = async () => {
  // puppteer 验证
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://baidu.com');
    await page.type('#kw', 'puppeteer', {delay: 100}); //打开百度后，自动在搜索框里慢慢输入puppeteer ,
  page.click('#su') //然后点击搜索
  await page.waitFor(1000);
  const targetLink = await page.evaluate(() => {

    let url =  document.querySelector('.result a').href

    return url
  });
  console.log(targetLink);
  await page.goto(targetLink);
// await page.waitFor(1000);
  browser.close();
}

```

上述的例子中，我们还使用的page.click方法。

page.click(selector, [options])

- selector: 要点击的元素的选择器。 如果有多个匹配的元素, 点击第一个。
- options 
  - button: left,right或者middle
  - clickCount: 默认是1
  - delay : mousedown 和 mouseup 之间停留的时间，单位是毫秒。默认是0
  
  
此方法找到一个匹配 selector 选择器的元素，如果需要会把此元素滚动到可视，然后通过 page.mouse 点击它。 如果选择器没有匹配任何元素，此方法将会报错。

要注意如果 click() 触发了一个跳转，会有一个独立的 page.waitForNavigation() Promise对象需要等待。 正确的等待点击后的跳转是这样的：

```javascript
const [response] = await Promise.all([
  page.waitForNavigation(waitOptions),
  page.click(selector, clickOptions),
]);
```


# 简单滑块验证码破解 + 模拟手机


## 步骤

1. 找到滑块
2. 计算滑块位置
3. 分发事件
4. 拖动
5. 松手


## 实现

难点剖析

### 生成一个模拟器

```javascript

 const devices = require('puppeteer/DeviceDescriptors');
 const iPhone6 = devices['iPhone 6'];
 await page.emulate(iPhone6)

```

### 完整版

```javascript
const getYzm = async () => {
  const devices = require('puppeteer/DeviceDescriptors');
  const iPhone6 = devices['iPhone 6'];
  const conf = {
    headless: false,
    defaultViewport: {
      width: 1300,
      height: 900
    },
    slowMo: 30
  }
  puppeteer.launch(conf).then(async browser => {
    var page = await browser.newPage()
    await page.emulate(iPhone6)
    await page.goto('https://www.dingtalk.com/oasite/register_h5_new.htm')
//     滑动验证码会检测nabigator.webdriver这个属性。因此我们需要在滑动前将这个属性设置为false
//    接口的webdriver只读属性navigator指示用户代理是否由自动化控制。
    await page.evaluate(async () => {
      Object.defineProperty(navigator, 'webdriver', {get: () => false})
    })
    // 错误输入，触发验证码
    await page.type('#mobileReal', '15724564118')
    await page.click('.am-button')
    await page.type('#mobileReal', '')
    await page.keyboard.press('Backspace')
    await page.click('._2q5FIy80')
    // 等待滑块出现
    var slide_btn = await page.waitForSelector('#nc_1_n1t', {timeout: 30000})
    // 计算滑块距离
    const rect = await page.evaluate((slide_btn) => {
//      返回元素的大小及其相对于视口的位置
      const {top, left, bottom, right} = slide_btn.getBoundingClientRect();
      return {top, left, bottom, right}
    }, slide_btn)
    console.log(rect)
    rect.left = rect.left + 10
    rect.top = rect.top + 10
    const mouse = page.mouse
    await mouse.move(rect.left, rect.top)
    // touchevent,而puppeteer只有mouseevent。因此需要通过某个方法，在滑动前先将事件传递出去。
    await page.touchscreen.tap(rect.left, rect.top) // h5需要手动分发事件 模拟app的事件分发机制。
    await mouse.down()
    var start_time = new Date().getTime()
    await mouse.move(rect.left + 800, rect.top, {steps: 25})
    await page.touchscreen.tap(rect.left + 800, rect.top,)
    console.log(new Date().getTime() - start_time)
    await mouse.up()
    console.log(await page.evaluate('navigator.webdriver'))
    console.log('end')
    // await page.close()
  })
}
```



