<template>
	<el-card style="min-height:100%;box-sizing:border-box;border-radius:0;">

		<el-tabtitleone style="width: 100%;margin:0 auto;text-align: left;">
			<el-div type="text" size="small">
				代码：
				<el-input style="width: 50px;" size="mini" placeholder="" />
			</el-div>
			<el-div type="text" size="small">
				名称：
				<el-input style="width: 50px;" size="mini" placeholder="" />
			</el-div>
			<el-div type="text" size="small">
				状态：
				<el-select v-model="value" placeholder="请选择" style="width: 100px;">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-div>

			<el-input style="width: 150px;" v-model="search" size="mini" placeholder="输入关键字搜索" />

		</el-tabtitleone>
		<div id="" style="text-align: right;">

			<el-tabtitletwo>
				<el-button type="text" size="small">增加</el-button>
				<el-button type="text" size="small">修改</el-button>
				<!--修改内容的弹框-->
				
				<el-button  @click="delet" type="text" size="small">删除</el-button>
			</el-tabtitletwo>

		</div>
		<el-table border :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
			<el-table-column label="序号" type="index" width="50">
			</el-table-column>
			<el-table-column prop="date" label="日期" width="180"></el-table-column>
			<el-table-column prop="name" label="姓名" width="180"></el-table-column>
			<el-table-column prop="address" label="地址"></el-table-column>
			<el-table-column label="操作" width="210">
				<template slot-scope="scope">
					<el-button size="small">修改</el-button>
					<el-button type="danger" size="small" @click.native.prevent="deleteRow(scope.$index, tableData)" >删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination style="text-align:right;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400"></el-pagination>
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