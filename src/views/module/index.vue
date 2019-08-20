<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="formModule" size="small" class="demo-form-inline">
      <el-form-item label="id">
        <el-input v-model="formModule.id"></el-input>
      </el-form-item>
      <el-form-item label="字段名称">
        <el-input v-model="formModule.name"></el-input>
      </el-form-item>
      <el-form-item label="查询范围">
        <el-select v-model="formModule.range">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formModule.status" placeholder="启用">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="text-align:right">
      <el-button size="small" @click="formAdd()">增加</el-button>
    </div>
    <!-- 表格数据 -->
    <el-table
      :data="tableData.filter(data => !formModule.id || data.id.toLowerCase().includes(formModule.id.toLowerCase()))"
      border
      :row-class-name="tableRowClassName"
      style="width: 100%"
    >
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column prop="id" width="150" label="id"></el-table-column>
      <el-table-column prop="name" label="字段名称"></el-table-column>
      <el-table-column prop="meaning" label="字段含义"></el-table-column>
      <el-table-column prop="type1" align="center" label="字段类型"></el-table-column>
      <el-table-column prop="type2" align="center" label="数据类型"></el-table-column>
      <el-table-column prop="check" align="center" label="校验"></el-table-column>
      <el-table-column prop="length" align="center" label="长度"></el-table-column>
      <el-table-column prop="default" align="center" label="默认值"></el-table-column>
      <el-table-column prop="sort" sortable align="center" label="排序码"></el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button size="small" @click="onEdit(scope.$index,scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="onDelete(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      style="text-align:right"
    ></el-pagination>
    <!-- 增加表格数据弹框 -->
    <el-dialog title="添加数据" :visible.sync="addFormVisible">
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
        inline
      >
        <el-form-item label="id" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="字段名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="字段含义" prop="meaning">
          <el-input v-model="addForm.meaning"></el-input>
        </el-form-item>
        <el-form-item label="字段类型" prop="type1">
          <el-input v-model="addForm.type1"></el-input>
        </el-form-item>
        <el-form-item label="数据类型">
          <el-input v-model="addForm.type2"></el-input>
        </el-form-item>
        <el-form-item label="长度">
          <el-input v-model="addForm.length"></el-input>
        </el-form-item>
        <el-form-item label="排序码">
          <el-input v-model="addForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="默认值">
          <el-input disabled v-model="addForm.default"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" @click="addSubmit('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改表格数据弹框 -->
    <el-dialog title="修改数据" :visible.sync="editFormVisible">
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
        inline
      >
        <el-form-item label="id" prop="id">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="字段名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="字段含义" prop="meaning">
          <el-input v-model="editForm.meaning"></el-input>
        </el-form-item>
        <el-form-item label="字段类型" prop="type1">
          <el-input v-model="editForm.type1"></el-input>
        </el-form-item>
        <el-form-item label="数据类型">
          <el-input v-model="editForm.type2"></el-input>
        </el-form-item>
        <el-form-item label="长度">
          <el-input v-model="editForm.length"></el-input>
        </el-form-item>
        <el-form-item label="排序码">
          <el-input v-model="editForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="默认值">
          <el-input disabled v-model="editForm.default"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCancel()">取 消</el-button>
        <el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      name1: "xujun",
      name2: "",
      currentPage4:4,
      addFormVisible: false,
      editFormVisible: false,
      formModule: {
        id: "",
        name: "",
        range: "",
        status: ""
      },
      addForm: {
        id: "",
        name: "",
        meaning: "",
        type1: "",
        type2: "",
        check: "",
        length: "",
        default: "newid()",
        sort: ""
      },
      editForm: {
        id: "",
        name: "",
        meaning: "",
        type1: "",
        type2: "",
        check: "",
        length: "",
        default: "",
        sort: ""
      },
      rules: {
        id: [{ required: true, message: "请输入id", trigger: "blur" }],
        name: [
          { required: true, message: "请输入字段名称", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" }
        ],
        meaning: [
          { required: true, message: "请输入字段含义", trigger: "blur" }
        ],
        type1: [{ required: true, message: "请输入字段类型", trigger: "blur" }]
      },
      tableData: [
        {
          id: "module_id",
          name: "id",
          meaning: "id",
          type1: "实体字段",
          type2: "id",
          check: "0",
          length: 50,
          default: "newid()",
          sort: 50
        },
        {
          id: "module_projectId",
          name: "projectId",
          meaning: "项目id",
          type1: "实体字段",
          type2: "整数",
          check: "0",
          length: 50,
          default: "newid()",
          sort: 60
        },
        {
          id: "module_name",
          name: "name",
          meaning: "名称",
          type1: "实体字段",
          type2: "字符串",
          check: "1",
          length: 50,
          default: "newid()",
          sort: 70
        },
        {
          id: "module_summary",
          name: "summary",
          meaning: "简介",
          type1: "实体字段",
          type2: "大文本",
          check: "1",
          length: 50,
          default: "newid()",
          sort: 80
        },
        {
          id: "module_sortNo",
          name: "sortNo",
          meaning: "排序码",
          type1: "实体字段",
          type2: "排序码",
          check: "1",
          length: 50,
          default: "newid()",
          sort: 90
        }
      ]
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    // 增加一行数据
    formAdd() {
      this.addFormVisible = true;
    },
    // 确认增加
    addSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.tableData.push(this.addForm);
          this.addFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消增加
    addCancel() {
      this.addFormVisible = false;
    },
    // 修改表格某一行数据
    onEdit(index, row) {
      this.editFormVisible = true;
      this.editForm = row;
    },
    // 确认修改
    editSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消修改
    editCancel() {
      this.editFormVisible = false;
    },
    // 删除表格某一行数据
    onDelete(index, row) {
      this.tableData.splice(index, 1);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

