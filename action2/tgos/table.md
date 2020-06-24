# 表格组件

## 代码片段

```vue
<template>
  <tgos-table :data="tableData" v-bind="tableProps">
    <!-- <template slot="这里填写属性" slot-scope="scope">{{scope包含row,item,$index三个属性可以使用}}</template> -->
  </tgos-table>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      tableProps: {
        column: [
          { label: "状态", prop: "state" }
        ],
        operate: [
          //operate可以使用函数并返回一个以下结构的数组
          { text: "编辑", type: "text", click(item, index) {} }
        ]
      }
    };
  }
};
</script>
```

## props

| 属性名     | 类型    | 默认值 | 说明           |
| ---------- | ------- | ------ | -------------- |
| column     | String  | []     | 标签宽度       |
| operate    | Boolean | []     | 操作列内容     |
| pagination | Boolean | false  | 是否显示分页   |
| data       | Array   | []     | 表格数据       |
| selection  | Boolean | false  | 是否显示勾选框 |

## slot

遇到复杂的表格结构可以使用作用域插槽的方式来进行自定义开发。直接使用template结合并指定slot即可

```vue
<template>
  <tgos-table :data="tableData" v-bind="tableProps">
    <template slot="state" slot-scope="scope">{{scope.item.label}}</template>
  </tgos-table>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      tableProps: {
        column: [
          { label: "状态", prop: "state" }
        ],
        selection:true
      }
    };
  },
  methods:{
    getSelection(){
      console.log(this.$refs.table.selected)
    }
  }
};
</script>
```

## 勾选框数据读取

表格组件内置了selected属性，可以保存当前已经选定的内容，可用于直接读取，你可以通过设置表格的selection属性来设置，也可以在column中添加{ type: "selection" }来设置

```vue
<template>
  <tgos-table :data="tableData" v-bind="tableProps" ref="tabel"></tgos-table>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      tableProps: {
        column: [
          { type: "selection" },
          { label: "状态", prop: "state" }
        ],
        selection:true
      }
    };
  },
  methods:{
    getSelection(){
      console.log(this.$refs.table.selected)
    }
  }
};
</script>
```

## 可编辑表格

为column的单元项增加editEvent方法即可使该列数据支持编辑，需要注意的是editEvent方法需要返回一个promise或者一个布尔类型的值，表格组件将根据返回值来设置或还原表格数据

```vue
<template>
  <tgos-table :data="tableData" v-bind="tableProps" ref="table"></tgos-table>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      tableProps: {
        column: [
          { label: "状态", prop: "state",editEvent:(newValue,oldVaue,item,index)=>{
            return api.setState({id:item.id,state:newValue})
          } }
        ]
      }
    };
  }
};
</script>
```

## 



