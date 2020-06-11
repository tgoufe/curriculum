# 表单组件

## 代码片段：

```vue
<tgos-form :data="fromData" v-model="fromModel"></tgos-form>
<script>
import * as validator from "_src/libs/validator.js";
export default {
  data(){
    return {
      fromData:[
        {label:'用户名',prop:'userName',rules:[validator.stringLen(8)]},
        {label:'性别',prop:'sex',type:'radio',options:{男:1,女:2}}
      ],
      fromModel:{},
    }
  }
}
</script>
```

## props

| 属性名      | 类型    | 默认值 | 说明             |
| ----------- | ------- | ------ | ---------------- |
| label-width | String  | 80px   | 标签宽度         |
| inline      | Boolean | false  | 是否使用行内显示 |

## data

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

| 类型               | 作用                     | 额外说明                                        |
| ------------------ | ------------------------ | ----------------------------------------------- |
| ssq                | 省市区选择               |                                                 |
| brand/brands       | 品牌单选和多选           | 可以自动搜索                                    |
| image/images       | 图片的单选和多选         |                                                 |
| category/categorys | 分类级联菜单的单选和多选 | 可搜索，单选时model为ID，多选时model为[id1,id2] |
| cascaders          | 可多选的级联             |                                                 |
| counter/counters   | 专柜的单选和多选         | 可以自动搜索，会从store中读取要传给后端的值     |
| store/stores       | 门店的单选和多选         | 可以自动搜索，会从store中读取要传给后端的值     |
| selects            | 多选下拉                 |                                                 |

## v-model

用于设置表单的初始数据和获取最终数据，通常设置一个空对象即可，如果需要设置默认值，可以对和prop相同的key赋值。

```javascript
export default {
  data(){
    return {
      fromData:[
        {label:'用户名',prop:'userName'},
        {label:'性别',prop:'sex',type:'radio',options:{男:1,女:2}}
      ],
      fromModel:{
        userName:'默认用户名'
      },
    }
  }
}
```

## methods

| 事件名称   | 说明                                                 | 参数                                                         |
| ---------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| validate   | 对表单进行全局验证，返回值为布尔类型                 | 无                                                           |
| getData    | 获取表单内容                                         | 无                                                           |
| clear      | 清空表单项                                           | 默认清空所有表单，可以以数组的形式传入prop名称来指定清除对应项。 |
| reset      | 重置表单项                                           | 通常情况为它和clear的作用是相同的，区别在于如果model绑定了默认值，使用该方法可以还原到默认值，而clear会全部清空 |
| setOptions | 对需要设置options进行批量设置通常是select checkbox等 | 表示选项和属性对应关系的对象                                 |

## methods Exp

```javascript
this.$refs.form.validate()//true or false
this.$refs.form.getData()//相当于直接获取model
this.$refs.form.clear(['name','sex'])//清空name sex两个表单项
//调用接口获取下来菜单的值，并异步设置
service.getData().then(data=>{
  this.$refs.form.setOptions({
    sex:data.map(i=>({value:i.name,value:i.id}))
  }) 
})
```

## slot

遇到复杂的表单结构可以使用作用域插槽的方式来进行自定义开发。

1：设置type为slot并指定对应的prop

2：使用template结合并指定slot

```vue
<tgos-form :data="fromData" v-model="fromModel" label-width="120px">
  <template slot="yugao">
    <el-radio-group v-model="fromModel.yugao">
      <el-radio :label="1">
        不预告
      </el-radio>
      <el-radio :label="2"> 活动开始前 <el-input></el-input>小时预告 </el-radio>
    </el-radio-group>
  </template>
</tgos-form>
<script>
export default {
  data() {
    return {
      fromModel: { },
      fromData: [
        { label: "预告设置", prop: "yugao", type: "slot" }
      ]
    };
  }
};
</script>
```

## 前置和后置文本

有时需要对表单项增加前置和后置的说明文案，此时可以使用prepend和append属性进行控制

```javascript
fromData: [
  { label: "邮箱", prop: "email", append:'@163.com' }
]
```

