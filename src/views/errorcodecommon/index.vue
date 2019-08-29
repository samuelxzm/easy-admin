<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <div class="add_btn">
      <el-button type="primary" size="small" @click="addSubmit('add')">增加</el-button>
    </div>
    <el-table border :data="tableData" v-loading="loading">
      <el-table-column label="序号" type="index" width="50" align="center" valign="middle"></el-table-column>
      <el-table-column prop="code" label="编码"></el-table-column>

      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="level" label="级别" align="center" width="80"></el-table-column>
      <el-table-column prop="type" label="分类"></el-table-column>

      <el-table-column prop="frontendMessage" label="前台提示信息"></el-table-column>
      <el-table-column prop="backendMessage" label="后台提示信息"></el-table-column>
      <el-table-column prop="originMessage" label="原始信息"></el-table-column>
      <el-table-column prop="exception" label="异常"></el-table-column>
      <el-table-column prop="stackTrace" label="堆栈跟踪"></el-table-column>

      <el-table-column prop="description" label="说明"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="80">
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
    <!--增加内容的弹框-->
    <el-dialog title="业务错误编辑" :visible.sync="addDialog" :close-on-click-modal="false">
      <el-form
        :rules="rules"
        :model="studentForm"
        label-width="130px"
        ref="studentForm"
        size="small"
      >
        <!-- status-icon -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="编码" prop="code">
              <el-input v-model.number="studentForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="studentForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级别" prop="level">
              <el-input-number v-model="studentForm.level" :min="1" :max="9"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类" prop="type">
              <el-input v-model="studentForm.type"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="前台提示信息" prop="frontendMessage">
              <el-input v-model="studentForm.frontendMessage"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="后台提示信息" prop="backendMessage">
              <el-input v-model="studentForm.backendMessage"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原始信息" prop="originMessage">
              <el-input v-model="studentForm.originMessage"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="异常" prop="exception">
              <el-input v-model="studentForm.exception"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="堆栈跟踪" prop="stackTrace">
              <el-input v-model="studentForm.stackTrace"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="studentForm.status">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="说明" prop="description">
              <el-input type="textarea" v-model="studentForm.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
export default {
  name: "errorcodebizindex",
  data() {
    var validateName = (rule, value, callback) => {
      if (this.editType == "add" || this.name1 != value) {
        if (!!value) {
          this.postRequest(
            "/api/" + this.serviceName + "/jrr/errorCode_common/name",
            {
              name: value
            }
          ).then(result => {
            if (!result) {
              callback();
            } else {
              callback(new Error("名称重复"));
            }
          });
        } else {
          callback(new Error("名称不能为空"));
        }
      } else {
        callback();
      }
    };
    var validateCode = (rule, value, callback) => {
      if (this.editType == "add" || this.code1 != value) {
        if (!!value) {
          if (value > 1000) {
            callback(new Error("请输入1000以下编码"));
          } else {
            this.postRequest(
              "/api/" + this.serviceName + "/jrr/errorCode_common/code",
              {
                code: value
              }
            ).then(result => {
              if (!result) {
                callback();
              } else {
                callback(new Error("编码重复"));
              }
            });
          }
        } else {
          callback(new Error("编码不能为空"));
        }
      } else {
        callback();
      }
    };
    return {
      code1: "",
      name1: "",
      loading: true,
      serviceName: "",
      editType: "add",
      addDialog: false,
      statusOptions: [],
      studentForm: {},
      tableData: [],
      value: "",
      // 校验规则
      rules: {
        name: [
          {
            required: true, //是否必填
            validator: validateName,
            //message: "姓名不能为空", //规则
            trigger: "blur" //何事件触发
          }
        ],
        code: [
          {
            required: true, //是否必填
            validator: validateCode,
            //message: "姓名不能为空", //规则
            trigger: "blur" //何事件触发
          }
        ]
      }
    };
  },
  created() {
    this.serviceName = this.$router.currentRoute.meta.serviceName; //引用路由里面的serviceName
    this.getData(); //初始化页面时候的加载
    this.getOptions();
  },
  methods: {
    // 第一步获取数据
    getData() {
      this.loading = true;
      this.getRequest(
        "/api/ts-errorcode/error/code/common/select/all"
      ).then(result => {
        this.tableData = result;
        this.loading = false;
      });
    },
    getOptions() {
      var that = this;
      this.getRequest("/api/ts-projectdeploy/project/status/query").then(
        result => {
          that.statusOptions = result;
        }
      );
    },
    // 取消
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
        this.code1 = this.studentForm.code;
        this.name1 = this.studentForm.name;
        delete this.studentForm.createTime;
        delete this.studentForm.codeTypeName;
      } else {
        this.studentForm = {
          id: guid(),
          code: 1,
          name: "",
          level: 1,
          type: "",
          description: "",
          frontendMessage: "",
          backendMessage: "",
          status: "1",
          originMessage: "",
          exception: "",
          stackTrace: ""
        };
      }
      this.addDialog = true;
    },
    //增加和修改
    addSubmits() {
      var that = this;
      SubmitForm(
        this,
        "studentForm",
        "studentForm",
        this.editType,
        "/api/" + this.serviceName + "/cor/errorCode_common",
        "/api/" + this.serviceName + "/uor/errorCode_common",
        function() {
          that.getData();
          that.addDialog = false;
        }
      );
    },
    //删除数据
    deleteRow(index, data) {
      var that = this;
      DeleteStatus(
        this,
        "/api/" + this.serviceName + "/dor/errorCode_common",
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