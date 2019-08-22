<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <!-- 数据表搜索 -->
    <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      <el-form-item label="id">
        <el-input v-model="formInline.id" placeholder="id"></el-input>
      </el-form-item>
      <el-form-item label="表含义">
        <el-input v-model="formInline.mean" placeholder="表含义"></el-input>
      </el-form-item>
      <el-form-item label="数据类型">
        <el-input v-model="formInline.type" placeholder="数据类型"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="add_btn">
      <el-button size="small" @click="manageField()">字段管理</el-button>
      <el-button size="small" @click="manageIndex()">索引管理</el-button>
      <el-button size="small" @click="addTableData()">增加</el-button>
    </div>
    <!-- 数据表表格 -->
    <el-table
      border
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      :current-row-key="tableRowClassName"
      @current-change="clickCurrent"
    >
      <el-table-column prop="projectId" label="项目id" width="180"></el-table-column>
      <el-table-column prop="moduleId" label="模块id" width="180"></el-table-column>
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
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="small" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align:right;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    ></el-pagination>
    <!-- 添加数据 -->
    <el-dialog title="数据表管理" :visible.sync="dialogAddVisible">
      <el-form :model="form" :rules="addRules" ref="form" :inline="true" size="small">
        <el-form-item label="项目id" prop="projectId" :label-width="formLabelWidth">
          <el-input v-model="form.projectId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模块id" prop="moduleId" :label-width="formLabelWidth">
          <el-input v-model="form.moduleId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="id类型" prop="idType" :label-width="formLabelWidth">
          <el-input v-model="form.idType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据表的物理名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据表含义" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="shortName" :label-width="formLabelWidth">
          <el-input v-model="form.shortName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
          <el-input v-model="form.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据表的物理名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
          <el-input v-model="form.status" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks" :label-width="formLabelWidth">
          <el-input v-model="form.remarks" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancle()">取 消</el-button>
        <el-button type="primary" @click="onChecked('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改数据 -->
    <el-dialog title="数据表管理" :visible.sync="dialogUpdateVisible">
      <el-form :model="updateData" :rules="updateDataRuler" ref="form" :inline="true" size="small">
        <el-form-item label="id" prop="number" :label-width="formLabelWidth">
          <el-input v-model="updateData.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="表含义" prop="mean" :label-width="formLabelWidth">
          <el-input v-model="updateData.mean" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据表类型" prop="type" :label-width="formLabelWidth">
          <el-input v-model="updateData.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="id生成方式" prop="mode" :label-width="formLabelWidth">
          <el-input v-model="updateData.mode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
          <el-input v-model="updateData.status" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
          <el-input v-model="updateData.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateCancle()">取 消</el-button>
        <el-button type="primary" @click="updateChecked('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { constants } from "crypto";
import {guid} from "@assets/js/common.js"
export default {
  // 数据
  data() {
    return {
      formInline: {
        id: "",
        mean: "",
        type: ""
      },
      tableData: [
        {
          projectId: "2",
          moduleId: "2",
          idType: "2",
          name: "tables",
          title: "数据表",
          shortName: "数据表",
          type: "实体类",
          summary: "实体类",
          remarks: "无",
          sortNo: "120",
          status: "1",
          createUser: "作者"
        },
        {
          projectId: "2",
          moduleId: "2",
          idType: "2",
          name: "tables",
          title: "数据表",
          shortName: "数据表",
          type: "实体类",
          summary: "实体类",
          remarks: "无",
          sortNo: "120",
          status: "1",
          createUser: "作者"
        },
        {
          projectId: "2",
          moduleId: "2",
          idType: "2",
          name: "tables",
          title: "数据表",
          shortName: "数据表",
          type: "实体类",
          summary: "实体类",
          remarks: "无",
          sortNo: "120",
          status: "1",
          createUser: "作者"
        },
        {
          projectId: "2",
          moduleId: "2",
          idType: "2",
          name: "tables",
          title: "数据表",
          shortName: "数据表",
          type: "实体类",
          summary: "实体类",
          remarks: "无",
          sortNo: "120",
          status: "1",
          createUser: "作者"
        },
        {
          projectId: "2",
          moduleId: "2",
          idType: "2",
          name: "tables",
          title: "数据表",
          shortName: "数据表",
          type: "实体类",
          summary: "实体类",
          remarks: "无",
          sortNo: "120",
          status: "1",
          createUser: "作者"
        }
      ],
      dialogAddVisible: false, //控制添加数据框
      dialogUpdateVisible: false,
      currentPage: 1,
      formLabelWidth: "120px",
      form: {
        projectId: "", //项目id
        moduleId: "", //模块id
        idType: "", //id类型
        name: "", //数据表的物理名称
        title: "", //数据表含义
        shortName: "", //简称
        type: "", //类型
        summary: "", //简介
        remarks: "", //备注
        sortNo: "", //排序码
        status: "", //状态
        createUser: "" //记录创建人
      },
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
      updateDataRuler: {
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
      currentRow: ""
    };
  },
  // 获取数据
  created() {
    this.getRequest("/api/table/select/all").then(result => {
      console.log(result);
    });
  },
  //方法
  methods: {
    onSubmit() {
      let uuid = guid();
      console.log("submit!");
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 删除表格中的数据
    handleDelete(scope) {
      var that = this;
      that.tableData.splice(scope, 1);
    },
    // 添加数据
    addTableData() {
      this.dialogAddVisible = true;
    },
    // 取消添加
    onCancle() {
      var that = this;
      that.dialogAddVisible = false;
    },
    //确定添加
    onChecked(form) {
      var that = this;
      that.$refs[form].validate(valid => {
        if (valid) {
          console.log(that.form);
          that.postRequest("/api/table/insert").then(result => {
            console.log(result);
          });
          that.dialogAddVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 更新数据
    handleUpdate(index, row) {
      var that = this;
      that.dialogUpdateVisible = true;
      that.updateData = row;
    },
    // 更新取消
    updateCancle() {
      var that = this;
      that.dialogUpdateVisible = false;
    },
    // 更新确定
    updateChecked() {
      var that = this;
      that.dialogUpdateVisible = false;
    },
    clickCurrent(e) {
      this.currentRow = e.number;
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