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

### 属性：

#### data

用于描述表单内容的object数组，结构如下

- label：表示显示的名称
- prop：要传给后台的字段
- type：显示的类型，不填默认为input
- props：表单项接收的属性，具体参见elementUI表单项
- disabled：是否禁用
- show：是否显示，可以使用Boolean类型，也可以使用函数。
- options：对于"select", "selects", "checkbox", "radio", "cascader", "cascaders"，可以通过该属性来表示选项，支持两种结构，第一种是使用对象，显示名为key，值为value，第二种是elementUI支持的数组结构
- required：是否是必选
- rules：验证规则数组

type常规可选值：选值有 ssq（省市区）, date, time, slider, switch, cascade,cascaders（可多选的级联）, number, radio, checkbox, select, selects（多选下拉）, image, images（多图上传），

type业务可选值：

| 类型   | 作用       | 额外说明     |
| ------ | ---------- | ------------ |
| ssq    | 省市区选择 |              |
| brand  | 品牌单选   | 可以自动搜索 |
| brands | 品牌多选   | 可以自动搜索 |

#### v-model

用于设置表单的初始数据和获取最终数据，通常设置一个空对象即可

### 方法

### 作用域插槽



