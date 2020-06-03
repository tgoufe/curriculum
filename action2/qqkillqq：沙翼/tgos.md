# tgos常用组件

## 单图片上传

```html
<tgos-upload-image-single v-model="要绑定的数据"></tgos-upload-image-single>
属性：
width: { type: String, default: '150' },//展示的尺寸
max: { type: Number, default: 2 },//最大文件尺寸
事件
success 参数：imageurl
```

## 多图上传

```html
<tgos-upload-image-more v-model="要绑定的数据"></tgos-upload-image-more>
```

## 关闭标签页面

```javascript
this.$emit("close-page");
```

## 表单组件

### 代码片段：

```html
<tgos-form :data="fromData" v-model="fromModel"></tgos-form>
```

```javascript
export default {
  data(){
    return {
      fromData:[
        {label:'用户名',prop:'userName'},
        {label:'性别',prop:'sex',type:'radio',options:{男:1,女:2}}
      ],
      fromModel:{},
    }
  }
}
```

### prop：

#### data

用于描述表单内容的object数组，结构如下

| 属性名   | 作用                                                         |
| :------- | ------------------------------------------------------------ |
| label    | 表示显示的名称                                               |
| prop     | 要传给后台的字段                                             |
| type     | 显示的类型，不填默认为input，可以使用element中所有的表单组件 |
| props    | 表单项接收的属性，具体参见elementUI表单项                    |
| disabled | 是否禁用                                                     |
| show     | 是否显示，可以使用Boolean类型，也可以使用函数                |
| options  | 对于"select", "selects", "checkbox", "radio", "cascader", "cascaders"，可以通过该属性来表示选项，支持两种结构，第一种是使用对象，显示名为key，值为value，第二种是elementUI支持的数组结构 |
| required | 是否是必选                                                   |
| rules    | 验证规则数组                                                 |

type特殊封装可选值：

| 类型         | 作用             | 额外说明     |
| ------------ | ---------------- | ------------ |
| ssq          | 省市区选择       |              |
| brand/brands | 品牌单选和多选   | 可以自动搜索 |
| image/images | 图片的单选和多选 |              |
| cascaders    | 可多选的级联     |              |
| selects      | 多选下拉         |              |

#### v-model

用于设置表单的初始数据和获取最终数据，通常设置一个空对象即可

### methods

| 事件名称 | 说明                                 | 参数                                                         |
| -------- | ------------------------------------ | ------------------------------------------------------------ |
| validate | 对表单进行全局验证，返回值为布尔类型 | 无                                                           |
| getData  | 获取表单内容                         | 无                                                           |
| clear    | 清空表单项                           | 默认清空所有表单，可以以数组的形式传入prop名称来指定清除对应项 |

### slot

遇到复杂的表单结构可以使用作用域插槽的方式来进行自定义开发。

1：设置type为slot并指定对应的prop

~~~~javascript
{label:'日期类型',prop:'dataType',type:'slot'}
~~~~

2：使用template结合并指定slot

```html
<template slot="dataType"></template>
```

