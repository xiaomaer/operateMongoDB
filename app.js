var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

//以下是自己添加的引用
//引入 flash 模块来实现页面通知
var flash = require('connect-flash');//req.flash()使用
//session会话,注意req.flash() requires session，所以需要添加该模块
var session = require('express-session');//session使用
var MongoStore = require('connect-mongo')(session);//mongodb使用
//添加结束

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//以下是自己添加的功能定义
app.use(flash());//定义使用 flash 功能
//自己添加的，提供session支持,req.flash()需要session，不添加此定义，会报错
app.use(session({
    secret:'xiaoma',//secret 用来防止篡改 cookie
    //设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，以避免丢失。
    store: new MongoStore({
        db: 'operateDB'
    })
}));
// 视图交互：实现添加、修改和删除任务时的成功和错误提示信息
app.use(function(req, res, next){
    //res.locals.xxx实现xxx变量全局化，在其他页面直接访问变量名即可
    //获取要显示错误信息
    var error = req.flash('fail');//获取flash中存储的error信息
    res.locals.error = error.length ? error : null;
    //获取要显示成功信息
    var success = req.flash('info');
    res.locals.success = success.length ? success : null;
    next();//控制权转移，继续执行下一个app。use()
});
//添加定义结束

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
