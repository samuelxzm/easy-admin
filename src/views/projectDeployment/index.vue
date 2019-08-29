<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <!-- 增加按钮 -->
    <div class="add_btn">
      <el-button type="primary" size="small" @click="showDialog('add')">增加</el-button>
    </div>
    <!-- 表格数据 -->
    <el-table v-loading="tableLoading" :data="tableData" border>
      <el-table-column prop="deployProject" width="160" align="center" label="部署项目"></el-table-column>
      <el-table-column prop="hostName" width="160" align="center" label="主机名称"></el-table-column>
      <el-table-column prop="deployMethod" width="160" align="center" label="部署方式"></el-table-column>
      <el-table-column prop="port" width="160" align="center" label="端口号"></el-table-column>
      <el-table-column prop="domainName" align="center" label="绑定域名"></el-table-column>
      <el-table-column align="center" width="140" label="操作">
        <template slot-scope="scope">
          <el-button
            circle
            plain
            type="primary"
            size="small"
            @click="showDialog('edit',scope.row)"
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
    <!-- 点击增加、修改按钮弹出框 -->
    <el-dialog
      title="项目的部署管理"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      width="660px"
    >
      <el-form
        :model="deploymentForm"
        :rules="rules"
        ref="deploymentForm"
        label-width="110px"
        size="small"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目" prop="projectId">
              <el-select v-model="deploymentForm.projectId">
                <el-option
                  v-for="item in projectOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部署方式" prop="method">
              <el-select v-model="deploymentForm.method">
                <el-option
                  v-for="item in deployMethodOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="端口号" prop="port">
              <el-input class="el_input" v-model="deploymentForm.port"></el-input>
            </el-form-item>
            <el-form-item label="容器ip(内网)" prop="dockerIp">
              <el-input class="el_input" v-model="deploymentForm.dockerIp"></el-input>
            </el-form-item>
            <el-form-item label="排序码" prop="sortNo">
              <el-input class="el_input" v-model.number="deploymentForm.sortNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部署项目" prop="codeProjectId">
              <el-select v-model="deploymentForm.codeProjectId">
                <el-option
                  v-for="item in projectDeployOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务器主机" prop="serverId">
              <el-select v-model="deploymentForm.serverId">
                <el-option
                  v-for="item in hostOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="docker名称" prop="dockerName">
              <el-input class="el_input" v-model="deploymentForm.dockerName"></el-input>
            </el-form-item>
            <el-form-item label="绑定域名" prop="domainName">
              <el-input class="el_input" v-model="deploymentForm.domainName"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="deploymentForm.status">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="说明">
          <el-input class="textarea" type="textarea" v-model="deploymentForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="deploymentFormCancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="deploymentFormSubmit('deploymentForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { SubmitForm, guid, DeleteStatus } from "@/assets/js/common.js";
