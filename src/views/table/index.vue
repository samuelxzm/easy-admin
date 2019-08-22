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
      :current-row-key="number"
      @current-change="clickCurrent"
    >
      <el-table-column prop="number" label="id" width="180"></el-table-column>
      <el-table-column prop="mean" label="表含义" width="180"></el-table-column>
      <el-table-column prop="type" label="数据表类型"></el-table-column>
      <el-table-column prop="mode" label="id生成方式"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
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
        <el-form-item label="id" prop="number" :label-width="formLabelWidth">
          <el-input v-model="form.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="表含义" prop="mean" :label-width="formLabelWidth">
          <el-input v-model="form.mean" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据表类型" prop="type" :label-width="formLabelWidth">
          <el-input v-model="form.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="id生成方式" prop="mode" :label-width="formLabelWidth">
          <el-input v-model="form.mode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
          <el-input v-model="form.status" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
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
import { guid } from "@/assets/js/common.js";
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
          number: "002",
          mean: "表类型",
          type: "实体表",
          mode: "guid方式",
          status: "启用",
          remark: "广东省根深蒂固"
        },
        {
          number: "003",
          mean: "字典管理表",
          type: "实体表1",
          mode: "手工录入",
          status: "禁用",
          remark: "大萨达撒多"
        },
        {
          number: "004",
          mean: "字段类型",
          type: "实体表2",
          mode: "guid方式",
          status: "禁用",
          remark: "工艺申冬奥山东加速度啊"
        },
        {
          number: "005",
          mean: "启用状态字典",
          type: "实体表3",
          mode: "手工录入",
          status: "启用",
          remark: "发哦律师费加拉斯附近"
        },
        {
          number: "006",
          mean: "用户表",
          type: "哈希表",
          mode: "guid方式",
          status: "启用",
          remark: "伽师瓜垃圾啊斯洛伐克"
        }
      ],
      dialogAddVisible: false, //控制添加数据框
      dialogUpdateVisible: false,
      currentPage: 1,
      formLabelWidth: "120px",
      form: {
        number: "",
        mean: "",
        type: "",
        mode: "",
        status: "",
        remark: ""
      },
      updateData: "",
      //添加数据校验规则
      addRules: {
        number: [{ required: true, message: "请输入id", trigger: "blur" }],
        mean: [{ required: true, message: "请输入表含义", trigger: "blur" }],
        type: [
          { required: true, message: "请输入数据表类型", trigger: "blur" }
        ],
        mode: [
          { required: true, message: "请输入id生成方式", trigger: "blur" }
        ],
        status: [{ required: true, message: "请输入状态", trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      },
      updateDataRuler: {
        number: [{ required: true, message: "请输入id", trigger: "blur" }],
        mean: [{ required: true, message: "请输入表含义", trigger: "blur" }],
        type: [
          { required: true, message: "请输入数据表类型", trigger: "blur" }
        ],
        mode: [
          { required: true, message: "请输入id生成方式", trigger: "blur" }
        ],
        status: [{ required: true, message: "请输入状态", trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      },
      currentRow: ""
    };
  },
  created() {
    let uuid = guid();
    console.log(uuid);
    this.getRequest("/api/table/select/all").then(result => {});
  },
  //方法
  methods: {
    onSubmit() {
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