<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <!-- 数据表搜索 -->

    <div class="add_btn">
      <el-button size="small" @click="showEditDialog('add')" type="primary">增加</el-button>
    </div>
    <!-- 数据表表格 -->
    <el-table
      border
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @current-change="clickCurrent"
    >
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="fields" label="索引字段">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.fields.split(',')" :key="index">{{item}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="isClustered" label="是否物理索引" width="120" align="center">
             <template slot-scope="scope">
          <span v-if="scope.row.isClustered==1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="isUnique" label="是否唯一索引"  width="120" align="center">
             <template slot-scope="scope">
          <span v-if="scope.row.isUnique==1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态"></el-table-column> -->
    
      <!-- <el-table-column prop="creatTime" label="记录创建时间"></el-table-column> -->
      <el-table-column label="操作" width="70" align="center">
        <template slot-scope="scope">
          <el-button
          circle
          plain
            type="danger"
            size="small"
            @click="handleDelete(scope.$index, scope.row)"
            icon="el-icon-delete"
          ></el-button>
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

    <el-dialog title="索引管理" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="editForm" ref="editForm" :rules="editRules" size="small" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否物理索引" prop="isClustered">
              <el-radio v-model="editForm.isClustered" label="1">是</el-radio>
              <el-radio v-model="editForm.isClustered" label="0">否</el-radio>
            </el-form-item>
            <el-form-item label="排序码" prop="sortNo">
              <el-input v-model.number="editForm.sortNo" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否唯一索引" prop="isUnique">
              <el-radio v-model="editForm.isUnique" label="1">是</el-radio>
              <el-radio v-model="editForm.isUnique" label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table ref="standardField" border :data="standardFieldData" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="dataType" label="数据类型"></el-table-column>
          <el-table-column prop="summary" label="说明"></el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="onCancle()">取 消</el-button>
        <el-button  size="small" type="primary" @click="onSubmit('form')">确 定</el-button>
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
      loading:'',
      serviceName:'',
      tableId: "",
      tableData: [],
      fieldTypeOption: [],
      statusOption: [{ code: 1, name: "启用" }, { code: 0, name: "停用" }],
      standardFieldData: [],
      editDialogVisible: false, //控制添加数据框
      standardDialogVisible: false,
      editType: "add",
      editForm: {},
      editRules: { 
                sortNo: [
          { required: true, message: "请输入排序码", trigger: "blur" },
          {type:"number",message:"排序码必须为数字",trigger:"blur"}
        ] 
      }
    };
  },
  created() {
    this.loading = true;
    this.serviceName=this.$router.currentRoute.meta.serviceName
    this.tableId = this.$router.currentRoute.query.id;
    this.getTableData();

    this.getStandardField();
  },
  //方法
  methods: {
    getTableData() {
      let that = this;
      this.postRequest("/api/"+this.serviceName+"/indexes/find/by/parent/id", {
        parentId: this.tableId
      }).then(result => {
        that.loading = false;
        that.tableData = result;
      });
    },

    getStandardField() {
      let that = this;
      this.postRequest("/api/"+this.serviceName+"/fields/select/tables/id", {
        parentId: this.tableId
      }).then(result => {
        that.standardFieldData = result.fieldList;
      });
    },
    addStandardField() {
      this.standardDialogVisible = true;
    },
    showEditDialog(type, data) {
              if (this.$refs.editForm) {
        this.$refs.editForm.clearValidate();
      }
      this.editType = type;
      if (type == "edit") {
        this.editForm = Object.assign({}, data);
        delete this.editForm.createTime;
      } else {
        this.editForm = {
          id: guid(),
          parentId: this.tableId,
          isClustered: "1",
          isUnique: "1",
          sortNo:100
        };
      }
      this.editDialogVisible = true;
    },
    onStandardFieldSubmit() {
      var that = this;
      this.$refs.standardField.selection.forEach(e => {
        this.editForm = { ...e, id: guid(), parentId: this.tableId };
        delete this.editForm.createTime;
        this.postRequest("/api/"+this.serviceName+"/fields/insert", this.editForm).then(result => {
          that.getTableData();
          that.onCancle();
        });
      });
    },
    onSubmit() {
      var that = this;

      let fields = [];
      this.$refs.standardField.selection.forEach(e => {
        fields.push(e.name);
      });
      this.editForm.fields = fields.join(",");
      console.log(this.editForm);
      SubmitForm(
        this,
        "editForm",
        "editForm",
        this.editType,
        "/api/"+this.serviceName+"/indexes/save",
        "/api/"+this.serviceName+"/fields/update",
        function() {
          that.getTableData();
          that.editDialogVisible = false;
        }
      );
    },
    editStatus(type, data) {
      let that = this;
      let url = type == "1" ? "/api/"+this.serviceName+"/fields/start" : "/api/"+this.serviceName+"/fields/stop";
      this.postRequest(url, { id: data.id }).then(result => {
        that.getTableData();
      });
    },
    handleDelete(index, data) {
      var that = this;
      DeleteStatus(
        this,
        "/api/"+this.serviceName+"/indexes/delete/by/id",
        {
          id: data.id
        },
        function() {
          that.getTableData();
        }
      );
    },
    // 取消添加
    onCancle() {
      if (!!this.$refs.standardField) {
        this.$refs.standardField.clearSelection();
      }
      this.editDialogVisible = false;
      this.standardDialogVisible = false;
    },
    //确定添
    clickCurrent(e) {
      // this.currentRow = e.number;
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