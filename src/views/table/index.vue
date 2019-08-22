<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <!-- 数据表搜索 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item label="id">
        <el-input v-model="formInline.name" placeholder="id"></el-input>
      </el-form-item>
      <el-form-item label="表含义">
        <el-input v-model="formInline.title" placeholder="表含义"></el-input>
      </el-form-item>
      <el-form-item label="数据名称">
        <el-input v-model="formInline.type" placeholder="数据名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="add_btn">
      <el-button size="small" @click="manageField()">字段管理</el-button>
      <el-button size="small" @click="manageIndex()">索引管理</el-button>
      <el-button size="small" @click="addTableData('add')">增加</el-button>
    </div>
    <!-- 数据表表格 -->
    <el-table
      border
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @current-change="clickCurrent"
    >
      <el-table-column prop="id" label="id" width="180"></el-table-column>
      <el-table-column prop="projectId" label="项目id" width="100"></el-table-column>
      <el-table-column prop="moduleId" label="模块id" width="100"></el-table-column>
      <el-table-column prop="idType" label="id类型"></el-table-column>
      <el-table-column prop="name" label="数据表的物理名称"></el-table-column>
      <el-table-column prop="title" label="数据表含义"></el-table-column>
      <el-table-column prop="shortName" label="简称"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="summary" label="简介"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <el-table-column prop="sortNo" label="排序码"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="createUser" label="记录创建人"></el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="addTableData('edit', scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      style="text-align:right;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    ></el-pagination>-->
    <!-- 编辑数据 -->
    <el-dialog title="数据表管理" :visible.sync="dialogAddVisible">
      <el-form :model="form" :rules="addRules" ref="form" :inline="true" size="small">
        <el-form-item label="id" prop="id">
          <el-input v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目id" prop="projectId" :label-width="formLabelWidth">
          <el-input v-model="form.projectId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模块id" prop="moduleId" :label-width="formLabelWidth">
          <el-input v-model="form.moduleId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="id类型" prop="idType" :label-width="formLabelWidth">
          <el-select v-model="form.idType" placeholder="请选择类型">
            <el-option label="0" value="0"></el-option>
            <el-option label="1" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据表名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据表含义" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="shortName" :label-width="formLabelWidth">
          <el-input v-model="form.shortName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据表类型" prop="type" :label-width="formLabelWidth">
          <el-input v-model="form.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="summary" :label-width="formLabelWidth">
          <el-input v-model="form.summary" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择类型">
            <el-option label="0" value="0"></el-option>
            <el-option label="1" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序码" prop="sortNo" :label-width="formLabelWidth">
          <el-input v-model="form.sortNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="记录创建人" prop="createUser" :label-width="formLabelWidth">
          <el-input v-model="form.createUser" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.remarks" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancle()">取 消</el-button>
        <el-button type="primary" @click="onChecked('form')">确 定</el-button>
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
    return {
      formInline: {
        "name":"",
	      "title":"",
	      "type":""
      },
      tableData: [],
      dialogAddVisible: false, //控制添加数据框
      dialogUpdateVisible: false,
      currentPage: 1,
      formLabelWidth: "120px",
      form: {},
      editType: "add",
      updateData: "",
      //添加数据校验规则
      addRules: {
        projectId: [
          { required: true, message: "请输入项目id", trigger: "blur" }
        ],
        moduleId: [
          { required: true, message: "请输入模块id", trigger: "blur" }
        ],
        idType: [{ required: true, message: "请输入id类型", trigger: "blur" }],
        name: [
          { required: true, message: "请输入数据表的物理名称", trigger: "blur" }
        ],
        title: [
          { required: true, message: "请输入数据表含义", trigger: "blur" }
        ],
        shortName: [{ required: true, message: "请输入简称", trigger: "blur" }],
        type: [
          { required: true, message: "请输入数据表类型", trigger: "blur" }
        ],
        summary: [{ required: true, message: "请输入简介", trigger: "blur" }],
        remarks: [{ required: true, message: "请输入备注", trigger: "blur" }],
        sortNo: [{ required: true, message: "请输入排序码", trigger: "blur" }],
        status: [{ required: true, message: "请输入状态", trigger: "blur" }],
        createUser: [
          { required: true, message: "请输入记录创建人", trigger: "blur" }
        ]
      },
      currentRow: "",
      // 校验规则
      addRules: {
        name: [
        { required: true, //是否必填
          message: '表名不能重复', //规则
          trigger: 'blur'  //何事件触发
        }
      ]
      },
      // var validateName = (rule, value, callback) => {
      // if (!value) {
      //   return callback(new Error('号码不能为空!!'))
      // }
      // setTimeout(() => {
      //   if (!phoneReg.test(value)) {
      //     callback(new Error('格式有误'))
      //   } else {
      //     callback()
      //   }
      // }, 1000)
    // }
    };
  },
  created() {
    this.getTableData();
  },
  //方法
  methods: {
    onSubmit() {
      var that = this;
      var data = that.formInline;
      that.postRequest("/api/table/select/word",data).then(result => {
        that.tableData =result.list;
      });
    },
    // 获取数据
    getTableData() {
      this.getRequest("/api/table/select/all").then(result => {
        var tables = result.tables;
        this.tableData = tables;
      });
    },
    // 根据id查询

    // 删除表格中的数据
    handleDelete(index, data) {
      var that = this;
      DeleteStatus(
        this,
        "/api/table/delete",
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
      this.editType = type;
      if (type == "edit") {
        this.form = Object.assign({}, data);
        delete this.form.createTime;
      } else {
        this.form = {
          id:guid(),
          projectId: "",
          moduleId: "",
          idType: "",
          name: "",
          title: "",
          shortName: "",
          type: "",
          summary: "",
          remarks: "",
          sortNo: "",
          status: "",
          createUser: ""
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
        "/api/table/insert",
        "/api/table/update",
        function(e) {
          that.getTableData();
          that.dialogAddVisible = false;
        }
      );
    },
    // 取消
    onCancle(){
      var that = this;
      that.dialogAddVisible = false;
    },
    clickCurrent(e) {
      console.log(e);
      // this.currentRow = e.number;
    },
    manageField() {
      if (!this.currentRow) {
        this.$message({
          showClose: true,
          message: "请选择数据表进行管理"
        });
      } else {
        this.$router.push("fieldmanage");
      }
    },
    manageIndex() {
      if (!this.currentRow) {
        this.$message({
          showClose: true,
          message: "请选择数据表进行管理"
        });
      } else {
        this.$router.push("indexmanage");
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