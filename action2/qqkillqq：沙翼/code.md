# 够用就好：提高工作效率的代码片段

我相信你一定遇到过在开发一些功能的时候可能被卡在某个功能函数上，当你遇到这些问题的时候你可能会花上很多时间去百度Google，或者直接引入一个第三方库，可是搜索的结果不知道靠不靠谱，会不会有坑（没考虑全面的地方），如果直接引入库，你又在纠结是不是会导致文件过大。

网络上有很多代码片段的文章，比如非常著名的[30秒](https://github.com/30-seconds/30-seconds-of-code)，但是很多内容包含了过于简单的代码，或者在实际需求中用不上的代码，亦或是有些代码没有说明存在的问题。

下面列举了一些我常用的代码片段，它们并不完美，但是短小精炼，并且能解决你80%以上的需求，对于不能处理的问题和可能用到的场景我会做说明。

PS：由于是自用片段，为了简短，大量使用了拓展运算，三目运算，箭头函数并省略了所有能省略的return，这可能导致有些代码看起来不易理解，你可以自行转换成if语句或者带有return的函数来帮助你理解，

## 节流防抖

最简单的防抖和定时器节流，平常优化个页面滚动缩放，文本框输入完全够用，比较大的问题是从事件触发到函数相应存在一个时间差，就是你设置的那个延迟时间，如果没有这方面的需求直接用下面这个短的就可以了。

```javascript
const debounce = (func,wait = 50)=> {
  let timer = null;
  return function(...args){
    if(timer) clearTimeout(timer);
    timer = setTimeout(()=>func.apply(this,args),wait);
  }
}
const throttle = (func,wait = 50)=> {
    let timer = null;
    return function (...args) {
        if(!timer){
            timer = setTimeout(()=>{
                func.apply(this,args);
                timer = null;
            },wait);
        }
    }
}
```

如果你需要控制的比较精细，比如是否在开始时立即执行，是否在结束后再次调用，那么可以使用下面这个版本

- leading : Boolean 是否使用第一次执行
- trailing : Boolean 是否使用停止触发的回调执行

```javascript
const throttle = (func,wait = 50,opts = {})=>{
  let preTime = 0,timer = null,{ leading = true, trailing = true } = opts;
  let throttled function (...args) {
    let now = Date.now();
    if(!leading && !preTime)preTime = now;
    if(now - preTime >= wait || preTime > now){
      if(timer){
        clearTimeout(timer);
        timer = null;
      }
      preTime = now;
      func.apply(this,args);
    }else if(!timer && trailing){
      timer = setTimeout(()=>{
        preTime = Date.now();
        timer = null;
        func.apply(this,args)
      },wait - now + preTime);
    }
  }
  throttled.cancel = ()=> {
    clearTimeout(timer);
    timer = null;
    preTime = 0;
	};
  return throttled;
}
const debounce = (func,wait = 50,opts = {})=> {
  let timer = null,result,{leading = false}=opts;
  let debounced function(...args){
    if(timer) clearTimeout(timer);
    if(leading){
      let callNow = !timer;
      timer = setTimeout(()=>timer = null,wait);
      if(callNow) result = func.apply(this,args);
    }else{
      timer = setTimeout(()=>func.apply(this,args),wait);
    }
    return result;
  }
  debounced.cancel = ()=>{
    clearTimeout(timer);
    timer = null;
  };
  return debounced
}
```

节流防抖的功能和用途就不说了，上面的版本存在的问题是没有加入最大等待时间的控制，因为几乎用不上。

## 深拷贝

```javascript
const clone=(target, map = new WeakMap())=>{
    if (typeof target === 'object') {
        const isArray = Array.isArray(target);
        let cloneTarget = isArray ? [] : {};
        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);
        const keys = isArray ? undefined : Object.keys(target);
        forEach(keys || target, (value, key) => {
            if (keys) key = value;
            cloneTarget[key] = clone2(target[key], map);
        });
        return cloneTarget;
    }
    return target;
}
```

功能：对三种最常见的需求做处理

1. 能够实现数组和对象的深拷贝
2. 能够处理基础数据类型
3. 能够处理循环引用，并触发内存回收

不足：

1. 无法处理一些常见对象，如Date Error Function等
2. 无法处理Map Set等对象
3. 无法处理Symbol类型的数据
4. 无法处理DOM节点的拷贝
5. 。。。

提示：老司机都知道，完整的深拷贝只有在面试中会遇到，实际项目中90%你只会用到普通对象的深拷贝，甚至连循环引用都很少。

## 单次执行函数

只能执行一次的函数，之后再调用这个函数，将返回一次最后调用fn的结果

```javascript
const once =(fn,rs,n=2)=>(...args)=>(--n>0? rs=fn.apply(this,args): fn = undefined,rs)
```

## N次执行函数

调用次数不超过 `n` 次。 之后再调用这个函数，将返回一次最后调用fn的结果

```javascript
const before = (n,fn,rs)=>(...args)=>(--n>0? rs=fn.apply(this,args): fn = undefined,rs)
```

特别备注：上面的写法其实是不安全的，完全是为了简单而把变量写进参数，这在你意外多传参数的时候可能会对外部变量产生影响，除非你在使用时非常明确的知道其影响，否则请使用下面的形式。

```javascript
const before=(n, fn)=>{
  let rs;
  return function() {
    --n>0
      ? rs=fn.apply(this, arguments)
			: fn = undefined
    return rs;
  };
}
const once=(fn)=>before(2,fn)
```

## 执行N次函数

我非常喜欢用于测试数据时的一个方法

```javascript
const times = (num,fn=i=>i) =>Array.from({ length: num }).reduce((rs, _, index) =>rs.concat(fn(index)), []);
//times(5) => [0,1,2,3,4]
//times(5,i=>`user${i}`) => [ 'user0', 'user1', 'user2', 'user3', 'user4' ]
```

## get

你肯定遇到过访问对象属性的时候报错的情况，使用下面的get函数可以帮助你更安全的访问对象属性。

```javascript
const get= (obj,path,rs) => path.replace(/\[([^\[\]]*)\]/g, '.$1.').split('.').filter(t => t !== '').reduce((a,b) => a&&a[b],obj);
//get({a:[1,2,{b:3}]},'a[2].b.user.age') ==>undefined
```

如果你想了解更多安全访问数组的方法的话可以查看这里---[灵犀一指](https://mp.weixin.qq.com/s/CNeugygWhAs6tp0soI-WNQ)

## 拓展数组方法到对象

数组的every，some，filter，forEach，map是开发中的利器，但遗憾的是只能对数组使用，lodash等工具函数提供了同名的方法可以同时作用于数组和对象，你可以使用下面的拓展函数把这些方法拓展到其他对象上，默认拓展到Object的原型上，可以像数组一样直接使用，如果拓展到其他对象上，可以像lodash一样将目标对象作为第一个参数，回调函数作为第二个参数使用。

```javascript
const extendATO=(nameSpace=Object.prototype)=>{
  ['every','some','filter','forEach','map'].forEach(methodName=>{
    nameSpace[methodName]=function(...args){
      let fn=args[nameSpace===Object.prototype?0:1]
      let obj=nameSpace===Object.prototype?this:args[0]
      let values=Object.values(obj)
      let keys=Object.keys(obj)
      return keys[methodName](function(value,index,obj){
        return fn(values[index],keys[index],obj)
      })
    }
  })
}
//extendATO()
//({a:1,b:2,c:0}).every(value=>value) => false
//({a:1,b:2,c:0}).map((value,key)=>key+1) => ['a1','b1','c1']
//let _={}
//extendATO(_)
//_.map({a:1,b:2},value=>value+1) =>[2,3]
```

## 数组的扁平化

正常的递归

```javascript
const flatten = (list) => list.reduce((acc, value) => acc.concat(value), []);
```

比较骚但是效率奇高的操作

```javascript
const flatten = (list) =>JSON.parse(`[${JSON.stringify(list).replace(/\[|\]/g, '')}]`);
```

注：此方法无法处理null，undefined和循环引用等问题，更多数组扁平化的操作可以看这里--[大力金刚掌](https://mp.weixin.qq.com/s/_GQadYarAC4MmmtRyl11xw)

## 类型判断

```javascript
const is=(type,obj)=>new RegExp(type,'i').test(Object.prototype.toString.call(obj).slice(8,-1))
//is('string','sdfsdfds') => true
//is('array',[]) =>true
//is('array|number',5) =>true 
```

## 中序遍历二叉树

```javascript
const inorderTraversal=root=>(root===null)?[...inorderTraversal(root.left),root.value,...inorderTraversal(root.right)]:[]
```

## 数组所有的组合

两种类似的思路，不同的写法，返回不同的排列方式，你可以选择你喜欢的

```javascript
const powerset = (arr=[]) =>arr.reduce((rs, item) => rs.concat(rs.map(r => [item].concat(r))), [[]])
const powerset2=(arr=[])=>arr.reduce((rs,item)=>[...rs,...rs.slice().map(i=>i.concat(item)),[item]],[])
//powerset([1,2,3]) =>[ [], [ 1 ], [ 2 ], [ 2, 1 ], [ 3 ], [ 3, 1 ], [ 3, 2 ], [ 3, 2, 1 ] ]
//powerset2([1,2,3]) =>[ [ 1 ], [ 1, 2 ], [ 2 ], [ 1, 3 ], [ 1, 2, 3 ], [ 2, 3 ], [ 3 ] ]
```

## 多个数组的交叉组合

通常你在网上看到的是两个数组的交叉组合，但是实际项目中更多的是多个数组的交叉组合，如果你在做SKU或者商品组合的需求的时候可能会急需下面这个方法

```javascript
const xprod=(...lists)=>lists.reduce((rs,arrItem)=>rs.length
  ? rs.reduce((acc,item)=>arrItem.reduce((acc,value)=>acc.concat([[...item,value]]),acc),[])
  : arrItem,[''])
//xprod(['red','blue'],['36','37','38'],['男','女'])
[ [ 'red', '36', '男' ],
  [ 'red', '36', '女' ],
  [ 'red', '37', '男' ],
  [ 'red', '37', '女' ],
  [ 'red', '38', '男' ],
  [ 'red', '38', '女' ],
  [ 'blue', '36', '男' ],
  [ 'blue', '36', '女' ],
  [ 'blue', '37', '男' ],
  [ 'blue', '37', '女' ],
  [ 'blue', '38', '男' ],
  [ 'blue', '38', '女' ] ]
```

## 全排列

```javascript
const permutations = arr => {
  if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
  return arr.reduce(
    (acc, item, i) =>
      acc.concat(
        permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [item, ...val])
      ),
    []
  );
};
//permutations([1,2,3]) => [ [ 2, 3, 1 ],[ 3, 2, 1 ],[ 1, 3, 2 ],[ 3, 1, 2 ],[ 1, 2, 3 ],[ 2, 1, 3 ] ]
```

另一种常见的全排列是给定一个字符串，然后进行全拍列，对上面的函数稍加改造就可以了

```javascript
const stringPermutations = str => {
  if (str.length <= 2) return str.length === 2 ? [str, str[1] + str[0]] : [str];
  return str.split('').reduce((acc, letter, i) =>
    acc.concat(stringPermutations(str.slice(0, i) + str.slice(i + 1)).map(val => letter + val)), []);
};
//stringPermutations('abc') => [ 'abc', 'acb', 'bac', 'bca', 'cab', 'cba' ]
```

## 分组计算

```javascript
const groupBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val, i) => {
    acc[val] = (acc[val] || []).concat(arr[i]);
    return acc;
  }, {});
const countBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
```

## “真正”的数组乱序

是不是每次数组乱序你用的都是Math.random()-.5，其实这个并不是真正的随机，如果你要用这样的算法做个年会抽奖程序，可能会在一帮屌丝现场review代码的时候被打死，试试Fisher–Yates随机。

```javascript
const shuffle=(arr)=>{
  let len=arr.length;
  while (len){
    let index = Math.floor(Math.random() * len--);
    [arr[index],arr[len]]=[arr[len],arr[index]]
  }
  return arr;
}
```

注：严格意义上讲，没有绝对的随机，我们只要保证所有组合出现的频率差别不大就可以了。如果你需要了解随机算法更详细的知识可以看我之前的讲解--[洗牌算法和随机排序](https://mp.weixin.qq.com/s/KCVwLMZYurlkeT1PJzY4Kw)

## 限定范围随机数

```javascript
const range = (min, max) => Math.random() * (max - min) + min;
```

如果需要随机整数可以再Math.floor一下或者像下面这样再封装一下

```javascript
const rangeInt=(min,max)=>Math.floor(range(min,max))
```

## 随机颜色

```javascript
const randomHex=()=>'#'+Math.random().toString(16).slice(2,8)
```

注：大约有100亿分之一的概率会出错，建议监控一下这方法，出错的时候买张彩票。

## 颜色互转

```javascript
const rgbToHex = (r, g, b) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
const hexToRgb=(hex)=>{
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return [r,g,b]
}
```

注：输入和输出都是不带#的

## includes

这是一个小技巧，使用~可以减少if中对-1的判断，相比if(index!==-1)我更喜欢写成if(~index)，其实就是因为懒

```javascript
const includes=(target,value)=>!!~target.indexOf(value)
```

## 管道函数

使用reduce或reduceRight实现正向（pipe）或者逆向（compose）的管道函数

```javascript
const pipe = (...functions) => (initialValue) =>
  functions.reduce((value, fn) => fn(value), initialValue);

const compose = (...functions) => (initialValue) =>
  functions.reduceRight((value, fn) => fn(value), initialValue);
```

合理的使用管道函数可以极大的提升开发效率和并精简代码

## 柯里化

```javascript
const curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length
    ? fn(...args)
    : curry.bind(null, fn, arity, ...args);
const uncurry = (fn, n = 1) => (...args) => {
  const next = acc => args => args.reduce((x, y) => x(y), acc);
  if (n > args.length) throw new RangeError('Arguments too few!');
  return next(fn)(args.slice(0, n));
};
```

## 计算所有位数之和

大多数人下意识的想法应该是进行逐位累加，但是其实有更好的方式

```javascript
const rootSum = (n)=>(n-1)%9+1
```

## 数字前置填充0

很多的数据展示需要保持数字的位数相同，不足的时候在前面填充0

```javascript
const fill0=(value,len=1)=>(Array(len).join(0)+value).slice(-Math.max(len,value.toString().length))
```

为什么不用padStart?因为只是给你提供个思路，用也行。

```javascript
const fill0=(value,len)=>`${value}`.padStart(len,0)
```

## url参数互转

```javascript
const objectToQueryString = queryParameters => {
  return queryParameters
    ? Object.entries(queryParameters).reduce((queryString, [key, val], index) => {
        const symbol = index === 0 ? '?' : '&';
        queryString += typeof val === 'string' ? `${symbol}${key}=${val}` : '';
        return queryString;
      }, '')
    : '';
};
const getURLParameters = url =>
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
    (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
    {}
  );
```

注：获取URL参数的时候如果存在单页哈希会出现问题。

## 驼峰与连字符互转

```javascript
const toKebabCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-');
const toCamelCase = str => {
  let s =
    str &&
    str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join('');
  return s.slice(0, 1).toLowerCase() + s.slice(1);
};
```



## HTML正反编码

```javascript
const escapeHTML = str =>
  str.replace(
    /[&<>'"]/g,
    tag =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
  );
const unescapeHTML = str =>
  str.replace(
    /&amp;|&lt;|&gt;|&#39;|&quot;/g,
    tag =>
      ({
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#39;': "'",
        '&quot;': '"'
      }[tag] || tag)
  );
```

## 在NODE下获取所有文件或文件夹

```JavaScript
const path = require('path')
const fs = require('fs')
const getFiles=(filePath, deep = true)=>fs.readdirSync(filePath).reduce((rs, i) => {
  let tpath = path.join(filePath, i)
  return rs.concat(
    fs.statSync(tpath).isDirectory()
      ? (deep ? getFiles(tpath) : [])
      : { path: tpath, name: i, folderName: path.basename(filePath) }
  )
}, [])
const getFolders=(filePath, deep = true)=>fs.readdirSync(filePath).reduce((rs, i) => {
  let tpath = path.join(filePath, i)
  return fs.statSync(tpath).isDirectory()
  ? rs.concat({ path: tpath, name: i }, deep ? getFolders(tpath, deep) : [])
  : rs
}, [])
```

功能：返回一个数组，包含文件或文件夹的路径和名称，这两个属性是最常用的，如果需要其他的可以自行添加