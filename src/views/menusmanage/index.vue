<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <el-row :gutter="10">
      <!-- 左侧菜单栏 -->
      <el-col :span="6">
        <el-card>
          <el-row style="margin-bottom:20px;">
            <el-button type="primary" size="small" @click="addMenu">添加菜单</el-button>
            <el-button type="primary" size="small" @click="addChildMenu">添加子菜单</el-button>
          </el-row>
          <el-tree
            :highlight-current="true"
            :data="childrenData"
            :props="defaultProps"
            @node-click="handleNodeClick"
          ></el-tree>
        </el-card>
      </el-col>
      <!-- 切换表单 -->
      <el-col :span="18">
        <el-card>
          <el-form size="small" ref="form" :model="form" :rules="formRules" label-width="80px">
            <el-form-item label="id" prop="id" v-show="false">
              <el-input v-model="form.id"></el-input>
            </el-form-item>

            <el-row>
              <el-col :span="12">
                <el-form-item label="父id" prop="idParent">
                  <el-input v-model="form.idParent" disabled></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="组件" prop="component">
                  <el-input v-model="form.component"></el-input>
                </el-form-item>

                <el-form-item label="微服务名" prop="serviceName">
                  <el-input v-model="form.serviceName"></el-input>
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="保持缓存" prop="keepAlive">
                      <el-radio v-model="form.keepAlive" label="true">是</el-radio>
                      <el-radio v-model="form.keepAlive" label="false">否</el-radio>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="状态" prop="status">
                      <el-select v-model="form.status">
                        <el-option
                          v-for="item in statusOption"
                          :key="item.id"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-form-item label="图标" prop="iconCls">
                  <el-input v-model="form.iconCls"></el-input>
                </el-form-item>
                <el-form-item label="路由地址" prop="path">
                  <el-input v-model="form.path"></el-input>
                </el-form-item>
                <el-form-item label="页面类型" prop="type">
                  <el-input v-model="form.type" placeholder="inner/outer/hidden"></el-input>
                </el-form-item>
                <el-form-item label="参数" prop="parameter">
                  <el-input v-model="form.parameter"></el-input>
                </el-form-item>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="排序码" prop="sortNo">
                      <el-input v-model.number="form.sortNo"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="作者" prop="author">
                      <el-input v-model="form.author"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <el-form-item label="简介" prop="summary">
              <el-input type="textarea" v-model="form.summary"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input type="textarea" v-model="form.remarks" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item class="form_btn">
              <el-button size="small" @click="deleteRow" type="danger">删除</el-button>
              <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { SubmitForm, guid, DeleteStatus } from "@/assets/js/common.js";
export default {
  name: "menusManageindex",
  data() {
    return {
      serviceName: "",
      childrenData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      form: {},
      editType: "add",
      statusOption: [],
      formRules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        sortNo: [
          { required: true, message: "请输入排序码", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" }
        ],
        path: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
        component: [
          { required: true, message: "请输入组件路径", trigger: "blur" }
        ],
        serviceName: [
          { required: true, message: "请输入微服务名", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.serviceName = this.$router.currentRoute.meta.serviceName;
    this.getData();
    this.getOption();
  },
  // 方法
  methods: {
    //数据
    getData() {
      var that = this;
      that
        .getRequest("/api/" + this.serviceName + "/menus/select/all")
        .then(result => {
          let dd = [];
          result.forEach(e => {
            if (!e.idParent) {
              e.children = [];
              dd.push(e);
            }
            result.forEach(ch => {
              if (ch.idParent == e.id) {
                e.children.push(ch);
              }
            });
          });
          that.childrenData = dd;
        });
    },
    getOption() {
      var that = this;
      that
        .getRequest("/api/ts-projectdeploy/project/status/query")
        .then(result => {
          that.statusOption = result;
        });
    },
    handleNodeClick(data) {
      this.editType = "edit";
      this.form = Object.assign({}, data);
    },
    addMenu(e) {
      this.editType = "add";
      this.form = {
        id: guid(),
        idParent: "",
        name: "",
        type: "inner",
        serviceName: "",
        iconCls: "",
        keepAlive: "true",
        path: "",
        component: "Layout",
        parameter: "",
        summary: "",
        remarks: "",
        author: "",
        status: "1",
        sortNo: 100
      };
    },
    addChildMenu(e) {
      this.editType = "add";
      if (!!this.form.id) {
        this.form = {
          idParent: this.form.id || "",
          id: guid(),
          name: "",
          type: "inner",
          serviceName: "",
          iconCls: "",
          keepAlive: "true",
          path: "",
          component: "Layout",
          parameter: "",
          summary: "",
          remarks: "",
          author: "",
          status: "1",
          sortNo: 100
        };
      } else {
        this.form = {
          id: guid(),
          idParent: "",
          name: "",
          type: "inner",
          serviceName: "",
          iconCls: "",
          keepAlive: "true",
          path: "",
          component: "Layout",
          parameter: "",
          summary: "",
          remarks: "",
          author: "",

          status: "1",
          sortNo: 100
        };
      }
    },
    onSubmit() {
      let that = this;
      delete this.form.createTime;
      delete this.form.children;
      let type = this.editType;
      let addSqlId = "/api/" + this.serviceName + "/menus/insert";
      let changeSqlId = "/api/" + this.serviceName + "/menus/update";

      SubmitForm(this, "form", "form", type, addSqlId, changeSqlId, function() {
        that.getData();
      });
    },
    deleteRow() {
      let that = this;
      let deleteUrl = "/api/" + this.serviceName + "/menus/delete";
      let data = { id: this.form.id };
      DeleteStatus(this, deleteUrl, data, function() {
        that.getData();
      });
    }
  }
};
</script>

<style>
/* 
.form_btn{
  width: 80%;
  text-align: right;
} */
</style>