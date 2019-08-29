// 数据集管理
<template>
  <el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
    <div class="add_btn">
      <el-button size="small" type="primary" @click="addTableData('add')">增加</el-button>
    </div>
    <!-- 数据集表格 -->
    <el-table
      border
      :data="tableData"
      style="width: 100%;"
      highlight-current-row
      @current-change="clickCurrent"
       v-loading="loading"
    >
      <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="moduleId" label="模块"></el-table-column>
      <el-table-column prop="sortNo" label="排序"></el-table-column>
      <el-table-column prop="description" label="说明"></el-table-column>
      <el-table-column label="操作" width="140" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            circle
            plain
            type="primary"
            icon="el-icon-edit"
            @click="addTableData('edit', scope.row)"
          ></el-button>
          <el-button
            type="danger"
            circle
            plain
            icon="el-icon-delete"
            size="small"
            @click="handleDelete(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑数据 -->
    <el-dialog :visible.sync="editDialogVisible" title="数据集管理" :close-on-click-modal="false">
      <el-tabs v-model="activeName">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="first">
          <el-form :model="form" ref="form" :rules="editRules" size="small" label-width="130px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属模块" prop="moduleId">
                  <el-select v-model="form.moduleId">
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="相关表" prop="relationTable">
                  <el-input v-model="form.relationTable" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序码" prop="sortNo">
                  <el-input v-model="form.sortNo" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="select子句" prop="sqlSelect">
                  <el-input v-model="form.sqlSelect" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="from的sql语句" prop="sqlFrom">
                  <el-input v-model="form.sqlFrom" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="默认where条件" prop="sqlWhereDefault">
                  <el-input v-model="form.sqlWhereDefault" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="默认排序语句" prop="sqlOrderBy">
                  <el-input v-model="form.sqlOrderBy" autocomplete="off"></el-input>
                </el-form-item>
                </el-col>
              <el-col :span="12">
                <el-form-item label="数据库分组" prop="sqlGroupBy">
                  <el-input v-model="form.sqlGroupBy" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分组having子句" prop="sqlHaving">
                  <el-input v-model="form.sqlHaving" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否需要总条数" prop="needTotalRow">
                  <el-radio v-model="form.needTotalRow" label="1">是</el-radio>
                  <el-radio v-model="form.needTotalRow" label="0">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态" prop="status">
                  <el-radio v-model="form.status" label="1">是</el-radio>
                  <el-radio v-model="form.status" label="0">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="说明" prop="description">
                  <el-input type="textarea" :rows="2" v-model="form.description" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                  <el-input type="textarea" :rows="2" v-model="form.remarks" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="dialog-footer btn">
            <el-button size="small" @click="onCancle()">取 消</el-button>
            <el-button size="small" type="primary" @click="onSubmit('form')">确 定</el-button>
          </div>
        </el-tab-pane>
        <!-- 条件定义 -->
        <el-tab-pane label="条件定义" name="second">
          <div class="add_btn">
            <el-button size="small" type="primary" @click="editCondition('add')">增加</el-button>
          </div>
          <el-table :data="conditionData" border>
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column property="fieldName" label="字段名" width="80"></el-table-column>
            <el-table-column property="conditionType" label="条件类型" width="80"></el-table-column>
            <el-table-column property="sql" label="sql语句" width="120"></el-table-column>
            <el-table-column property="description" label="说明"></el-table-column>
            <el-table-column label="操作" width="140" align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  circle
                  plain
                  type="primary"
                  icon="el-icon-edit"
                  @click="editCondition('edit', scope.row)"
                ></el-button>
                <el-button
                  type="danger"
                  circle
                  plain
                  icon="el-icon-delete"
                  size="small"
                  @click="handleConditionDelete(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 列定义 -->
        <el-tab-pane label="列定义" name="third">
          <div class="add_btn">
            <el-button size="small" type="primary" @click="editCreateTableData()">添加字段</el-button>
            <el-button size="small" type="primary" @click="addCreateTableField('add')">新增字段</el-button>
          </div>
          <el-table :data="colomData" border>
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column property="alias" label="别名" width="80"></el-table-column>
            <el-table-column property="fildName" label="字段名" width="100"></el-table-column>
            <el-table-column property="sql" label="sql语句" width="120"></el-table-column>
            <el-table-column property="description"  label="说明"></el-table-column>
            <el-table-column label="操作" width="140" align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  circle
                  plain
                  type="primary"
                  icon="el-icon-edit"
                  @click="addCreateTableField('edit', scope.row)"
                ></el-button>
                <el-button
                  type="danger"
                  circle
                  plain
                  icon="el-icon-delete"
                  size="small"
                  @click="handleCreateDelete(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 条件定义增加 -->
    <el-dialog title="条件定义增加" :visible.sync="dialogAddVisibleData" :close-on-click-modal="false">
      <el-form
        :model="conditionForm"
        :rules="conditionRules"
        ref="conditionForm"
        size="small"
        label-width="140px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="字段" prop="fieldName">
              <el-input v-model="conditionForm.fieldName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="条件类型" prop="conditionType">
              <el-select v-model="conditionForm.conditionType">
                <el-option
                  v-for="item in types"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="sql语句" prop="sql">
              <el-input v-model="conditionForm.sql" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="说明" prop="description">
          <el-input type="textarea" :rows="2" v-model="conditionForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancleCondition()">取 消</el-button>
        <el-button type="primary" @click="onCheckedCondition('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加字段 -->
    <el-dialog title="添加字段" :visible.sync="dialogAddVisibleName" :close-on-click-modal="false">
      <el-transfer v-model="value" :data="shuttleData1"></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancleShuttle()">取 消</el-button>
        <el-button type="primary" @click="onCheckedShuttle()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增字段 -->
    <el-dialog
      title="新增字段"
      :visible.sync="dialogAddCreateVisibleName"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addNameForm"
        :rules="addNameRules"
        ref="addNameForm"
        size="small"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="别名" prop="alias">
              <el-input v-model="addNameForm.alias" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="sql语句" prop="sql">
              <el-input v-model="addNameForm.sql" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="说明" prop="description">
          <el-input type="textarea" :rows="2" v-model="addNameForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancleName()">取 消</el-button>
        <el-button type="primary" @click="onCheckedName('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { SubmitForm, guid, DeleteStatus } from "@/assets/js/common.js";
