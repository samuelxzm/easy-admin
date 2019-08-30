<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <!-- 增加按钮 -->
    <div class="add_btn">
      <el-button type="primary" size="small" @click="showDialog('add')">增加</el-button>
    </div>
    <!-- 表格数据 -->
    <el-table :data="tableData" v-loading="tableLoading" border>
      <el-table-column type="index"  align="center" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" width="140" align="center" label="名称"></el-table-column>
      <el-table-column prop="placeName" width="140" align="center" label="环境名称"></el-table-column>
      <el-table-column prop="osType" width="140" align="center" label="系统类型"></el-table-column>
      <el-table-column prop="osVersion" width="140" align="center" label="系统版本"></el-table-column>
      <el-table-column prop="ipAddress" width="140" align="center" label="内网地址"></el-table-column>
      <el-table-column prop="ipAddressOut" align="center" label="外网地址"></el-table-column>
      <el-table-column prop="sortNo" align="center" label="排序码" width="80"></el-table-column>
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
      width="660px"
      title="服务器主机"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="serverHostForm"
        :rules="rules"
        ref="serverHostForm"
        size="small"
        label-width="110px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目" prop="projectId">
              <el-select v-model="serverHostForm.projectId">
                <el-option
                  v-for="item in projectOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布环境类型" prop="type">
              <el-select v-model="serverHostForm.type">
                <el-option
                  v-for="item in environmentOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作系统类型" prop="osType">
              <el-select v-model="serverHostForm.osType">
                <el-option label="windows" value="windows"></el-option>
                <el-option label="linux" value="linux"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="内网地址" prop="ipAddress">
              <el-input class="el_input" v-model="serverHostForm.ipAddress"></el-input>
            </el-form-item>
            <el-form-item label="排序码" prop="sortNo">
              <el-input class="el_input" v-model.number="serverHostForm.sortNo"></el-input>
            </el-form-item>
            <el-form-item label="安装docker" class="radio">
              <el-radio v-model="serverHostForm.hasDocker" label="1">是</el-radio>
              <el-radio v-model="serverHostForm.hasDocker" label="0">否</el-radio>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input class="el_input" v-model="serverHostForm.name"></el-input>
            </el-form-item>
            <el-form-item label="环境名称" prop="placeName">
              <el-input class="el_input" v-model="serverHostForm.placeName"></el-input>
            </el-form-item>
            <el-form-item label="操作系统版本" prop="osVersion">
              <el-input class="el_input" v-model="serverHostForm.osVersion"></el-input>
            </el-form-item>
            <el-form-item label="外网地址" prop="ipAddressOut">
              <el-input class="el_input" v-model="serverHostForm.ipAddressOut"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="serverHostForm.status">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="安装nginx" class="radio">
              <el-radio v-model="serverHostForm.hasNginx" label="1">是</el-radio>
              <el-radio v-model="serverHostForm.hasNginx" label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="说明">
          <el-input class="textarea" type="textarea" v-model="serverHostForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="serverHostFormCancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="serverHostFormSubmit('serverHostForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { SubmitForm, guid, DeleteStatus } from "@/assets/js/common.js";
import {isCheckIp} from "@/assets/js/validate.js"
export default {
  data() {
    return {
      tableLoading: true,
      dialogFormVisible: false,
      editType: "",
      tableData: [], //表格数据
      serverHostForm: {},
      projectOptions: [], //项目下拉选项
      environmentOptions: [], //环境下拉选项
      statusOptions: [], //状态下拉选项
      rules: {
        projectId: [
          { required: true, message: "请选择项目", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        type: [
          { required: true, message: "请选择发布环境类型", trigger: "change" }
        ],
        placeName: [
          { required: true, message: "请输入环境名称", trigger: "blur" }
        ],
        osType: [
          { required: true, message: "请选择操作系统类型", trigger: "change" }
        ],
        osVersion: [
          { required: true, message: "请输入操作系统版本", trigger: "blur" }
        ],
        ipAddress: [{ required: true, validator: isCheckIp, trigger: "blur" }],
        ipAddressOut: [
          { required: true, message: "请输入外网地址", trigger: "blur" }
        ],
        sortNo: [
          { required: true, message: "请输入排序码", trigger: "blur" },
          { type: "number", message: "排序码必须为数字", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      }
    };
  },
  created() {
    this.serviceName = this.$router.currentRoute.meta.serviceName;
    this.getOptions();
    this.getTableData();
  },
  methods: {
    // 获取表格所有数据
    getTableData() {
      let that = this;
      that
        .getRequest("/api/" + this.serviceName + "/server/host/query")
        .then(result => {
          that.tableData = result;
          that.tableLoading = false;
        });
    },
    // 获取表单所有下拉选择框数据
    getOptions() {
      //获取项目下拉选项
      this.getRequest("/api/" + this.serviceName + "/project/query").then(
        result => {
          this.projectOptions = result;
        }
      );
      // 获取环境类型下拉选项
      this.getRequest("/api/" + this.serviceName + "/run/type/query").then(
        result => {
          this.environmentOptions = result;
        }
      );
      // 获取状态下拉选项
      this.getRequest(
        "/api/" + this.serviceName + "/project/status/query"
      ).then(result => {
        this.statusOptions = result;
      });
    },
    //   点击增加、修改按钮
    showDialog(type, data) {
      if (this.$refs.serverHostForm) {
        this.$refs.serverHostForm.clearValidate();
      }
      this.editType = type;
      if (type == "edit") {
        this.serverHostForm = Object.assign({}, data);
        delete this.serverHostForm.createTime;
        delete this.serverHostForm.createUser;
      } else {
        this.serverHostForm = {
          projectId:
            this.projectOptions.length > 0 ? this.projectOptions[0].id : "",
          name: "",
          type:
            this.environmentOptions.length > 0
              ? this.environmentOptions[0].code
              : "",
          placeName: "",
          osType: "windows",
          osVersion: "",
          ipAddress: "",
          ipAddressOut: "",
          sortNo: 80,
          hasDocker: "1",
          hasNginx: "1",
          status:
            this.statusOptions.length > 0 ? this.statusOptions[0].code : "",
          description: ""
        };
      }
      this.dialogFormVisible = true;
    },
    // 确认提交表单
    serverHostFormSubmit(formName) {
      let that = this;
      let type = that.editType;
      let addSqlId = "/api/" + this.serviceName + "/server/host/add";
      let changeSqlId = "/api/" + this.serviceName + "/server/host/update";
      SubmitForm(
        this,
        formName,
        "serverHostForm",
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
    serverHostFormCancel() {
      this.dialogFormVisible = false;
    },
    // 点击删除按钮
    onDelete(index, row) {
      let that = this;
      let deleteUrl = "/api/" + this.serviceName + "/server/host/delete";
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