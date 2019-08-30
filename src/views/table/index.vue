<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <!-- 数据表搜索 -->
    <el-form :inline="true" :model="formInline" size="small">
      <el-form-item label="表名">
        <el-input v-model="formInline.name" placeholder="请输入数据表名"></el-input>
      </el-form-item>
      <el-form-item label="表含义">
        <el-input v-model="formInline.title" placeholder="请输入数据表含义"></el-input>
      </el-form-item>
      <el-form-item label="数据表类型">
           <el-select v-model="formInline.type">
                <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
        <!-- <el-input v-model="formInline.type" placeholder="请输入数据表类型"></el-input> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit"></el-button>
      </el-form-item>
    </el-form>
    <div class="add_btn">
      <el-button size="small" type="primary" plain @click="dataExport()">数据导出</el-button>
      <el-button size="small" type="primary" plain @click="manageField()">字段管理</el-button>
      <el-button size="small" type="primary" plain @click="manageIndex()">索引管理</el-button>
      <el-button size="small" type="primary" @click="addTableData('add')">增加</el-button>
    </div>
    <!-- 数据表表格 -->
    <el-table
      border
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @current-change="clickCurrent"
    >
          <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
          <el-table-column prop="name" label="数据表名称"></el-table-column>
                <el-table-column prop="title" label="数据表含义"></el-table-column>
      <el-table-column prop="moduleName" label="模块" width="100"></el-table-column>
      <el-table-column prop="idType" label="id类型"></el-table-column>
      <el-table-column prop="shortName" label="简称"></el-table-column>
      <el-table-column prop="typeName" label="类型"></el-table-column>
      <el-table-column prop="summary" label="简介"></el-table-column>
            <el-table-column prop="sortNo" label="排序码" width="80"></el-table-column>
      <el-table-column prop="status" align="center" label="状态" width="80"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <el-table-column label="操作" width="140" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            circle
            plain
            type="primary"
            icon="el-icon-edit"
           @click.stop="addTableData('edit', scope.row)"
          ></el-button>
          <el-button
            type="danger"
            circle
            plain
            icon="el-icon-delete"
            size="small"
           @click.stop="handleDelete(scope.$index, scope.row)"
                 
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑数据 -->
    <el-dialog title="数据表管理" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
      <el-form :model="form" :rules="addRules" ref="form" size="small" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据表名称" prop="name">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>

<el-form-item label="简称" prop="shortName">
              <el-input v-model="form.shortName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="数据表含义" prop="title">
              <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
       
                 <el-form-item label="简介" prop="summary">
              <el-input v-model="form.summary" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序码" prop="sortNo">
              <el-input v-model.number="form.sortNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
       
            <el-form-item label="id类型" prop="idType" class="type">
              <el-select v-model="form.idType" placeholder="请选择类型">
                <el-option label="手动录入" value="手动录入"></el-option>
                <el-option label="自动生成" value="自动生成"></el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="模块" prop="moduleId">
              <el-select v-model="form.moduleId">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="数据表类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
       
            <el-form-item label="状态" prop="status" class="type">
              <el-select v-model="form.status" placeholder="请选择类型">
                <el-option label="启用" value="1"></el-option>
                <el-option label="停用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" :rows="2" v-model="form.remarks" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="onCancle()">取 消</el-button>
        <el-button size="small" type="primary" @click="onChecked('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { constants } from "crypto";
