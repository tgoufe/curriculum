# 够用就好：提高工作效率的代码片段

test

## 在NODE下获取所有文件或文件夹

```JavaScript
const path = require('path')
const fs = require('fs')
function getFiles(filePath, deep = true) {
  return fs.readdirSync(filePath).reduce((rs, i) => {
    let tpath = path.join(filePath, i)
    return rs.concat(
      fs.statSync(tpath).isDirectory()
        ? (deep ? getFiles(tpath) : [])
        : { path: tpath, name: i, folderName: path.basename(filePath) }
    )
  }, [])
}
function getFolders(filePath, deep = true) {
  return fs.readdirSync(filePath).reduce((rs, i) => {
    let tpath = path.join(filePath, i)
    if (!fs.statSync(tpath).isDirectory()) {
      return rs
    }
    return rs.concat({ path: tpath, name: i }, deep ? getFolders(tpath, deep) : [])
  }, [])
}
```

功能：返回一个数组，包含文件或文件夹的路径和名称，这两个属性是最常用的，如果需要其他的可以自行添加

## 节流防抖





## 深拷贝





功能：对三种最常见的需求做处理

1. 能够实现数组和对象的深拷贝
2. 能够处理基础数据类型
3. 能够处理循环引用

不足：

1. 无法处理一些常见对象，如Date Error Function等
2. 无法处理Map Set等对象
3. 无法处理Symbol类型的数据
4. ...



## 单次执行函数



## N次执行函数



## 执行N次函数

我非常喜欢用于测试数据时的一个方法

```javascript
const times = (num,fn=i=>i) =>Array.from({ length: num }).reduce((rs, _, index) =>rs.concat(fn(index)), []);
```



## get

```javascript
const get= ( obj, ...keys) => keys.reduce( ( a, b ) => ( a || { } )[ b ], obj );
get(user,'info','address','city')
```





## 拓展数组方法到对象



## 数组的扁平化

正常的递归

```javascript
const flatten = (list) => list.reduce((acc, value) => acc.concat(value), []);
```

比较骚但是效率奇高的操作

```javascript
const flatten = (list) =>JSON.parse(`[${JSON.stringify(list).replace(/\[|\]/g, '')}]`);
```

注：此方法无法处理null，undefined和循环引用等问题

## 类型判断

```javascript
const is=(type,obj)=>new RegExp(type,'i').test(Object.prototype.toString.call(obj).slice(8,-1))
is('string','sdfsdfds')//true
is('array',[])//true
```



## 中序遍历二叉树

```javascript
const inorderTraversal=root=>(root===null)?[...inorderTraversal(root.left),root.value,...inorderTraversal(root.right)]:[]
```



## 数组组合

## 获取数组里面所有的组合

```javascript
const prod=(arr=[])=>arr.reduce((rs,item)=>[...rs,...rs.slice().map(i=>i.concat(item)),[item]],[])
prod([1,2,3]) //[ [ 1 ], [ 1, 2 ], [ 2 ], [ 1, 3 ], [ 1, 2, 3 ], [ 2, 3 ], [ 3 ] ]
```

## 获取多个数组的交叉组合

```javascript
const xprod=(...lists)=>lists.reduce((rs,arrItem)=>rs.length
  ? rs.reduce((acc,item)=>arrItem.reduce((acc,value)=>acc.concat([[...item,value]]),acc),[])
  : arrItem,[''])
xprod(['red','blue'],['36','37','38'],['男','女'])
```



## 真正的数组乱序



## includes

这是一个小技巧，使用~可以减少if中对-1的判断，其实就是因为懒

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



