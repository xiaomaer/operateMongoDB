var express = require('express');
var router = express.Router();

//新添加的模块,该模块用于处理MongoDB
var mongoose = require('mongoose');
//连接MongoDB数据库,并创建自己的数据库，数据库名称为operateDB。
// 连接字符串格式为mongodb://主机:port/数据库名，默认端口号为27017，可不写
mongoose.connect('mongodb://localhost/operateDB', function (err) {
    if (!err) {
        console.log('connected to MongoDB');
    }
    else {
        throw err;
    }
});
//在MongoDB中定义一个文档,即相当于关系数据库中定义表包含的字段及类型
var Schema = mongoose.Schema,//使用Schema接口
    taskSchema = new Schema({task: String}),//通过Schema定义了模型的模式，在模式声明中，task定义为string，task可以理解为表中的字段，string为字段类型
    Task = mongoose.model('Task', taskSchema);//创建模型。通过该模型的实例化写入数据，然后使用save()方法保存到数据库
//添加路由和相应的响应函数显示任务列表
router.get('/', function (req, res, next) {
    //获取存储在Task模型中的所有记录
    Task.find({}, function (err, docs) {//查询数据库
        if (!err) {
            res.render('index', {title: '显示任务', docs: docs});//调用模板引擎，并传递参数
        }
        else {
            throw err;
        }
    });
});
//添加路由和相应的响应函数用于用户输入任务
router.get('/new', function (req, res, next) {
    res.render('new', {
        title: '添加任务'
    })
});
//添加路由和响应函数用于接收表单提交的数据，并把数据保存都数据库
router.post('/', function (req, res, next) {
    //实例化了一个Task模型并将POST提交的表单数据传递给该实例（注意：实例化时的数据格式和模型的模式中的要一致）
    var task = new Task({task: req.body.task});
    //保存提交的数据到数据库
    task.save(function (err) {//添加记录
        if (!err) {
            req.flash('info', '添加任务成功');
            res.redirect('/');//重定向到“显示任务列表页”
        }
        else {
            req.flash('fail', '添加任务失败');
            res.redirect('/new');//重定向到“添加任务页”
        }
    });
});
//添加路由规则和响应函数，用于查询指定ID的任务，然后调用edit模板，并传递任务数据
router.get('/:id/edit', function (req, res, next) {
    Task.findById(req.params.id, function (err, doc) {
        res.render('edit', {title: '修改任务', task: doc});
    });
});
//添加路由和响应函数，接受post请求修改指定ID的任务
router.post('/:id', function (req, res, next) {
    //查询指定ID的任务(条件查询)
    Task.findById(req.params.id, function (err, doc) {
        doc.task = req.body.task;//新的任务内容
        doc.save(function (err) {//保存修改后的任务内容
            if (!err) {
                req.flash('info', '修改任务成功');
                res.redirect('/');
            }
            else {
                req.flash('fail', '修改任务失败');
                throw err;
            }
        })
    });
});
//添加路由和响应函数，用于删除指定记录(注意：路由路径可以随意定义，只要对应的链接和此对应即可)
//如果使用form表单提交delete删除任务请求，把下面的get修改为delete，同时路径修改为‘/：id’即可
router.get('/deltask/:id', function (req, res, next) {
    Task.findById(req.params.id, function (err, doc) {
        if (!doc) return next(new Notfound('document not found'));
        doc.remove(function () {
            req.flash('info', '删除任务成功');
            res.redirect('/');

        })
    });
});
module.exports = router;
