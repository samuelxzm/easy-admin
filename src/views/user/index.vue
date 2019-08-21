<template>
	<el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">

		<div style="width: 100%;margin:0 auto;text-align: left;" :model="formModule">
			<el-div type="text" size="small">
				代码：
				<el-input style="width: 100px;" size="mini" placeholder="" v-model="formModule.range"/>
			</el-div>
			<el-div type="text" size="small">
				名称：
				<el-input style="width: 100px;" size="mini" placeholder="" v-model="formModule.status" placeholder="启用"/>
			</el-div>
			<el-div type="text" size="small">
				状态：
				<el-select v-model="value" placeholder="请选择" style="width: 100px;">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-div>

			<el-input style="width: 150px;" size="mini" placeholder="输入关键字搜索" />

		</div>
		<div id="" style="text-align: right;">

			<div>
				<el-button type="text" size="small" @click="Add()">增加</el-button>
				<!--增加内容的弹框-->
				<el-dialog title="增加内容" :visible.sync="addDialog" center>
					<el-form :inline="true" :model="studentForm" label-width="84px" ref="studentForm" status-icon>
						<el-form-item label="序号">
							<el-input v-model="studentForm.num"></el-input>
						</el-form-item>
						<el-form-item label="姓名" prop="name">
							<el-input v-model="studentForm.name"></el-input>
						</el-form-item>
						<el-form-item label="日期" prop="sex">
							<el-input v-model="studentForm.date"></el-input>
						</el-form-item>
						<el-form-item label="地址" prop="sex">
							<el-input v-model="studentForm.address"></el-input>
						</el-form-item>

						</el-table-column>
					</el-form>
					<span slot="footer" class="dialog-footer">
            <el-button @click="addCancel('studentForm')">取 消</el-button>
            <el-button type="primary" @click="addSubmit('studentForm')">确 定</el-button>
          </span>
				</el-dialog>

			</div>

		</div>
		<el-table border :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
			<el-table-column label="序号" type="index" width="50">
			</el-table-column>
			<el-table-column prop="date" label="日期" width="180"></el-table-column>
			<el-table-column prop="name" label="姓名" width="180"></el-table-column>
			<el-table-column prop="address" label="地址"></el-table-column>
			<el-table-column label="操作" width="210">
				<template slot-scope="scope">
					<el-button size="small" @click="onEdit(scope.$index,scope.row)">修改</el-button>

					<el-button type="danger" size="small" @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="修改数据" :visible.sync="editFormVisible">
			<el-form :model="editForm" ref="editForm" label-width="100px" class="demo-ruleForm" inline>
				<el-form-item label="id" prop="id">
					<el-input v-model="editForm.id"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="meaning">
					<el-input v-model="editForm.address"></el-input>
				</el-form-item>
				<el-form-item label="时间" prop="type1">
					<el-input v-model="editForm.date"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editCancel()">取 消</el-button>
				<el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
			</div>
		</el-dialog>
		<el-pagination style="text-align:right;" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400"></el-pagination>
	</el-card>
</template>
<style>
	.el-table .warning-row {
		background: oldlace;
	}
	
	.el-table .success-row {
		background: #f0f9eb;
	}
	
	.el-input__inner {
		height: 28px;
		line-height: 28px;
	}
	
	.el-input__icon {
		line-height: 28px;
	}
</style>

<script>
	export default {
		methods: {
			// 修改表格某一行shuju
			onEdit(index, row) {
				this.editFormVisible = true;
				this.editForm = row;
			},
			// 确认修改
			editSubmit(formName) {
				this.$refs[formName].validate(valid => {
					if(valid) {
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
			// 取消编辑
			OnEditCancel() {
				this.studentDialog = false;
			},
			Add() {
				console.log(this.$store.getters.doneTodos)

				this.addDialog = true;
				console.log(this.$store.state.count)
			},
			// 确认添加
			addSubmit() {
				this.tableData.push(this.studentForm)
				this.addDialog = false;
			},
			// 确认添加
			addCancel() {

				this.addDialog = false;
			},
			handleClick(row) {
				console.log(row);
			},
			deleteRow(index, rows) {
				rows.splice(index, 1);
			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				if(rowIndex === 1) {
					return "warning-row";
				} else if(rowIndex === 3) {
					return "success-row";
				}
				return "";
			},
			delet() {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}

		},
		data() {
			return {
				studentDialog: false,
				editFormVisible: false,
				addDialog: false,
				studentForm: {
					name: "",
					address: "",
					date: "",

				},
				formModule: {
					
					range: "",
					status: ""
				},
				formInline: {
					user: "",
					region: ""
				},
				tableData: [{
						date: "2016-05-02",
						name: "王小虎",
						address: "上海市普陀区金沙江路 1518 弄"
					},
					{
						date: "2016-05-04",
						name: "王小虎",
						address: "上海市普陀区金沙江路 1518 弄"
					},
					{
						date: "2016-05-01",
						name: "王小虎",
						address: "上海市普陀区金沙江路 1518 弄"
					},
					{
						date: "2016-05-03",
						name: "王小虎",
						address: "上海市普陀区金沙江路 1518 弄"
					}
				],
				editForm: {
					name: "",
					address: "",
					date: "",
				},
				options: [{
					value: '选项1',
					label: '启用'
				}, {
					value: '选项2',
					label: '禁用'
				}],
				value: ''
			};
		}
	};
</script>