const express = require('express');
const router = express.Router();
const User = require('../model/user')
const passport = require('passport');
router.get('/login',(req,res)=>{
    res.render('user/login')
})
router.get('/signup',(req,res)=>{
    res.render('user/signup')
})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome Back!')
    let redirect =  req.session.returnTo || '/'
     redirect =redirect.replace('BUY','')
     redirect =redirect.replace('SELL','')
    delete req.session.returnTo 
    res.redirect(redirect)
})
router.post('/signup',async(req,res)=>{
    const {username,email,password} = req.body ;
    const user = new User({username,email});
    const newUser = await User.register(user,password);
    req.login(newUser,function(err){
        if(err){
            return next(err);
        }
        req.flash('success','Start Your First Trade');
        res.redirect('/')
    })
    
})
router.get('/logout',(req,res)=>{
    req.logout()
    req.flash('success','You Successfully logged out')
    res.redirect('/')
})
module.exports = router ;