import { SubmitForm, guid, DeleteStatus } from "@/assets/js/common.js";
export default {
  // 数据
  data() {
    var validateName = (rule, value, callback) => {
      if (this.name1!=value) {
        var reg = /^([a-zA-Z]*_*[a-zA-Z]*)*$/;
        if (!!value) {
          if (reg.test(value)) {
            this.postRequest("/api/" + this.serviceName + "/table/is/exist", {
              name: value
            }).then(result => {
              if (result) {
                callback(new Error("数据表名称重复"));
              } else {
                callback();
              }
            });
          } else {
            callback(new Error("请输入正确的表名称"));
          }
        } else {
          callback(new Error("数据表名称不能为空"));
        }
      } else {
        callback();
      }
    };
    return {
      loading:true,
      name1:'',
      options: [],
      typeOptions: [],
      serviceName: "",
      formInline: {
        name: "",
        title: "",
        type: ""
      },
      tableData: [],
      dialogAddVisible: false, //控制添加数据框
      currentPage: 1,
      form: {},
      editType: "add",
      updateData: "",
      //校验规则
      addRules: {
        moduleId: [
          { required: true, message: "请输入模块id", trigger: "blur" }
        ],
        // idType: [{ required: true, message: "请输入id类型", trigger: "blur" }],
        // // 校验名字不能重复，主要通过validator来指定验证器名称
        name: [{ required: true, validator: validateName, trigger: "blur" }],
        // title: [
        //   { required: true, message: "请输入数据表含义", trigger: "blur" }
        // ],
        shortName: [{ required: true, message: "请输入简称", trigger: "blur" }],
        type: [
          { required: true, message: "请输入数据表类型", trigger: "blur" }
        ],
        // summary: [{ required: true, message: "请输入简介", trigger: "blur" }],
        sortNo: [
          { required: true, message: "请输入排序码", trigger: "blur" },
          {  type: "number", message: "排序码必须为数字", trigger: "blur"}
        ]
      },
      currentRow: ""
    };
  },
  created() {
    this.loading = true;
    this.serviceName = this.$router.currentRoute.meta.serviceName;
    this.getTableData();
    this.getMoudle();
    this.getType();
  },
  //方法
  methods: {
    onSubmit() {
      var that = this;
      var data = that.formInline;
      that
        .postRequest("/api/" + this.serviceName + "/table/select/word", data)
        .then(result => {
          that.tableData = result.list;
        });
    },
    // 数据导出
    dataExport() {
      var that = this;
      window.open(
        "/api/" + this.serviceName + "/export/excel/tables",
        "_blank"
      );
    },
    // 获取模块
    getMoudle() {
      var that = this;
      that
        .postRequest("/api/" + this.serviceName + "/module/find/by/project/id")
        .then(result => {
          this.options = result;
        });
    },
    // 获取表的类型
    getType() {
      var that = this;
      that
        .postRequest("/api/" + this.serviceName + "/table/type/select/all")
        .then(result => {
          this.typeOptions = result;
        });
    },
    // 获取数据
    getTableData() {
      this.loading=true
      this.getRequest("/api/" + this.serviceName + "/table/select/all").then(
        result => {
          var tables = result.tables;
          for (var i = 0; i < tables.length; i++) {
            if (tables[i].status == 0) {
              tables[i].status = "停用";
            } else {
              tables[i].status = "启用";
            }
          }
          this.loading = false;
          this.tableData = tables;
        }
      );
    },

    // 删除表格中的数据
    handleDelete(index, data) {
      var that = this;
      DeleteStatus(
        this,
        "/api/" + this.serviceName + "/table/delete",
        {
          id: data.id
        },
        function() {
          that.getTableData();
        }
      );
    },
    // 添加/更新
    addTableData(type, data) {
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
      this.editType = type;
      if (type == "edit") {

        this.form = Object.assign({}, data);
         this.name1=this.form.name
               this.name1=this.form.name
        delete this.form.createTime;
        delete this.form.moduleName;
        delete this.form.typeName;
      } else {
        this.form = {
          id: guid(),
          projectId: "",
          moduleId: "",
          idType: "自动生成",
          name: "",
          title: "",
          shortName: "",
          type: "",
          summary: "",
          remarks: "",
          status: "1",
          sortNo:100
        };
      }
      this.dialogAddVisible = true;
    },
    //确定添加/更新
    onChecked() {
      var that = this;

      SubmitForm(
        this,
        "form",
        "form",
        this.editType,
        "/api/" + this.serviceName + "/table/insert",
        "/api/" + this.serviceName + "/table/update",
        function(e) {
          that.getTableData();
          that.dialogAddVisible = false;
        }
      );
    },
    // 取消
    onCancle() {
      var that = this;
      that.dialogAddVisible = false;
    },
    clickCurrent(e) {
      if(!!e){

     
      if (!!e.id) {
        this.currentRow = e.id;
      }
       }
    },
    manageField() {
      if (!this.currentRow) {
        this.$message({
          showClose: true,
          message: "请选择数据表进行管理"
        });
      } else {
        this.$router.push("fieldmanage?id=" + this.currentRow);
      }
    },
    manageIndex() {
      if (!this.currentRow) {
        this.$message({
          showClose: true,
          message: "请选择数据表进行管理"
        });
      } else {
        this.$router.push("indexmanage?id=" + this.currentRow);
      }
    }
  }
};
</script>
<style>
.add_btn {
  float: right;
  margin-bottom: 10px;
}
</style>