<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <el-form :inline="true" :model="formLine" size="small">
      <el-form-item label="账号">
        <el-input v-model="formLine.code" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formLine.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formLine.status" placeholder="请选择" style="width: 100px;">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit"></el-button>
      </el-form-item>
    </el-form>
    <div class="add_btn">
      <el-button type="primary" size="small" @click="addSubmit('add')">增加</el-button>
    </div>

    <!--增加内容的弹框-->

    <el-table v-loading="loading" border :data="tableData">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column prop="code" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="sortNo" label="排序码" width="80" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1">启用</span>
          <span v-else>停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center">
        <template slot-scope="scope">
          <el-button
            circle
            plain
            type="primary"
            size="small"
            @click="addSubmit('edit',scope.row)"
            icon="el-icon-edit"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            size="small"
            @click="deleteRow(scope.$index,scope.row)"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="增加用户" :visible.sync="addDialog" width="400px" :close-on-click-modal="false">
      <el-form :rules="rules" size="small" :model="studentForm" label-width="80px" ref="studentForm">
        <!-- status-icon -->
        <el-form-item label="账号" prop="code">
          <el-input v-model="studentForm.code"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="studentForm.name"></el-input>
        </el-form-item>

        <el-form-item label="排序码" prop="sortNo">
          <el-input v-model="studentForm.sortNo"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="studentForm.status" style="width: 100px;">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addCancel('studentForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="addSubmits('studentForm')">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
//	import { guid } from "@/assets/js/common.js";
import { SubmitForm, guid, DeleteStatus } from "@/assets/js/common.js";
import { isInteger } from '@/assets/js/validate.js'
export default {
  name:"userindex",
  // 获取数据
  data() {
    var validateCode = (rule, value, callback) => {
      if (this.editType == "add" || this.name1 != value) {
        if (!!value) {
          this.postRequest("/api/" + this.serviceName + "/user/get/by/code", {
            code: value
          }).then(result => {
            if (!result) {
              callback();
            } else {
              callback(new Error("账号重复"));
            }
          });
        } else {
          callback(new Error("账号不能为空"));
        }
      } else {
        callback();
      }
    };
    return {
      loading: true,
      // 校验规则
      rules: {
        // 校验手机号码，主要通过validator来指定验证器名称
        code: [
          {
            required: true,
            validator: validateCode,
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true, //是否必填
            message: "姓名不能为空", //规则
            trigger: "blur" //何事件触发
          }
        ],
        sortNo: [{ required: true, validator: isInteger, trigger: "blur" }]
      },
      name1:'',
      serviceName: "",
      studentDialog: false,
      editType: "add",
      addDialog: false,
      studentForm: {},

      formLine: {
        code: "",
        name: "",
        status: ""
      },
      tableData: [],
      value: ""
    };
  },
  created() {
    this.serviceName = this.$router.currentRoute.meta.serviceName;
    this.getData();
  },

  methods: {
    getData() {
      this.loading = true;
      this.getRequest("/api/" + this.serviceName + "/user/get/all").then(
        result => {
          this.tableData = result;
          this.loading = false;
        }
      );
    },
    onSubmit() {
      var form = this.formLine;
      this.postRequest(
        "/api/" + this.serviceName + "/user/get/by/param",
        form
      ).then(result => {
        this.tableData = result.data;
      });
    },
    // 取消添加
    addCancel() {
      this.addDialog = false;
    },
    // 确认添加
    addSubmit(type, data) {
      if (this.$refs.studentForm) {
        this.$refs.studentForm.clearValidate();
      }
      this.editType = type;
      if (type == "edit") {
        this.studentForm = Object.assign({}, data);
        this.name1 = this.studentForm.name
        delete this.studentForm.createTime;
      } else {
        this.studentForm = {
          name: "",
          code: "",
          status: "1",
          id: guid(),
          sortNo: "80"
        };
      }
      this.addDialog = true;
    },
    addSubmits() {
      var that = this;
      SubmitForm(
        this,
        "studentForm",
        "studentForm",
        this.editType,
        "/api/" + this.serviceName + "/user/save",
        "/api/" + this.serviceName + "/user/update",
        function() {
          that.getData();
          that.addDialog = false;
        }
      );
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    //删除数据
    deleteRow(index, data) {
      var that = this;
      DeleteStatus(
        this,
        "/api/" + this.serviceName + "/user/delete/by/id",
        {
          id: data.id
        },
        function() {
          that.getData();
        }
      );
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