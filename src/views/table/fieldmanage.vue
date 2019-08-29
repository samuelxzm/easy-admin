<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <!-- 数据表搜索 -->

    <div class="add_btn">
      <el-button size="small" type="primary" plain @click="dataExport()">字段导出</el-button>
      <el-button size="small" type="primary" plain @click="updateField()">更新表结构</el-button>
      <el-button size="small" type="primary" plain @click="addStandardField()">增加标准字段</el-button>
      <el-button size="small" type="primary" @click="showEditDialog('add')">增加</el-button>
    </div>
    <!-- 数据表表格 -->
    <el-table border :data="tableData" highlight-current-row @current-change="clickCurrent">
      <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="summary" label="字段含义"></el-table-column>
      <el-table-column prop="dataTypeName" label="字段类型"></el-table-column>
      <el-table-column prop="dataLength" label="长度"></el-table-column>
      <el-table-column prop="extendLength" label="小数位数"></el-table-column>
      <el-table-column prop="defaultValue" label="默认值"></el-table-column>

      <el-table-column prop="status" align="center" width="80"  label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1">启用</span>
          <span v-else>停用</span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <!-- <el-table-column prop="creatTime" label="记录创建时间"></el-table-column> -->
      <el-table-column label="操作" width="140" align="center">
        <template slot-scope="scope">
          <!-- <el-button v-if="scope.row.status==1" size="small" @click="editStatus('0',scope.row)">停用</el-button> -->
          <!-- <el-button v-else size="small" @click="editStatus('1',scope.row)">启用</el-button> -->
          <el-button
            circle
            plain
            type="primary"
            size="small"
            @click="showEditDialog('edit',scope.row)"
            icon="el-icon-edit"
          ></el-button>
          <el-button
            circle
            type="danger"
            size="small"
            plain
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
    <el-dialog title="添加标准字段" :visible.sync="standardDialogVisible" :close-on-click-modal="false">
      <el-table ref="standardField" border :data="standardFieldData" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column prop="dataType" label="数据类型" width="180"></el-table-column>
        <el-table-column prop="summary" label="说明"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="onCancle()">取 消</el-button>
        <el-button size="small" type="primary" @click="onStandardFieldSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="字段管理" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="editForm" ref="editForm" :rules="editRules" size="small" label-width="100px">
        <el-row>
          <el-col :span="12">
            <!-- <el-form-item label="id" prop="id">
              <el-input v-model="editForm.id" autocomplete="off"></el-input>
            </el-form-item>-->

            <el-form-item v-show="false" label="所属表Id" prop="parentId">
              <el-input v-model="editForm.parentId" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="名称" prop="name">
              <el-input v-model="editForm.name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="字段类型" prop="dataType">
              <el-select v-model="editForm.dataType">
                <el-option
                  v-for="item in fieldTypeOption"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="长度" prop="dataLength">
              <el-input v-model="editForm.dataLength" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="小数位数" prop="extendLength">
              <el-input v-model="editForm.extendLength" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认值" prop="defaultValue">
              <el-input v-model="editForm.defaultValue" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="summary">
              <el-input v-model="editForm.summary" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select v-model="editForm.status">
                <el-option
                  v-for="item in statusOption"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序码" prop="sortNo">
              <el-input v-model.number="editForm.sortNo" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="editForm.remarks"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="onCancle()">取 消</el-button>
        <el-button size="small" type="primary" @click="onSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { constants } from "crypto";
