<template>
	<el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">
		<div class="add_btn">
			<el-button type="primary" size="small" @click="addSubmit('add')">增加</el-button>
		</div>

		<!--增加内容的弹框-->

		<el-table border :data="tableData"  v-loading="loading">

			<el-table-column prop="name" label="名称"></el-table-column>
			<el-table-column prop="url" label="仓库地址"></el-table-column>
			<el-table-column prop="description" label="说明" width="180"></el-table-column>
			<el-table-column prop="status" label="状态" width="80">
				<template slot-scope="scope">
					<span v-if="scope.row.status==1">启用</span>
					<span v-else>停用</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="140" align="center">
				<template slot-scope="scope">
					<el-button circle plain type="primary" size="small" @click="addSubmit('edit',scope.row)" icon="el-icon-edit"></el-button>
					<el-button circle plain type="danger" size="small" @click="deleteRow(scope.$index,scope.row)" icon="el-icon-delete"></el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="git仓库增加" :visible.sync="addDialog" :close-on-click-modal="false" width="600px">
			<el-form :rules="rules" :model="studentForm" label-width="80px" ref="studentForm"  size="small">
				<el-row> 
					<el-col :span="12">
						<el-form-item label="名称" prop="name">
							<el-input v-model="studentForm.name"></el-input>
						</el-form-item>
						<el-form-item label="仓库地址" prop="url">
							<el-input v-model="studentForm.url"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="git用户名" prop="userName">
							<el-input v-model="studentForm.userName"></el-input>
						</el-form-item>
			
						<el-form-item label="密码" prop="password">
							<el-input type="password" v-model="studentForm.password" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
				
					<el-col :span="12">
						<el-form-item label="排序码" prop="sortNo">
							<el-input v-model="studentForm.sortNo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-select v-model="studentForm.status">
								<el-option label="启用" value="1"></el-option>
								<el-option label="停用" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					</el-row>
					<el-row>
					<el-col :span="24">
						<el-form-item label="说明" prop="description">
							<!--<el-input v-model="studentForm.createUser"></el-input>-->
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
	import { SubmitForm, guid, DeleteStatus } from "@/assets/js/common.js";
	export default {
		data() {
			var validateName = (rule, value, callback) => {
				if(this.editType == "add") {
					if(!!value) {
						this.postRequest("/api/" + this.serviceName + "/jrr/gitRepository/name", {
							name: value
						}).then(result => {
							if(!result.data) {
								callback();
							} else {
								callback(new Error("账号重复"));
							}
						});
					} else {
						callback(new Error("账号不能为空"));
					}
				} else {
					callback();
				}
			};
			return {
				loading: true,
				// 校验规则
				rules: {
					name: [{
						required: true, //是否必填
						validator: validateName, //判断name是否重复
						//message: "姓名不能为空", //规则
						trigger: "blur" //何事件触发
					}]
				},
				serviceName: "",
				studentDialog: false,
				editType: "add",
				addDialog: false,
				studentForm: {},
				tableData: [],
				value: ""
			};
		},
		created() {
			this.serviceName = this.$router.currentRoute.meta.serviceName;
			this.getData();
		},

		methods: {
			// 获取数据
			getData() {
				this.loading = true;
				this.getRequest("/api/ts-git-code/git/repository/get/all").then(
					result => {
						this.tableData = result;
						this.loading = false;
					}
				);
			},
			// 取消添加
			addCancel() {
				this.addDialog = false;
			},
			// 确认添加
			addSubmit(type, data) {
				if(this.$refs.studentForm) {
					this.$refs.studentForm.clearValidate();
				}
				this.editType = type;
				if(type == "edit") {
					this.studentForm = Object.assign({}, data);
					delete this.studentForm.createTime;
				} else {
					this.studentForm = {
						id:guid(),
						name: "",
						status: "1",
						url:"",
						userName:"",
						password:"",
						description:"",
						sortNo: "100"
					};
				}
				this.addDialog = true;
			},
			//			增加和修改
			addSubmits() {
				var that = this;
				delete this.studentForm.projectName
				SubmitForm(
					this,
					"studentForm",
					"studentForm",
					this.editType,
					"/api/ts-git-code/git/repository/insert",
					"/api/" + this.serviceName + "/uor/gitRepository",
					function() {
						that.getData();
						that.addDialog = false;
					}
				);
			},
			//删除数据
			deleteRow(index, data) {
				var that = this;
				DeleteStatus(
					this,
					"/api/" + this.serviceName + "/dor/gitRepository", {
						id: data.id
					},
					function() {
						that.getData();
					}
				);
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