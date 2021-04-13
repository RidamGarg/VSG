if(process.env.NODE_ENV !== 'production'){
   require('dotenv').config()
}
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const stockRouter = require('./router/stock');
const userRouter = require('./router/user');
const User = require('./model/user')
const session = require('express-session');
const LocalStrategy = require('passport-local');
const passport = require('passport');
const dbUrl = process.env.dbUrl || 'mongodb://localhost:27017/Stock' ;
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
mongoose.connect(dbUrl,{
   useNewUrlParser: true,
   useCreateIndex:true,
   useFindAndModify:false,
   useUnifiedTopology:true 
}).then(()=>console.log('Connected'))
app.use(express.urlencoded({extended:true}))
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
   httpOnly:true,
   secure:true,
   expires:Date.now()+1000*60*60*24*7,
   maxAge:1000*60*60*24*7
}
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//Strategies range from verifying a username and password
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error')
   res.locals.currentUser = req.user ;
   next();
})
app.use(userRouter)
app.use(stockRouter)

app.all('*',(req,res,next)=>{
   next(new ExpressError('Page Not Found',404));
})
app.use((err,req,res,next)=>{
   const {statusCode = 500} = err ;
   if(!err.message){
      err.message = 'Oh boy Somtehing went wrong'
   }
   res.status(statusCode).render('error',{err})
})
const PORT = process.env.PORT||'3000'
app.listen(PORT)