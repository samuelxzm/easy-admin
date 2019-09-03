<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <el-form :inline="true" :model="formLine" size="small">
      <el-form-item label="关键字">
        <el-input v-model="formLine.keyword" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <!-- <el-form-item label="姓名">
				<el-input v-model="formLine.name" placeholder="请输入姓名"></el-input>
      </el-form-item>-->
      <el-form-item label="状态">
        <el-select v-model="formLine.status" placeholder="请选择" style="width: 100px;">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getData"></el-button>
      </el-form-item>
    </el-form>
    <div class="add_btn">
      <el-button type="primary" size="small" @click="addSubmit('add')">增加</el-button>
    </div>
    <el-table border :data="tableData" ref="table">
      <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="gitName" width="140" label="名称（git）"></el-table-column>
      <el-table-column prop="tinyServiceName" width="140" label="名称（微服务）"></el-table-column>
      <el-table-column prop="projectName" label="项目名称"></el-table-column>
      <el-table-column prop="author" label="作者"></el-table-column>
      <el-table-column prop="description" label="说明"></el-table-column>
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
    <!--增加内容的弹框-->
    <el-dialog title="代码项目管理增加" :visible.sync="addDialog" :close-on-click-modal="false">
      <el-form
        :rules="rules"
        :model="studentForm"
        label-width="120px"
        ref="studentForm"
        size="small"
      >
        <!-- status-icon -->
        <el-row>
          <!--<el-col :span="12">
						<el-form-item label="项目" prop="projectId">
							<el-select v-model="studentForm.projectId" :disabled="editType=='edit'" placeholder="请选择项目" style="width: 100%;">
								<el-option label="区域一" value="shanghai"></el-option>
								<el-option label="区域二" value="beijing"></el-option>
							</el-select>
						</el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="studentForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="studentForm.type" placeholder="请选择项目" style="width: 100%;">
                <el-option
                  v-for="item in GitTypeOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="git仓库" prop="gitRepositoryId">
              <el-select
                v-model="studentForm.gitRepositoryId"
                placeholder="请选择项目"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in GitMoldOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="git上名称" prop="gitName">
              <el-input v-model="studentForm.gitName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微服务名称" prop="tinyServiceName">
              <el-input v-model="studentForm.tinyServiceName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="studentForm.projectName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包名称" prop="packageName">
              <el-input v-model="studentForm.packageName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="studentForm.author"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排序码" prop="sortNo">
              <el-input v-model="studentForm.sortNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否需要部署" prop="requireDeploy">
              <el-radio v-model="studentForm.requireDeploy" label="1">是</el-radio>
              <el-radio v-model="studentForm.requireDeploy" label="0">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio v-model="studentForm.status" label="1">是</el-radio>
              <el-radio v-model="studentForm.status" label="0">否</el-radio>
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
import {
  SubmitForm,
  guid,
  DeleteStatus,
  moldStatus
} from "@/assets/js/common.js";
export default {
  name: "gitcodeindex",
  data() {
    var validateName = (rule, value, callback) => {
      if (this.editType == "add" || this.name1 != value) {
        if (!!value) {
          this.postRequest(
            "/api/" + this.serviceName + "/jrr/codeProject/name",
            { name: value }
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
    return {
      name1: "",
      loading: true,
      // 校验规则
      rules: {
        name: [
          {
            required: true, //是否必填
            validator: validateName,
            trigger: "blur" //何事件触发
          }
        ]
      },
      serviceName: "",
      studentDialog: false,
      editType: "add",
      addDialog: false,
      studentForm: {},
      tableData: [],
      GitTypeOption: [],
      GitMoldOption: [],
      value: "",
      formLine: {
        keyword: "",
        status: ""
      }
    };
  },
  created() {
    this.serviceName = this.$router.currentRoute.meta.serviceName;
    this.getGitType();
    this.getGitMold();
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取数据
    getData() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        target: document.querySelector(".el-table")
      });
      console.log(loading);
      loading.close();
      console.log(loading);
      this.postRequest("/api/common-dataset/getds/code", {
        orderBy: "createTime desc",
        condition: {
          "name,description,author": this.formLine.keyword,
          type: "9E3ADA6B-180C-4332-BF4F-97B741E33FC7,1",
          status: "" + this.formLine.status
        },
        column: "name,id,gitName,status,packageName,projectName,sortNo,tinyServiceName,author,description",
        pageSize: "10",
        pageNumber: "1",
        needTotalRow: "1"
      }).then(result => {
        this.tableData = result.list;
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
        this.name1 = this.studentForm.name;
        delete this.studentForm.createTime;
      } else {
        this.studentForm = {
          name: "",
          status: "1",
          requireDeploy: "1",
          tinyServiceName: "",
          projectName: "",
          packageName: "",
          author: "",
          description: "",
          sortNo: "100",
          gitName: "",
          gitRepositoryId:
            this.GitMoldOption.length > 0 ? this.GitMoldOption[0].id : "",
          type: this.GitTypeOption.length > 0 ? this.GitTypeOption[0].code : ""
        };
      }
      this.addDialog = true;
    },
    //			增加和修改
    addSubmits() {
      var that = this;
      delete this.studentForm.codeTypeName;
      SubmitForm(
        this,
        "studentForm",
        "studentForm",
        this.editType,
        "/api/" + this.serviceName + "/cor/codeProject",
        "/api/" + this.serviceName + "/uor/codeProject",
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
        "/api/" + this.serviceName + "/dor/codeProject",
        {
          id: data.id
        },
        function() {
          that.getData();
        }
      );
    },
    //类型
    getGitType() {
      var that = this;
      that
        .getRequest("/api/" + this.serviceName + "/gar/dic_codeType")
        .then(result => {
          that.GitTypeOption = result;
        });
    },
    //git仓库
    getGitMold() {
      var that = this;
      that
        .getRequest("/api/" + this.serviceName + "/gar/gitRepository")
        .then(result => {
          that.GitMoldOption = result;
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