# 正则火星文第三集(常用正则表达式总结)

本篇没什么好说的，懒癌患者的福音~
>没有最完美的正则，只有最合适

## 数字类
### 数字
#### 数字
```regex
^[0-9]*$
```
#### n位的数字
```regex
^\d{n}$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum16.png)

#### 至少n位数字
```regex
^\d{n,}$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum15.png)

#### m-n位的数字
```regex
^\d{m,n}$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum14.png)	
### 整数
```regex
^-?[1-9]\d*$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum1.png)

#### 正整数
```regex
^[1-9]\d*$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum2.png)

#### 负整数
```regex
^-[1-9]\d*$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum3.png)

#### 非负整数
```regex
^[1-9]\d*|0$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum4.png)

#### 非正整数
```regex
^-[1-9]\d*|0$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum5.png)

#### 非零的正整数
```regex
^\+?[1-9][0-9]*$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum11.png)

#### 非零的负整数
```regex
^\-[1-9][0-9]*$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum12.png)

### 浮点数
```regex
^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum6.png)

#### 正浮点数
```regex
^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum7.png)

#### 负浮点数
```regex
^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum8.png)

#### 非负浮点数
```regex
^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum9.png)

#### 非正浮点数
```regex
^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum10.png)

#### 零和非零开头的数字
```regex
^(0|[1-9][0-9]*)$`
```
![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regnum13.png)

## 字符类
### 汉字
```regex
^[\u4e00-\u9fa5]{0,}$
```
![chinese](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regchar1.png)

### 英文和数字
```regex
^[A-Za-z0-9]+$
```
![char](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regchar2.png)

### 指定范围长度所有字符

```regex
^.{3,20}$
```
![char](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regchar3.png)

### 由英文字母组成的字符串

```regex
^[A-Za-z]+$
```
![char](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regchar4.png)

#### 由大写英文字母组成的字符串

```regex
^[A-Z]+$
```
![char](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regchar5.png)

#### 由小写英文字母组成的字符串

```regex
^[a-z]+$
```
![char](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regchar6.png)

#### 由数字和英文字母组成的字符串

```regex
^[A-Za-z0-9]+$
```
![char](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regchar7.png)

#### 由数字、英文字母或者下划线组成的字符串 

```regex
^\w+$
```
![char](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regchar8.png)

### 中文、英文、数字包括下划线

```regex
^[\u4E00-\u9FA5A-Za-z0-9_]+$
```
![char](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regchar9.png)

### 中文、英文、数字但不包括下划线等符号

```regex
^[\u4E00-\u9FA5A-Za-z0-9]+$
```
![char](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regchar10.png)

### 禁止输入特殊字符

```regex
[^%&',;=?$\x22]+
```
![char](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/regchar11.png)

### 必须包含大写、小写、数字、特殊字符
```regex
^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$
```

## 网络类
### 域名
```regex
^((http:\/\/)|(https:\/\/))?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(\/)
```

### IP（ip-v4）
```regex
((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))
```

### IP（ip-v6）
```regex
^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$
```

### 带域名的网址或IP
```regex
^(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+:\d{0,5}\/?
```

### 带参数的网址
```regex
^(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$
```

### 子网掩码
```regex
^(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(?:\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$
```

### 视频链接地址
```regex
^https?:\/\/(.+\/)+.+(\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4))$
```

### 图片链接地址
```regex
^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$
```

### 迅雷链接地址
```regex
^thunderx?:\/\/[a-zA-Z\d]+=$
```

### 磁力链接地址
```regex
^magnet:\?xt=urn:btih:[0-9a-fA-F]{40,}.*$
```

### ed2k链接地址
```regex
^ed2k:\/\/\|file\|.+\|\/$
```

### base64地址
```regex
^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@/?%\s]*?)\s*$
```

## 浏览器类
### IE浏览器
```regex
msie (\d+\.\d+)
```

### webkit内核浏览器
```regex
webkit
```

### chrome浏览器
```regex
chrome\/(\d+\.\d+)
```

### firefox浏览器
```regex
firefox\/(\d+\.\d+)
```

### opera浏览器
```regex
opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?
```

### safari浏览器
```regex
(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?
```

### android系统
```regex
android
```

### android系统
```regex
android
```

### macos系统
```regex
macintosh
```

### windows系统
```regex
windows
```

### ipad
```regex
ipad
```

### iphone
```regex
iphone
```
### 移动端
```regex
(nokia|iphone|android|ipad|motorola|^mot\-|softbank|foma|docomo|kddi|up\.browser|up\.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam\-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte\-|longcos|pantech|gionee|^sie\-|portalmmm|jig\s browser|hiptop|^ucweb|^benq|haier|^lct|opera\s*mobi|opera\*mini|320x320|240x320|176x220)
```

## 账号类
### 邮箱账号
```regex
\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*
```
### 身份证号
```regex
^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}[\dXx]$
```
### 邮编号
```regex
^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$
```
### 银行卡号
```regex
^[1-9]\d{9,29}$
```
### 车牌号（非新能源）
```regex
^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$
```
### 车牌号（新能源）
```regex
[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(([0-9]{5}[DF])|([DF][A-HJ-NP-Z0-9][0-9]{4}))$
```
### QQ号
```regex
[1-9][0-9]{4,}
```
### 微信号
```regex
^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$
```
### 手机IMEI码
```regex
^\d{15,17}$
```
### 统一社会信用代码
```regex
^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$
```
### A股代码
```regex
^(s[hz]|S[HZ])(000[\d]{3}|002[\d]{3}|300[\d]{3}|600[\d]{3}|60[\d]{4})$
```