export default {
  data() {
    // 端口号校验
    let checkPort = (rule, value, callback) => {
      let reg = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/;
      if (!value) {
        return callback(new Error("请输入端口号"));
      } else {
        let port = reg.test(value);
        if (!port) {
          return callback(new Error("请输入正确的端口号"));
        } else {
          callback();
        }
      }
    };
    // 内网ip校验
    let checkIp = (rule, value, callback) => {
      let reg = /^(([1-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*)|([1-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*))$/;
      if (!value) {
        return callback(new Error("请输入容器ip"));
      } else {
        let ip = reg.test(value);
        if (!ip) {
          return callback(new Error("请输入正确的ip地址"));
        } else {
          callback();
        }
      }
    };
    return {
      tableLoading: true,
      dialogFormVisible: false,
      editType: "",
      tableData: [],
      deploymentForm: {}, //编辑表单
      projectOptions: [], //项目下拉选项
      projectDeployOptions: [], //部署项目下拉选项
      deployMethodOptions: [], //部署方式下拉选项
      hostOptions: [], //服务器主机下拉选项
      statusOptions: [], //状态下拉选项
      rules: {
        projectId: [{ required: true, message: "请选择项目", trigger: "blur" }],
        codeProjectId: [
          { required: true, message: "请选择部署项目", trigger: "change" }
        ],
        method: [
          { required: true, message: "请选择部署方式", trigger: "change" }
        ],
        serverId: [
          { required: true, message: "请选择服务器主机", trigger: "change" }
        ],
        port: [{ required: true, validator: checkPort, trigger: "blur" }],
        dockerName: [
          { required: true, message: "请输入docker名称", trigger: "blur" }
        ],
        dockerIp: [{ required: true, validator: checkIp, trigger: "blur" }],
        domainName: [
          { required: true, message: "请输入绑定域名", trigger: "blur" }
        ],
        sortNo: [
          { required: true, message: "请输入排序码", trigger: "blur" },
          { type: "number", message: "排序码必须为数字", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.serviceName = this.$router.currentRoute.meta.serviceName;
    this.getTableData();
    this.getOptions();
  },
  methods: {
    //获取表格数据
    getTableData() {
      let that = this;
      that
        .getRequest("/api/" + this.serviceName + "/project/deploy/query")
        .then(result => {
          that.tableData = result;
          that.tableLoading = false;
        });
    },

    // 获取表单所有下拉框数据
    getOptions() {
      //获取所有项目
      this.getRequest("/api/" + this.serviceName + "/project/query").then(
        result => {
          this.projectOptions = result;
        }
      );
      //获取所有部署项目
      this.getRequest("/api/" + this.serviceName + "/code/project/query").then(
        result => {
          this.projectDeployOptions = result;
        }
      );
      // 获取所有部署方式
      this.getRequest("/api/" + this.serviceName + "/deploy/method/query").then(
        result => {
          this.deployMethodOptions = result;
        }
      );
      // 获取所有服务主机
      this.getRequest("/api/" + this.serviceName + "/server/host/query").then(
        result => {
          this.hostOptions = result;
        }
      );
      //获取所有状态
      this.getRequest(
        "/api/" + this.serviceName + "/project/status/query"
      ).then(result => {
        this.statusOptions = result;
      });
    },

    //   点击增加、修改按钮
    showDialog(type, data) {
      console.log(this.hostOptions.length);
      if (this.$refs.deploymentForm) {
        this.$refs.deploymentForm.clearValidate();
      }
      this.editType = type;
      if (type == "edit") {
        this.deploymentForm = Object.assign({}, data);
        delete this.deploymentForm.createTime;
        delete this.deploymentForm.createUser;
        delete this.deploymentForm.deployMethod;
        delete this.deploymentForm.deployProject;
        delete this.deploymentForm.hostName;
      } else {
        this.deploymentForm = {
          projectId:
            this.projectOptions.length > 0 ? this.projectOptions[0].id : "",
          codeProjectId:
            this.projectDeployOptions.length > 0
              ? this.projectDeployOptions[0].id
              : "",
          method:
            this.deployMethodOptions.length > 0
              ? this.deployMethodOptions[0].code
              : "",
          serverId: this.hostOptions.length > 0 ? this.hostOptions[0].id : "",
          port: "",
          dockerName: "",
          dockerIp: "",
          domainName: "",
          sortNo: 100,
          status: this.statusOptions > 0 ? this.statusOptions[0].code : "",
          description: ""
        };
      }
      this.dialogFormVisible = true;
    },

    // 确认提交表单
    deploymentFormSubmit(formName) {
      let that = this;
      let type = this.editType;
      let addSqlId = "/api/" + this.serviceName + "/project/deploy/add";
      let changeSqlId = "/api/" + this.serviceName + "/project/deploy/update";
      SubmitForm(
        this,
        formName,
        "deploymentForm",
        type,
        addSqlId,
        changeSqlId,
        function() {
          that.getTableData();
          that.dialogFormVisible = false;
        }
      );
    },

    // 取消提交表单
    deploymentFormCancel() {
      this.dialogFormVisible = false;
    },

    // 点击删除按钮
    onDelete(index, row) {
      let that = this;
      let deleteUrl = "/api/" + this.serviceName + "/project/deploy/delete";
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
  text-align: right;
  margin-bottom: 10px;
}
</style>