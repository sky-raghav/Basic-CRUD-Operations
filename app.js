const createError = require('http-errors');
const express = require('express');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rHelpers = require('./redis-helpers');

const indexRouter = require('./routes/index');
const leadsRouter = require('./routes/leads');
const markLeadRouter =  require('./routes/markLead');
const isFlush = false;

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//flush redis
app.use((req,res,next) =>{
  if(isFlush){
    rHelpers.flushAll()
    .then(()=>{
      next();
    })
    .catch((err)=>{
      next(err);
    })
  } else{
    next();
  }
})

app.use('/', indexRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/mark_lead', markLeadRouter);


//Response Handler
app.use((req, res, next) => {
  console.log('res handler res', res.data);
  res.send(res.data || {failure: 'NO Data!'});
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
