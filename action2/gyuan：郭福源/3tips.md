# 只要一行代码——三个前端开发实用技巧

>有关于原生HTML/CSS的三个容易被忽略的实用技巧



没有任何依赖，兼容性良好，适用性优异。



## 一、<a>标签打开与刷新页面

`<a>`标签作为常用标签，当跳转链接时，常用属性`target`，

- _self：默认值。在相同的框架或窗口中载入目标文档。即当前；
- _blank：在一个新的未命名的窗口载入文档。即新开窗口；
- _parent：把文档载入父窗口或包含了超链接引用的框架的框架集，如果没有，则行为类似_self。即上级窗口中；
- _top：把文档载入包含该超链接的窗口,取代任何当前正在窗口中显示的框架。如果没有上下文环境，则行为类似_self。即顶级窗口中。



不过，`target`属性还有一个特征，**可以自定义内容或URL**。



举个栗子：

有4个`a`标签，跳转同一地址，但携带了不同的业务参数，不希望开过多的窗口，又不希望影响本页。

```html
<div>
    <a href="http://blank.html" target="_blank">默认无参数</a>
    <a href="http://blank.html?id=1" target="_blank">1参数</a>
    <a href="http://blank.html?id=22" target="_blank">2参数</a>
    <a href="http://blank.html?id=333" target="_blank">3参数</a>
</div>
```
**划重点：利用`target`的自定义内容，保证`tatget`值相同，就可以实现使用同一窗口**



代码：
```html
<div>
    <a href="http://blank.html" target="_link">默认无参数</a>
    <a href="http://blank.html?id=1" target="_link">1参数</a>
    <a href="http://blank.html?id=22" target="_link">2参数</a>
    <a href="http://blank.html?id=333" target="_link">3参数</a>
</div>
```



