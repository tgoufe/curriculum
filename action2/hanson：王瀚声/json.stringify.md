> JSON数据格式在我们日常的开发中，使用频率非常的高。无论是请求后端接口，返回的数据，还是后端同学要求前端传参格式，都离不开JSON。  
## MDN定义
`JSON` 是一种语法，用来序列化对象、数组、数值、字符串、布尔值和 null 。它基于 `JavaScript` 语法，但与之不同：`JavaScript`不是`JSON`，`JSON`也不是`JavaScript`。  
## JSON 与JavaScript的区别  

JavaScript类型|JSON 的不同点
--|:--:|--:
对象和数组|属性名称必须是双引号括起来的字符串；最后一个属性后不能有逗号。
数值|禁止出现前导零（ JSON.stringify 方法自动忽略前导零，而在 JSON.parse 方法中将会抛出 SyntaxError）；如果有小数点, 则后面至少跟着一位数字。
字符串|只有有限的一些字符可能会被转义；禁止某些控制字符； Unicode 行分隔符 （U+2028）和段分隔符 （U+2029）被允许 ; 字符串必须用双引号括起来。请参考下面的示例，可以看到 JSON.parse() 能够正常解析，但将其当作JavaScript解析时会抛出 SyntaxError 错误：

## JSON.parse()的说明
JSON.parse() 方法用来解析JSON字符串，构造由字符串描述的JavaScript值或对象。
```javascript
    JSON.parse('{}');              // {}
    JSON.parse('true');            // true
    JSON.parse('"foo"');           // "foo"
    JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
    JSON.parse('null');            // null
    JSON.parse('1');               //  1
```
## JSON.stringfy() 的说明
JSON.stringify()方法是将一个JavaScript值(对象或者数组)转换为一个 JSON字符串，如果指定了replacer是一个函数，则可以选择性的替换值，或者如果指定了replacer是一个数组，可选择性的仅包含数组指定的属性。---转子MDN  

### JSON.stringfy()转换规则 
 1. 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。  
 2. 所有以 `symbol` 为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
 3. 属性为函数或者undefined，则会被忽略。
 4. 转换值如果有toJSON()方法，该方法定义什么值将被序列化。
 5. 非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。
 6. undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）。函数、undefined被单独转换时，会返回undefined，如JSON.stringify(function(){}) or JSON.stringify(undefined).
 7. 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
 8. NaN和Infinity格式的数值及null都会被当做null。
 9. 仅会序列化可枚举的属性。  
 
```javascript
    JSON.stringify(1)                          // "1"
    JSON.stringify("foo");                     // '"foo"'
    JSON.stringify({});                        // '{}'
    JSON.stringify(true);                      // 'true'
    JSON.stringify([1, "false", false]);       // '[1,"false",false]'
    JSON.stringify({ x: 5 });                  // '{"x":5}'
    
    //所有以 symbol 为属性键的属性都会被完全忽略掉
    JSON.stringify({[Symbol("foo")]: "foo"});                            // "{}"
    JSON.stringify({[Symbol.for("foo")]: "foo"}, [Symbol.for("foo")]);  // '{}'
    
    
    JSON.stringify(undefined)                  //undefined
    //undefined、任意的函数以及 symbol值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null
    JSON.stringify([undefined, Object, Symbol("")]);                  // '[null,null,null]'           
    
    //属性为函数，则会被忽略
    const data1 = {
        a: 'aaa',
        fn: function() {
            return true
        }，
        b:undefined
    }
    JSON.stringify(data) // "{"a":"aaa"}"
    
   //转换值如果有toJSON()方法，该方法定义什么值将被序列化。
    const data5 = {
        a: 'abc',
        b: null,
        c: {
            x: 'xxx',
            y: 'yyy',
            z: 2046
        },
        d: 9527,
        toJSON: function() {
            return 'WTF'
        }
    }

JSON.stringify(data5, null, 2); //""WTF""
```  
## 为什么给大家介绍了这么多关于JSON.stringify()的语法知识？
介绍这么多，主要还是为了实现对JSON.stringify()和JSON.parse()的手动实现。
```javascript
if (!window.JSON) {
  window.JSON = {
    parse: function(sJSON) { return eval('(' + sJSON + ')'); },
    stringify: (function () {
      var toString = Object.prototype.toString;
      var isArray = Array.isArray || function (a) { return toString.call(a) === '[object Array]'; };
      var escMap = {'"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t'};
      var escFunc = function (m) { return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1); };
      var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
      return function stringify(value) {
        if (value == null) {
          return 'null';
        } else if (typeof value === 'number') {
          return isFinite(value) ? value.toString() : 'null'; // isFinite 非无穷大
        } else if (typeof value === 'boolean') {
          return value.toString();
        } else if (typeof value === 'object') {
          if (typeof value.toJSON === 'function') {
            return stringify(value.toJSON());
          } else if (isArray(value)) {
            var res = '[';
            for (var i = 0; i < value.length; i++)
              res += (i ? ', ' : '') + stringify(value[i]);
            return res + ']';
          } else if (toString.call(value) === '[object Object]') {
            var tmp = [];
            for (var k in value) {
              if (value.hasOwnProperty(k)) // hasOwnProperty 重点 只转换可遍历属性
                tmp.push(stringify(k) + ': ' + stringify(value[k]));
            }
            return '{' + tmp.join(', ') + '}';
          }
        }
        return '"' + value.toString().replace(escRE, escFunc) + '"';
      };
    })()
  };
}

```
重点词语解释一下：
1. escMap ：只有有限的一些字符可能会被转义，其中包括",\\,\b等等上面写到的。
2. escRE：Unicode 行分隔符 （U+2028）和段分隔符 （U+2029）被允许。
3. 非无穷大的数组，正常转换成字符串，无穷大转换后，变成'null'。
4. 只转换可遍历的属性。  


非常感谢：[较真的前端](https://zhuanlan.zhihu.com/p/70361133)   [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)
[代码写着写着就懂了](https://juejin.im/post/5be5b9f8518825512f58ba0e)  
