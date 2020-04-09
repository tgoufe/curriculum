# tgos常用组件

单图片上传

```html
<tgos-upload-image-single v-model="要绑定的数据"></tgos-upload-image-single>
属性：
width: { type: String, default: '150' },//展示的尺寸
max: { type: Number, default: 2 },//最大文件尺寸
事件
success 参数：imageurl
```

多图上传

```html
<tgos-upload-image-more v-model="要绑定的数据"></tgos-upload-image-more>
```

关闭标签页面

```javascript
this.$emit("close-page");
```

