import axios from 'axios'
import FileSaver from "file-saver"
import XLSX from "xlsx"
import {
    Message,
    MessageBox
} from 'element-ui'
axios.interceptors.request.use(config => {
    return config;
}, err => {
    Message.error({
        message: '请求超时!'
    });
    return Promise.resolve(err);
})

// 拦截响应response，并做一些错误处理
axios.interceptors.response.use((response) => {
    const data = response.data;
    // 根据返回的code值来做不同的处理（和后端约定）
    data.code=parseInt(data.code)
    if(data.code==0){
        return data.data
    }
    else if(data.code==-200){
        if (window.location.pathname == '/login' | '/') {
        }
        else {
            location.replace(`/login`)
        }
    }
    else if(data.code==-600){

            location.replace(`/maintenance`)
        
    }
    else if(data.code==-205){
        // todo
    }
    else{
return data
    }
}, (err) => { // 这里是返回状态码不为200时候的错误处理
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                err.message = '请求错误'
                break

            case 401:
                err.message = '未授权，请登录'
                break

            case 403:
                err.message = '拒绝访问'
                break

            case 404:
                err.message = `请求地址出错: ${err.response.config.url}`
                break

            case 408:
                err.message = '请求超时'
                break

            case 500:
                err.message = '服务器内部错误'
                break

            case 501:
                err.message = '服务未实现'
                break

            case 502:
                err.message = '网关错误'
                break

            case 503:
                err.message = '服务不可用'
                break

            case 504:
                err.message = '网关超时'
                break

            case 505:
                err.message = 'HTTP版本不受支持'
                break

            default:
        }
        Message.error({
            message: err.message
        });
    }

    return Promise.reject(err)
})
axios.install = (Vue) => {
    Vue.prototype.$axios = axios
}

export const postRequest = (url, data) => {
    // console.log(data)
    // return axios.post(url,data)
    return axios({
        method: 'post',
        url: `${url}`,
        data: qs.stringify(data),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${url}`,
        params: params,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    });
}
/**
 * @description
 *  提交表单--增加和删除
 *  注：适用于url格式为
 *         1.修改：/xxx.../:type?recordid=xxx
 *         2.增加：/xxx.../:type
 * @param {Object} vim vue实例
 * @param {String}  formName 表单ref的名字
 * @param {String}  formDataKey 表单绑定数据的key名
 * @param {String}  type 操作类型：add/edit
 * @param {Number}  addSqlId 增加时执行的sqlid
 * @param {Number}  changeSqlId 修改时执行的sqlid
 * @return {function}  callback 回调函数
 * @author wy 20181031
 * @version V0.0.1
 */
function SubmitForm(vim, formName, formDataKey, type, addSqlId, changeSqlId, callback) {
    let that = vim;
    var data = Object.assign({}, that[formDataKey])
    if (data.buyTime) {
        data.buyTime = data.buyTime / 1000
    }
    that.$refs[formName].validate(function (valid) {
        if (valid) {
            if (type == "add") {
                that.$axios
                    .post(addSqlId, that.$qs.stringify(data), {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    })
                    .then(result => {
                        if (result) {
                            if (result == "error") {
                                that.$message.error("账号已存在");
                            }
                            else {
                                that.$message({
                                    message: "添加成功！",
                                    type: "success"
                                });
                            }
                            callback(result);
                        }

                        else {
                            that.$message.error("增加失败");
                        }
                    });
            } else {
                // //修改
                that.$axios
                    .post(changeSqlId, that.$qs.stringify(data), {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    })
                    .then(result => {
                        if (result >= 0) {
                            that.$message({
                                message: "修改成功！",
                                type: "success"
                            });
                            return callback(result);
                        } else {
                            that.$message.error("修改失败");
                        }
                    });
            }
        } else {
            return false;
        }
    });
}
/**
 * @description
 *  导出数据为Excel
 * @param {String}  id 导出对象的ID
 * @param {String}  fileName 导出文件的文件名
 * @author wy 20181031
 * @version V0.0.1
 */
function ExportExcel(id, fileName) {
    /* 将表格生成对象 */
    var wb = XLSX.utils.table_to_book(document.querySelector(id));
    /* 获取二进制字符串作为输出 */
    var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
    });
    try {
        FileSaver.saveAs(
            new Blob([wbout], {
                type: "application/octet-stream"
            }),
            fileName
        );
    } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
    }
    return wbout;
}
/**
 * @description
 *  更改状态为删除
 *  注：适用于url格式为
 *         1.修改：/xxx.../:type?recordid=xxx
 *         2.增加：/xxx.../:type
 * @param {Object}  vim vue实例
 * @param {String}  tableName 数据所在表名
 * @param {String}  itemId 要删除数据的id
 * @return {function}  callback 回调函数
 * @author xzm 20181217
 * @version V0.0.1
 */
function DeleteStatus(vim, tableName, itemId, callback) {
    var that = vim;
    that.$confirm('是否确认删除?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        callback: function (action) {
            if (action == "confirm") {
                //调用删除接口删除
                that.getRequest('/api/delete/' + tableName + '/isDelete/' + itemId).then(isdelete => {
                    if (isdelete == null) {
                        that.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        return callback()
                    } else {
                        that.$message.error('删除失败');
                    }
                });

            }
        }
    })
}

function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}
function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

export default axios
export {
    SubmitForm,
    ExportExcel,
    DeleteStatus,
    formatDate
}