import { SubmitForm, guid, DeleteStatus } from "@/assets/js/common.js";
import ExportExcel from "@/components/ExportExcel";
export default {
  // 数据
  components: { ExportExcel },

  data() {
    var validateName = (rule, value, callback) => {
 
      if (this.name1!=value) {
        var reg = /^([a-zA-Z]*_*[a-zA-Z]*)*$/;
        if (!!value) {
          if (reg.test(value)) {
            this.postRequest("/api/" + this.serviceName + "/fields/is/exist/name", {
              	"parentId":this.tableId,
              name: value
            }).then(result => {
              if (result) {
                callback(new Error("数据表名称重复"));
              } else {
                callback();
              }
            });
          } else {
            callback(new Error("请输入正确的表名称"));
          }
        } else {
          callback(new Error("数据表名称不能为空"));
        }
      } else {
        callback();
      }
    };
    let isInteger = (rule, value, callback) => {
      console.log(Number(value));
      if (!value && value != 0) {
        return callback(new Error("输入不可以为空"));
      }
      setTimeout(() => {
        if (!Number(value) && Number(value) != 0) {
          callback(new Error("请输入正整数"));
        } else {
          const re = /^[0-9]*[1-9][0-9]*$/;
          const rsCheck = re.test(value);

          if (!rsCheck && value != 0) {
            callback(new Error("请输入正整数"));
          } else {
            callback();
          }
        }
      }, 0);
    };
    return {
      name1:'',
      loading:'',
      serviceName: "",
      tableId: "",
      tableData: [],
      fieldTypeOption: [],
      statusOption: [{ code: "1", name: "启用" }, { code: "0", name: "停用" }],
      standardFieldData: [],
      editDialogVisible: false, //控制添加数据框
      standardDialogVisible: false,
      editType: "add",
      editForm: {},
      editRules: {
        dataLength: [{ required: true, validator: isInteger, trigger: "blur" }],
        dataType: [
          { required: true, message: "请选择数据类型", trigger: "blur" }
        ],
        extendLength: [
          { required: true, validator: isInteger, trigger: "blur" }
        ],
       name: [{ required: true, validator: validateName, trigger: "blur" }],
        parentId: [
          { required: true, message: "请输入数据表Id", trigger: "blur" }
        ],
        summary: [
          { required: true, message: "请输入字段含义", trigger: "blur" }
        ],
        sortNo: [
          { required: true, message: "请输入排序码", trigger: "blur" },
          {type:"number",message:"排序码必须为数字",trigger:"blur"}
        ],
      }
    };
  },
  created() {
    this.loading = true;
    this.serviceName = this.$router.currentRoute.meta.serviceName;
    this.tableId = this.$router.currentRoute.query.id;
    this.getTableData();
    this.getSelectOption();
    this.getStandardField();
  },
  //方法
  methods: {
    getTableData() {
      let that = this;
      this.postRequest(
        "/api/" + this.serviceName + "/fields/select/tables/id",
        {
          parentId: this.tableId
        }
      ).then(result => {
        that.loading = false;
        that.tableData = result.fieldList;
      });
    },
    getSelectOption() {
      let that = this;
      this.getRequest(
        "/api/" + this.serviceName + "/field/type/select/all"
      ).then(result => {
        that.fieldTypeOption = result;
      });
    },
    getStandardField() {
      let that = this;
      this.postRequest(
        "/api/" + this.serviceName + "/fields/select/tables/id",
        {
          parentId: "template_standardField"
        }
      ).then(result => {
        that.standardFieldData = result.fieldList;
      });
    },
    dataExport() {
      var that = this;
      window.open("/api/" + this.serviceName + "/export/excel/fields", "_blank");
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
        this.name1=this.editForm.name
        delete this.editForm.createTime;
        delete this.editForm.dataTypeName;
      } else {
        this.editForm = {
          dataLength: 0,
          dataType: "",
          defaultValue: "",
          extendLength: 0,
          id: guid(),
          name: "",
          parentId: this.tableId,
          remarks: "",
          status: "1",
          sortNo:100,
          summary: ""
        };
      }
      this.editDialogVisible = true;
    },
    onStandardFieldSubmit() {
      var that = this;
      this.$refs.standardField.selection.forEach(e => {
        delete e.dataTypeName
        this.editForm = { ...e, id: guid(), parentId: this.tableId };
        delete this.editForm.createTime;
        this.postRequest(
          "/api/" + this.serviceName + "/fields/insert",
          this.editForm
        ).then(result => {
          that.getTableData();
          that.onCancle();
        });
      });
    },
    onSubmit() {
      var that = this;
      SubmitForm(
        this,
        "editForm",
        "editForm",
        this.editType,
        "/api/" + this.serviceName + "/fields/insert",
        "/api/" + this.serviceName + "/fields/update",
        function() {
          that.getTableData();
          that.editDialogVisible = false;
        }
      );
    },
    editStatus(type, data) {
      let that = this;
      let url =
        type == "1"
          ? "/api/" + this.serviceName + "/fields/start"
          : "/api/" + this.serviceName + "/fields/stop";
      this.postRequest(url, { id: data.id }).then(result => {
        that.getTableData();
      });
    },
    handleDelete(index, data) {
      var that = this;
      DeleteStatus(
        this,
        "/api/" + this.serviceName + "/fields/delete",
        {
          id: data.id
        },
        function() {
          that.getTableData();
        }
      );
    },
    updateField() {
      let that = this;
      this.postRequest(
        "/api/" + this.serviceName + "/fields/get/table/update",
        { parentId: this.tableId }
      ).then(result => {
        that.$notify({
          customClass: "upField",
          title: "提示",
          message: result,
          duration: 0,
          offset: 60
        });
      });
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
.upField {
  min-width:400px;
  white-space: pre-wrap;
}
</style>