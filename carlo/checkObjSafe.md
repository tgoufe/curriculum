
 

>「身无彩凤双飞翼，心有灵犀一点通。」

<!--more-->

现在开始写代码o(╯□╰)o 

## 举个例子
### **不安全的访问**
```javascript
//正常的数据结构
const user = {
    id: 1,
    email: 'carlo@bingshan.com',
    info: {
        name: 'carlo',
        address: {
            country: 'china',
            provinces: 'liaoning',
            city: 'dalian',
            street: 'aaaaaaaa'
        }
    }
}
//缺失一部分
const user = {
    id: 1,
    email: 'carlo@bingshan.com',
    info: {
        name: 'carlo'
    }
}
console.log(user.info.address.city);
//TypeError: Cannot read property 'city' of undefined
```

## 安全访问方案
### **方法一**

```javascript
if(user && user.info && user.info.address && user.info.address.city) {
    let cityStr = user.info.address.city;
}else{

}
//或者

let cityStr = user && user.info && user.info.address ？ user.info.address.city : '';
```
**好长好复杂好low！！！**

### **方法二**
**使用或运算**

```JavaScript
let cityStr = (((user || {}).info || {}).address || {}).city;
```
**还是很长！！**

### **方法三**
*抽出一个公共方法来判断好了*
#### 循环
```JavaScript
function checkObjSafe(obj) {
  for (let i = 1; i < arguments.length; i++) {
    if (!obj.hasOwnProperty(arguments[i])) {
      return false;
    }
    obj = obj[arguments[i]];
  }
  return true;
}
console.log(checkObjSafe(user,'info','address','city'))
```
**for循环明显不是我的风格！！**
#### 尾递归1
```JavaScript
function checkObjSafe(obj, level,  ...rest) {
  if (obj === undefined) return false
  if (rest.length == 0 && obj.hasOwnProperty(level)) return true
  return checkObjSafe(obj[level], ...rest)
}

console.log(checkObjSafe(user,'info','address'))
```
**ES6似乎好了一点~**

#### 尾递归2
```javascript
function checkObjSafe(obj, keys) {
  let rest = keys.shift();
  return obj[rest] && (!keys.length || checkObjSafe(obj[rest], keys));
}

console.log(checkObjSafe(user,['info','address','city']))
```
**试试扔个数组进去**
#### 循环2
```javascript
function checkObjSafe(obj, s){
    s= s.split('.')
    var objNew= obj[s.shift()];
    while(objNew && s.length) objNew= objNew[s.shift()];
    return objNew;
}

console.log(checkObjSafe(user,'info.address.city'))
```
**貌似方便了不少，直接传入字符串就行**

### **方法四**
**ES6大法好**

```JavaScript
function checkObjSafe( obj, ...keys ) {
    return keys.reduce( ( a, b ) => ( a || { } )[ b ], obj );
}

console.log(checkObjSafe(user,'info','address','city'))
```

### **方法五**
**暴力风格**

```JavaScript
try {
    let cityStr = user.info.address.city;
} catch (error) {
    let cityStr = undefined;
}
```
### **lodash**
```
_.get(user,'info.address.city')
```
[lodash](https://lodash.com/docs/4.17.11#get)

### **下一代JS特性**
```JavaScript
  const test = user?.info?. address?. city;
  //目前处在Stage 2阶段，可参考下面的链接⤵️
```
[Optional Chaining](https://github.com/tc39/proposal-optional-chaining)

