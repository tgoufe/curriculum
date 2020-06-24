# 常用代码片段

## 初始页面

```vue
<template>
  <div></div>
</template>
<script>
import _ from "lodash";
import { baseService } from "_src/api/index.js";
export default {
  data() {
    let _this = this;
    return {};
  },
  methods: {},
  created() {}
};
</script>
<style lang="scss" scoped></style>

```

## 通用列表页面

更换一下service和editPage（编辑页面的地址）即可

```vue
<template>
  <div>
    <tgos-query-container>
      <tgos-form :data="queryData" ref="query" v-model="queryModel" :inline="true"></tgos-form>
      <template v-slot:query>
        <el-button type="primary" @click="fetch()">
          查询
        </el-button>
        <el-button type="danger" @click="$refs.query.reset(fetch)">
          重置
        </el-button>
      </template>
    </tgos-query-container>
    <tgos-rs-container>
      <el-button type="primary" size="small" class="marginb14" @click="changeToEdit">新增</el-button>
      <tgos-table :data="tableData" v-bind="tableProps" @paginations="fetch">
        <!-- <template slot="这里填写属性" slot-scope="scope">{{scope包含row,item,$index三个属性可以使用}}</template> -->
      </tgos-table>
    </tgos-rs-container>
  </div>
</template>
<script>
import _ from "lodash";
import { wechatService } from "_src/api/index.js";
export default {
  data() {
    let _this = this;
    return {
      editPage:'./personEdit',
      queryModel: {},
      queryData: [
        { label: "员工账号", prop: "id" },
      ],
      tableData: [],
      tableProps: {
        column: [
          { label: "状态", prop: "state" },
        ],
        operate: [
          //operate可以使用函数并返回一个以下结构的数组
          {
            text: "编辑",
            type: "text",
            click(item, index) {
              _.this.changeToEdit(item.id)
            }
          },
        ],
        pagination: true
      }
    };
  },
  methods: {
    fetch(page = 1, requestCount = true) {
      let data = _.assign(this.queryModel, {
        page,
        rows: 10
      });
      console.log(data);
      // 设置分页数据
      requestCount &&
        wechatService.authorizationCount(data).then(data => {
          this.tableProps.pagination = data;
        });
      //设置表格数据
      wechatService
        .authorizationList(data)
        .then(data => (this.tableData = data));
    },
    changeToEdit(id){
      _this.$router.push({ path: this.editPage, query: { id: item.id } });
    }
  },
  created() {
    this.fetch();
  }
};
</script>
<style lang="scss" scoped></style>

```

## 通用详情页

```vue
<template>
  <div>
    <el-card header="页面标题">
      <tgos-form :data="fromData" v-model="fromModel" ref="form"></tgos-form>
      <div class="text-center">
        <el-button>保存</el-button>
        <el-button>取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { baseService } from "_src/api/index.js";
import * as validator from "_src/libs/validator.js";
export default {
  data() {
    return {
      fromModel: {},
      fromData: [
        { label: "角色名称", prop: "id", rules: [validator.stringLen(20)] },
      ]
    };
  },
  created() {
    if (this.id) {
      //编辑状态下获取详情
      baseService.roleGet({ id: this.id }).then(data => (this.fromModel = data));
    }
  },
  methods: {
    save() {
      //新增和编辑调用不同的接口但传递相同的数据
      this.$refs.form.validate() && baseService[this.id ? "roleUpdate" : "roleCreat"](_.merge(this.fromModel, { id: this.id }));
    }
  }
};
</script>
```

## 日志弹窗

```vue
<template>
		<el-drawer title="log日志" :visible.sync="logVisible">
      <div class="padding20">
        <tgos-table :data="logData" v-bind="logProps" ref="log" @paginations="logFetch"></tgos-table>
      </div>
    </el-drawer>
</template>
<script>
export default {
  data() {
    let _this = this;
    return {
      logVisible: false,
      logModel: {},
      logData: [],
      logProps: {
        column: [
          { label: "id", prop: "id" },
          { label: "bizId", prop: "bizId" },
          { label: "操作人", prop: "userName" },
          { label: "操作内容", prop: "opContent" },
          { label: "IP地址", prop: "ip" }
        ],
        pagination: true
      }
    };
  },
  methods: {
    showLog(item) {
      this.logModel.id = item.id;
      this.logFetch();
    },
    logFetch(page = 1, requestCount = true) {
      let data = _.assign(this.logModel, { page, rows: 10 });
      baseService.platformRoleLogList(data).then(data => {
        this.logData = data;
        this.logVisible = true;
      });
    }
  }
};
</script>
```