![栗子](https://upload-images.jianshu.io/upload_images/4128599-3536af6a5957159b.gif?imageMogr2/auto-orient/strip)



## 二、网页一键换肤优化实现

将一个网页的颜色相关一键切换



1. 常规操作：
```html
<head>
    <link href="red.css" rel="stylesheet" type="text/css">
</head>

<body>
    <div class="bg">

    <div>
        <input type="radio" id="red" name="col" value="red.css"><label for="red" style="background-color: red"></label>
        <input type="radio" id="blue" name="col" value="blue.css"><label for="blue" style="background-color: blue"></label>
        <input type="radio" id="yellow" name="col" value="yellow.css"><label for="yellow" style="background-color: yellow"></label>
    </div>
</body>
<script>
    let links = document.getElementsByTagName('link');
    links = [].slice.call(links);
    let elRadios = document.getElementsByTagName('input');
    let labels = document.getElementsByTagName('label');
    [].slice.call(elRadios).map((item, idx) => {
    	item.addEventListener('click', changeBg)
    })

    function changeBg() {
	    let labelDom = this.nextSibling;
	    let val = this.value;

    	[].slice.call(labels).map((item, idx) => {
    		item.className = '';
	        labels[idx].className = ''
	    });

	    labelDom.className = 'outline';
	    links[0].href = val

    }
</script>

```

划重点：
```javascript
    links[0].href = val
```


通过JS控制`<link>`标签的`href`属性切换引用的css文件

- 弊端：如果网站需要切换的内容过多，每次引用CSS的加载会有一定量的延时，不具有流畅感，交互体验较差。



2. 有趣的`title`属性
    在实现一键换肤的其他方法之前，要聊一下这个在`<link>`标签中的`title`属性。
```html
    <link href="red.css" rel="stylesheet" type="text/css" title="red">
```
- **当`<link>`标签具有`title`属性且有值时，`link`标签就变成一个可控制的特殊元素，即可以通过DOM对象的`disabled`属性控制`link`是否渲染。**

- 但是，在实测过程中，**除IE**外无论`link`标签是否具有`title`属性，都可以直接使用DOM对象的`disabled`属性，但`IE`确实需要`title`。

```javascript
    let links = document.getElementsByTagName('link');
    links = [].slice.call(links);
    links[0].disabled = true;
```

3. `alternate`备选
    在`<link>`标签中，`rel`属性有[很多值]([https://www.w3school.com.cn/tags/att_link_rel.asp](https://www.w3school.com.cn/tags/att_link_rel.asp))，常用的是`stylesheet`，但是还有一个`alternate`表示`当前文档的替代版本`，也就是**加载但不执行。**
```html
    <link href="red.css" rel="alternate stylesheet" type="text/css" title="红色">
```
利用这个特性，结合DOM对象的`disabled`属性，可以提前加载另一套`css`方案，解决交互性问题。代价是多一点点流量。（5G差这10kb?）（IE8也妥妥的）

4. 新方案
```html
<head>
    <link href="red.css" rel="alternate stylesheet" type="text/css" title="红色">
    <link href="blue.css" rel="alternate stylesheet" type="text/css" title="蓝色">
    <link href="yellow.css" rel="alternate stylesheet" type="text/css" title="黄色">
</head>


<body>
    <div class="bg">
        <div>
            <a href="http://blank.html" target="_link">默认无参数</a>
            <a href="http://blank.html?id=1" target="_link">1参数</a>
            <a href="http://blank.html?id=22" target="_link">2参数</a>
            <a href="http://blank.html?id=333" target="_link">3参数</a>
        </div>
    </div>

    <div>
        <input type="radio" id="red" name="col" value="red.css"><label for="red" style="background-color: red"></label>
        <input type="radio" id="blue" name="col" value="blue.css"><label for="blue" style="background-color: blue"></label>
        <input type="radio" id="yellow" name="col" value="yellow.css"><label for="yellow" style="background-color: yellow"></label>
    </div>
</body>

<script>
    let links = document.getElementsByTagName('link');
    links = [].slice.call(links);
    let elRadios = document.getElementsByTagName('input');
    let labels = document.getElementsByTagName('label');
    [].slice.call(elRadios).map((item, idx) => {
    	item.addEventListener('click', changeBg)
    })


    function changeBg() {
	    let labelDom = this.nextSibling;
	    let val = this.value;

    	[].slice.call(labels).map((item, idx) => {
    		item.className = '';
		    links[idx].disabled = true;
	        labels[idx].className = ''
	    });

	    labelDom.className = 'outline';
	    [].slice.call(links).map(item => {
	    	if (item.getAttribute('href') === val) item.disabled = false;
        })
    }
</script>
```
效果图：

![image](https://upload-images.jianshu.io/upload_images/4128599-2d636cd4f3a1ee04.gif?imageMogr2/auto-orient/strip)


## 三、CSS矢量图内联

在前端项目中，使用到的图标类大多会使用SVG来实现，静态文件的减少有利于性能的提升。
当然，可以用静态资源缓存[(blog链接)]([http://www.bingshangroup.com/blog2/action1/%E7%BD%91%E7%BB%9C/%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E7%BC%93%E5%AD%98.html#%E5%8F%91%E9%80%81http%E8%AF%B7%E6%B1%82%E6%97%B6%EF%BC%8C%E5%8F%91%E7%94%9F%E4%BA%86%E4%BB%80%E4%B9%88](http://www.bingshangroup.com/blog2/action1/%E7%BD%91%E7%BB%9C/%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E7%BC%93%E5%AD%98.html#%E5%8F%91%E9%80%81http%E8%AF%B7%E6%B1%82%E6%97%B6%EF%BC%8C%E5%8F%91%E7%94%9F%E4%BA%86%E4%BB%80%E4%B9%88))
**减少文件请求，高速渲染**，引用地址使用内联，即直接将SVG放入路径（不建议超级大图，会极大增加文件体积）。

1. 采用base64
```css
.icon {
    width: 20px; height: 20px;
    background:url(data:image/svg+xml;base64,................................);
}
```
base64的码就不粘了，太多了。
可以实现，但是有点问题：1. 无法直接修改；2. 语义化low到爆；3. 据说小程序不可用（未实测）

2. 采用`<svg>`标签直接内联

```css
.icon {
    background: url(background: url("data:image/svg+xml,%3Csvg height='512pt' viewBox='0 0 512 512' width='512pt' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m346 275.980469h-180c-11.046875 0-20-8.953125-20-20 0-11.042969 8.953125-20 20-20h180c11.046875 0 20 8.957031 20 20 0 11.046875-8.953125 20-20 20zm20-99.980469c0-11.046875-8.953125-20-20-20h-180c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20h180c11.046875 0 20-8.953125 20-20zm0 160c0-11.046875-8.953125-20-20-20h-180c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20h180c11.046875 0 20-8.953125 20-20zm22.460938 139.105469c9.449218-5.722657 12.46875-18.019531 6.746093-27.46875-5.726562-9.449219-18.023437-12.46875-27.46875-6.742188-33.59375 20.347657-72.234375 31.105469-111.738281 31.105469-119.101562 0-216-96.898438-216-216s96.898438-216 216-216 216 96.898438 216 216c0 42.589844-12.664062 84.042969-36.625 119.882812-6.140625 9.183594-3.671875 21.605469 5.507812 27.742188 9.1875 6.140625 21.605469 3.671875 27.742188-5.507812 28.378906-42.441407 43.375-91.585938 43.375-142.117188 0-68.378906-26.628906-132.667969-74.980469-181.019531-48.351562-48.351563-112.640625-74.980469-181.019531-74.980469s-132.667969 26.628906-181.019531 74.980469c-48.351563 48.351562-74.980469 112.640625-74.980469 181.019531s26.628906 132.667969 74.980469 181.019531c48.351562 48.351563 112.640625 74.980469 181.019531 74.980469 46.8125 0 92.617188-12.757812 132.460938-36.894531zm0 0'/%3E%3C/svg%3E") no-repeat center;
}
```

效果图：
![image](https://upload-images.jianshu.io/upload_images/4128599-250dcb188bffef5e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


在直接引入之前，需要对一些特殊符号进行转译`"`，`%`，`#`，`{`，`}`，`<`，`>`。（IE也兼容的！）

[张鑫旭大佬的转译工具]([https://www.zhangxinxu.com/sp/svgo/](https://www.zhangxinxu.com/sp/svgo/)
)

3. 使用外联链接的优势：
- 节约请求，都内联了自然没得请求；
- 无跨域问题，直接渲染；
- 迁移与引用，无静态文件；
- 缓存住CSS文件比缓存特性图片更舒心，毕竟万一图多还得用雪碧图挨个找。

-------------------

引用：

1. [https://www.zhangxinxu.com/](https://www.zhangxinxu.com/)