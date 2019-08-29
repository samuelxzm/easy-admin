<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <!-- 增加数据 -->
    <div class="add_btn">
      <el-button type="primary" size="small" @click="showEditDialog('add')">增加</el-button>
    </div>
    <!-- 表格数据 -->
    <el-table v-loading="tableLoading" :data="tableData" border>
      <el-table-column type="index"  align="center" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" align="center" width="180" label="模块名称"></el-table-column>
      <el-table-column prop="summary" align="center" label="简介"></el-table-column>
      <el-table-column prop="createUser" align="center" width="180" label="创建人"></el-table-column>
      <el-table-column prop="createTime" align="center" width="180" label="创建时间"></el-table-column>
      <el-table-column label="操作" align="center" width="140">
        <template slot-scope="scope">
          <el-button
            circle
            plain
            type="primary"
            size="small"
            @click="showEditDialog('edit',scope.row)"
            icon="el-icon-edit"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="onDelete(scope.$index,scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格分页 -->
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      style="text-align:right"
    ></el-pagination>-->
    <!-- 增加表格数据弹框 -->
    <el-dialog
      title="模块管理"
      :visible.sync="moduleFormVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="moduleForm" :rules="rules" ref="moduleForm"  size="small" label-width="80px">
        <el-form-item label="模块名称" prop="name">
          <el-input v-model="moduleForm.name" :disabled="editType=='edit'"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="summary">
          <el-input v-model="moduleForm.summary"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="createUser">
          <el-input v-model="moduleForm.createUser"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="moduleFormCancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="moduleFormSubmit('moduleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { SubmitForm, guid, DeleteStatus } from "@/assets/js/common.js";
export default {
  data() {
    // 模块名称校验
    var validateName = (rule, value, callback) => {
      if (this.editType == "add") {
        var reg = /^[a-zA-Z]+$/;
        if (!!value) {
          if (reg.test(value)) {
            this.postRequest("/api/" + this.serviceName + "/module/get/by/name", {
              name: value
            }).then(result => {
              if (result) {
                callback(new Error("模块名称重复"));
              } else {
                callback();
              }
            });
          } else {
            callback(new Error("请输入英文"));
          }
        } else {
          callback(new Error("数据表名称不能为空"));
        }
      }
      else{
        callback()
      }
    };
    return {
      tableLoading: "",
      serviceName: "",
      currentPage4: 4, //当前页
      moduleFormVisible: false, //控制修改添加数据弹出框
      type: "",
      moduleForm: {}, //修改添加数据表单
      editType: "add",
      // 校验规则
      rules: {
        id: [{ required: true, message: "请输入id", trigger: "blur" }],
        name: [{ required: true, validator: validateName, trigger: "blur" }],
        summary: [{ required: true, message: "请输入简介", trigger: "blur" }]
      },
      tableData: [] // 表格数据
    };
  },
  created() {
    this.serviceName = this.$router.currentRoute.meta.serviceName;
    this.getTableData();
  },
  methods: {
    // 获取表格数据
    getTableData() {
      let that = this;
      that
        .postRequest("/api/" + this.serviceName + "/module/find/by/project/id")
        .then(result => {
          that.tableLoading = false;
          that.tableData = result;
        });
    },
    // 点击增加修改按钮
    showEditDialog(type, data) {
      if (this.$refs.moduleForm) {
        this.$refs.moduleForm.clearValidate();
      }
      this.editType = type;
      if (type == "edit") {
        this.moduleForm = Object.assign({}, data);
        delete this.moduleForm.createTime;
      } else {
        this.moduleForm = {
          name: "",
          summary: "",
          createUser: "",
          id: guid()
        };
      }
      this.moduleFormVisible = true;
    },
    // 确认增加修改数据
    moduleFormSubmit(formName) {
      let that = this;
      let type = this.editType;
      let addSqlId = "/api/" + this.serviceName + "/module/save";
      let changeSqlId = "/api/" + this.serviceName + "/module/update";
      SubmitForm(
        this,
        formName,
        "moduleForm",
        type,
        addSqlId,
        changeSqlId,
        function() {
          that.getTableData();
          that.moduleFormVisible = false;
        }
      );
    },
    // 取消增加修改
    moduleFormCancel() {
      this.moduleFormVisible = false;
    },
    // 删除表格某一行数据
    onDelete(index, row) {
      let that = this;
      let deleteUrl = "/api/" + this.serviceName + "/module/delete/by/id";
      let data = { id: row.id };
      DeleteStatus(this, deleteUrl, data, function() {
        that.getTableData();
      });
    }
  }
};
</script>
<style scoped>
.add_btn {
  float: right;
  margin-bottom: 10px;
}
</style>