export default {
  // 数据
  data() {
    var validateName = (rule, value, callback) => {
      var reg = /^[0-9]*$/;
      if (!!value) {
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入数字"));
        }
      } else {
        callback(new Error("排序码不能为空"));
      }
    };
    return {
      loading: true,
      serviceName: "",
      editType: "add",
      editDialogVisible: false,
      dialogAddVisibleData: false, //条件定义弹框
      dialogAddVisibleName: false, //添加字段
      dialogAddCreateVisibleName: false, //新增字段
      activeName: "first", //tab切换
      shuttleData: [],
      value: [],
      tableData: [],
      //   条件定义
      conditionData: [],
      // 条件定义类型
      types: [],
      //   列定义
      colomData: [],
      //   新增字段弹框
      addNameForm: {
        name: "",
        type: "",
        explain: ""
      },
      options: [],
      form: {},
      conditionForm: {},
      optionsType: [],
      //校验规则
      addRules: {},
      //校验规则
      editRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        // moduleId: [
        //   { required: true, message: "请输入所属模块", trigger: "blur" }
        // ],
        relationTable: [{ required: true, message: "请输入相关表", trigger: "blur" }],
        // 校验名字不能重复，主要通过validator来指定验证器名称
        sortNo: [{ required: true, validator: validateName, trigger: "blur" }],
        sqlSelect: [{ required: true, message: "请输入select子句", trigger: "blur" }],
        sqlFrom: [{ required: true, message: "请输入from的sql语句", trigger: "blur"  }]
      },
      addNameRules: {
        alias: [{ required: true, message: "请输入别名", trigger: "blur" }],
        sql: [{ required: true, message: "请输入sql语句", trigger: "blur" }]
      },
      conditionRules: {
        fieldName: [
          { required: true, message: "请输入字段名", trigger: "blur" }
        ],
        conditionType: [
          { required: true, message: "请输入条件类型", trigger: "blur" }
        ],
        createUser: [{ required: true, message: "创建人", trigger: "blur" }],
        remarks: [{ required: true, message: "请输入备注", trigger: "blur" }]
      }
    };
  },
  // 计数
  computed: {
    shuttleData1() {
      return this.shuttleData.map(e => {
        return { key: e.id, label: e.tableName + "<" + e.name + ">" };
      });
    }
  },
  created() {
    this.loading = true;
    this.serviceName = this.$router.currentRoute.meta.serviceName;
    this.getData();
    this.getMoudle();
    this.getConditionType();
  },
  //方法
  methods: {
    // 获取数据
    getData() {
      var that = this;
      that
        .postRequest("/api/ts-dataset/dataset/select/all")
        .then(result => {
          that.tableData = result;
          that.loading = false;
        });
    },
    // 获取模块
    getMoudle() {
      var that = this;
      that
        .postRequest("/api/ts-table/module/find/by/project/id")
        .then(result => {
          that.options = result;
        });
    },
    // 获取条件定义类型
    getConditionType() {
      var that = this;
      that
        .getRequest("/api/" + this.serviceName + "/gar/dataset_conditionType")
        .then(result => {
          that.types = result;
        });
    },
    // 根据id获取列定义数据
    getIdConlomData() {
      var that = this;
      that
        .postRequest("/api/ts-dataset/column/select/all", {
          parentId: this.form.id
        })
        .then(result => {
          that.colomData = result;
        });
    },
    // 根据id获取条件定义数据
    getIdConditionData() {
      var that = this;
      that
        .postRequest("/api/ts-dataset/condition/select/all", {
          parentId: this.form.id
        })
        .then(result => {
          console.log(result)
          that.conditionData = result;
        });
    },
    // 获取穿梭框接口
    getShuttleFrame() {
      var that = this;
      that
        .postRequest("/api/ts-dataset/column/select/all/field", {
          relationTable: this.form.relationTable
        })
        .then(result => {
          that.shuttleData = result;
        });
    },
    // 穿梭框确定
    onCheckedShuttle() {
      var that = this;
      var value = that.value;
      var shuttleData = this.shuttleData;
      var data = {
        columnIds:[],
        ids: [],
        names: [],
        parentId: that.form.id,
        description: that.form.description
      };
      shuttleData.forEach(e => {
        value.forEach(el => {
          if (el == e.id) {
            data.columnIds.push(guid())
            data.ids.push(el);
            data.names.push(e.name);
          }
        });
      });
      data.ids = data.ids.join(",");
      data.names = data.names.join(",");
      data.columnIds = data.columnIds.join(",")

      that
        .postRequest("/api/ts-dataset/column/insert/batch", data)
        .then(result => {
          that.getIdConlomData();
          that.dialogAddVisibleName = false;
        });
    },
    // 穿梭框取消
    onCancleShuttle(){
      this.dialogAddVisibleName = false;
    },
    // 添加数据
    addTableData(type, data) {
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
      this.editType = type;
      if (type == "edit") {
        this.form = Object.assign({}, data);
        delete this.form.createTime;
        this.getData();
        this.getIdConlomData();
        this.getIdConditionData();
      } else {
        this.form = {
          id:guid(),
          name: "",
          moduleId: "",
          relationTable: "",
          sortNo: "100",
          sqlSelect: "",
          sqlFrom: "",
          sqlWhereDefault: "",
          sqlOrderBy: "",
          sqlGroupBy: "",
          sqlHaving: "",
          needTotalRow: "1",
          status: "1",
          description: "",
          remarks: ""
        };
        this.getData();
        this.getIdConlomData();
        this.getIdConditionData();

      }
      this.editDialogVisible = true;
    },
    // 弹框取消
    onCancle() {
      this.editDialogVisible = false;
    },
    // 弹框确定
    onSubmit() {
      var that = this;
      SubmitForm(
        this,
        "form",
        "form",
        this.editType,
        "/api/ts-dataset/dataset/insert",
        "/api/" + this.serviceName + "/uor/dataset",
        function(e) {
          that.getData();
          that.editDialogVisible = false;
        }
      );
    },
    // 删除数据
    handleDelete(index, data) {
      var that = this;
      DeleteStatus(
        this,
        "/api/" + this.serviceName + "/dor/dataset",
        {
          id: data.id
        },
        function() {
          that.getData();
        }
      );
    },
    clickCurrent(e) {
      // this.currentRow = e.id;
    },

    // 条件定义编辑
    editCondition(type, data) {
      if (this.$refs.conditionForm) {
        this.$refs.conditionForm.clearValidate();
      }
      this.editType = type;
      if (type == "edit") {
        this.conditionForm = Object.assign({}, data);
        delete this.conditionForm.createTime;
      } else {
        console.log(this.form.id)
        this.conditionForm = {
          parentId: this.form.id,
          fieldName: "",
          conditionType: "",
          sql: "",
          description: ""
        };
      }
      this.dialogAddVisibleData = true;
    },
    // 条件定义增加确定
    onCheckedCondition() {
      var that = this;
      SubmitForm(
        this,
        "conditionForm",
        "conditionForm",
        this.editType,
        "/api/" + this.serviceName + "/cor/dataset_condition",
        "/api/" + this.serviceName + "/uor/dataset_condition",
        function(e) {
          that.getIdConditionData();
          that.dialogAddVisibleData = false;
        }
      );
    },
    // 条件定义增加取消
    onCancleCondition() {
      this.dialogAddVisibleData = false;
    },
    // 条件定义的删除
    handleConditionDelete(index, data) {
      var that = this;
      DeleteStatus(
        this,
        "/api/" + this.serviceName + "/dor/dataset_condition",
        {
          id: data.id
        },
        function() {
          that.getIdConditionData();
        }
      );
    },
    // 添加字段
    editCreateTableData() {
      this.dialogAddVisibleData = false;
      if(this.form.relationTable != ''){

                this.getShuttleFrame();
        this.dialogAddVisibleName = true;
      }else{
        this.$message({
            message: "无相关表,请录入相关表"
          });
      }
    },
    // 新增字段
    addCreateTableField(type, data) {
      if (this.$refs.addNameForm) {
        this.$refs.addNameForm.clearValidate();
      }
      this.editType = type;
      if (type == "edit") {
        this.addNameForm = Object.assign({}, data);
        delete this.addNameForm.createTime;
      } else {
        this.addNameForm = {
          parentId: this.form.id,
          alias: "",
          sql: "",
          description: ""
        };
      }
      this.dialogAddCreateVisibleName = true;
    },
    // 新增字段取消
    onCancleName() {
      this.dialogAddCreateVisibleName = false;
    },
    // 新增字段确定
    onCheckedName() {
      var that = this;
      SubmitForm(
        this,
        "addNameForm",
        "addNameForm",
        this.editType,
        "/api/" + this.serviceName + "/cor/dataset_column",
        "/api/" + this.serviceName + "/uor/dataset_column",
        function(e) {
          that.getIdConlomData();
          that.dialogAddCreateVisibleName = false;
        }
      );
    },
    // 新增字段数据删除
    handleCreateDelete(index, data) {
      var that = this;
      DeleteStatus(
        this,
        "/api/" + this.serviceName + "/dor/dataset_column",
        {
          id: data.id
        },
        function() {
          that.getIdConlomData();
        }
      );
    }
  }
};
</script>
// 样式
<style>
.add_btn {
  float: right;
  margin-bottom: 10px;
}
.btn {
  float: right;
}
.el-dialog__body{
  padding-top: 0 !important;
}
</style>