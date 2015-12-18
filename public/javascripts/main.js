/**
 * Created by MMY on 2015/12/12.
 */
var del = document.getElementById('delbtn');
if (del !== null) {
    del.onclick = function () {
        this.parentNode.parentNode.remove();
    };
}
//使用form表单提交delete删除任务请求,即index.jade页面注释的代码（记得把index.js对应的路由规则中的get修改为delete）
//注意：submit事件是绑定在form表单上的
/*del.onsubmit = function () {
    this.parentNode.parentNode.parentNode.remove();
};*/