### 版本号（X.Y.Z)
```regex
^\d+(?:\.\d+){2}$
```

## 手机号码
### 座机
```redex
\d{3}-\d{8}|\d{4}-\d{7}
```

### 运营商
#### 匹配所有
```regex
^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[01356789]\d{2}|66\d{2})\d{6}$
```
#### 中国移动
```regex
^(?:\+?86)?1(?:3(?:4[^9\D]|[5-9]\d)|5[^3-6\D]\d|8[23478]\d|(?:78|98)\d)\d{7}$
```

#### 中国联通
```regex
^(?:\+?86)?1(?:3[0-2]|[578][56]|66)\d{8}$
```

#### 中国电信
```regex
^(?:\+?86)?1(?:3(?:3\d|49)\d|53\d{2}|8[019]\d{2}|7(?:[37]\d{2}|40[0-5])|9[139]\d{2})\d{6}$
```

#### 北京船舶通信导航有限公司（海事卫星通信）
```regex
^(?:\+?86)?1749\d{7}$
```

#### 工业和信息化部应急通信保障中心（应急通信）
```regex
^(?:\+?86)?174(?:0[6-9]|1[0-2])\d{6}$
```

### 虚拟运营商

#### 匹配所有虚拟卡
```regex
^(?:\+?86)?1(?:7[01]|6[257])\d{8}$
```

#### 中国移动虚拟卡
```regex
^(?:\+?86)?1(?:65\d|70[356])\d{7}$
```

#### 中国联通虚拟卡
```regex
^(?:\+?86)?1(?:70[4789]|71\d|67\d)\d{7}$
```

#### 中国电信虚拟卡
```regex
^(?:\+?86)?1(?:70[012]|62\d)\d{7}$
```

### 物联网数据卡

#### 匹配所有物联网数据卡
```regex
^(?:\+?86)?14(?:[14]0|[68]\d)\d{9}$
```
#### 中国移动物联网数据卡
```regex
^(?:\+?86)?14(?:40|8\d)\d{9}$
```
#### 中国联通物联网数据卡
```regex
^(?:\+?86)?146\d{10}$
```
#### 中国电信物联网数据卡
```regex
^(?:\+?86)?1410\d{9}$
```
### 上网卡

#### 匹配所有
```regex
^(?:\+?86)?14[579]\d{8}$
```

#### 匹配中国移动
```regex
^(?:\+?86)?147\d{8}$
```

#### 匹配中国联通
```regex
^(?:\+?86)?145\d{8}$
```

#### 匹配中国电信
```regex
^(?:\+?86)?149\d{8}$
```
## HTML类
### HTML标签
```regex
/<(\S*?) [^>]*>.*?</\1>|<.*?/>/gm
```

### 非HTML标签
```regex
^[^<>`~!/@\#}$%:;)(_^{&*=|'+]+$
```

### script标签
```regex
/<script[^>]*>[\s\S]*?<\/[^>]*script>/gi
```

### link标签
```regex
/\<link\s(.*?)\s*(([^&]>)|(\/\>)|(\<\/link\>))/gi
```

### textarea标签
```regex
/<textarea[^>]*>[\s\S]*?<\/[^>]*textarea>/gi
```

### HTML注释
```regex
/<!--[\s\S]*?--\>/g
```

## 其他常用类

### 首尾空格
```regex
(^\s*)|(\s*$)
```
### 首尾逗号
```regex
^,*|,*$
```
### 16进制颜色
```regex
^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$
```

## 你看不懂但是很好用类

### **手机号码中间四位用`*`代替**
```js
function encryptPhone(val){
    if(!val) return;
    return val.replace(/^(\d{3})(\d{4})(\d+)/, '$1****$3')
}

encryptPhone('13173786224'); // 131****6224
```

### **千分位逗号分割**
```js
let money = 1003450.89;
console.log(money.toString().replace(/(?=\B(?:\d{3})+\b)(\d{3}(?:\.\d+$)?)/g,',$1'));
```

### **替换字符串中的空格**
```js
let reg = /([^\s])\s+([^\s\b])/g;
let str = " 中国  北京  朝阳区 "; 
str = str.replace(reg, "$1%$2")
```
### **数组扁平化**
```js
let arr = [1, [2, 3.3, ['a,b,c,d,e']]];

let flatten = (arr)=> {
    console.log(JSON.stringify(arr).replace(/\[|\]/g, ''))
    return JSON.parse(`[${JSON.stringify(arr).replace(/\[|\]/g, '')}]`);
}
console.log(flatten(arr))
```

参考文献：

- [any86](https://github.com/any86/any-rule)
- [ChinaMobilePhoneNumberRegex](https://github.com/VincentSit/ChinaMobilePhoneNumberRegex/blob/master/README-CN.md)
- [common-regex](https://github.com/cdoco/common-regex/blob/master/README.md)
