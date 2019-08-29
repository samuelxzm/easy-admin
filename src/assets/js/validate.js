/*验证内容是否英文以及下划线*/
export function isTableName(rule, value, callback) {
    const reg =/^[_a-zA-Z]+$/;
    if(value==''||value==undefined||value==null){
      callback();
    } else {
      if (!reg.test(value)){
        callback(new Error('表名仅由英文字母以及下划线组成'));
      } else {
        callback();
      }
    }
  }

// 验证是否整数
export function isInteger(rule, value, callback) {
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
  }