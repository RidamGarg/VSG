const express = require('express');
const router = express.Router();
const stockModel = require('../model/stock');
const allIndices = require('../seeds/allindices');
const ExpressError = require('../utils/ExpressError');
const {isLoggedin} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const {getAllHomeIndices,getAllportfolioStocks,getSpecific,getAll,makePortfolio} = require('../helper/allStockDetails');
router.get('/',catchAsync(async(req,res)=>{
    const response = await getAllHomeIndices(allIndices);
    const result = response.map(arr=>arr[0])
    res.render('stocks/allindices',{allIndices,result});
}))
router.post('/nifty/search',catchAsync(async(req,res)=>{
    const {search} = req.body ;
    const result = await getSpecific(search);
    if(result.length){
        res.redirect(`/${search}`)
    }
    else{
        req.flash('error','Nothing is found related to your search')
        res.redirect('/')
    }
}))
router.get('/nifty/:id',catchAsync(async(req,res,next)=>{
const result = await getAll(req.params.id);
if(result.length){
res.render('stocks/all',{result});
}
else{
    req.flash('error','Currently,We are having problem to retrieve information about it')
    res.redirect('/')
}
}))
router.get('/portfolio',isLoggedin,async(req,res)=>{
    const obj = await makePortfolio()
    res.render('user/portfolio',{...obj});
 })
router.get('/:stock',catchAsync(async(req,res,next)=>{
        let {stock}=req.params
         //stock = stock.split('!').join(' ');
        const result = await getSpecific(stock);
        const share = await stockModel.findOne({name:stock.toUpperCase()});
    if(result.length){
        res.render('stocks/show',{result,share});
    }
    else{
            next(new ExpressError('Page Not Found',404));
    }
        
}))
//Take id from req.user and push stocks detail in that.
router.post('/:stock/BUY',isLoggedin,catchAsync(async(req,res)=>{
    const {shares} = req.body ;
    const result = await getSpecific(req.params.stock);
    let shareInfo = await stockModel.findOne({name:result[0].symbol});
    if(shareInfo){
        const average = (result[0].lastPrice*parseInt(shares)+shareInfo.average*shareInfo.volume)/(shareInfo.volume+parseInt(shares));
        shareInfo.average = average.toFixed(2)
        shareInfo.volume += parseInt(shares) ;
       shareInfo = await shareInfo.save();
       req.flash('success',`You successfully bought ${shares} shares in ${req.params.stock}`)
       res.redirect('/portfolio')
    }
    else{
    const stock = new stockModel({
        name:result[0].symbol,
        price:result[0].lastPrice,
        date:result[0].lastUpdateTime.split(' ')[0],
        time:result[0].lastUpdateTime.split(' ')[1],
        volume:shares,
        average:result[0].lastPrice
    })
    await stock.save()
    req.flash('success',`You successfully bought ${shares} shares in ${req.params.stock}`)
    res.redirect('/portfolio')
}
    // var currentdate = new Date();
    // var datetime = "Last Sync: " + currentdate.getDay() + "/" + currentdate.getMonth() 
    // + "/" + currentdate.getFullYear() + " @ " 
    // + currentdate.getHours() + ":" 
    // + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    
}))
//Take id from req.user and remove stocks detail from that.
router.post('/:stock/SELL',isLoggedin,catchAsync(async(req,res)=>{
    const {id,stock} = req.params
    const {shares} = req.body ;
    const result = await getSpecific(req.params.stock);  
    let shareInfo = await stockModel.findOne({name:result[0].symbol});
    if(shareInfo&&shareInfo.volume>parseInt(shares)){
        shareInfo.volume -= parseInt(shares)
        shareInfo = await shareInfo.save();
        req.flash('success',`You successfully sold ${shares} shares of ${stock}`)
        res.redirect('/portfolio')
    }
    else if(shareInfo&&shareInfo.volume===parseInt(shares)){
        await stockModel.deleteOne({name:result[0].symbol})
        req.flash('success',`You successfully sold ${shares} shares of ${stock}`)
        res.redirect('/portfolio')
    }
    else{
        req.flash('error',"You don't have shares to sell")
        res.redirect(`/${stock}`)
    }
}))
//Take id from req.user and get stocks detail from that.
router.get('/:stock/details',isLoggedin,catchAsync(async(req,res)=>{
    const {id,stock} = req.params ;
    const market = await getSpecific(stock);
    const buyed = await stockModel.findOne({name:stock.toUpperCase()});
    res.render('stocks/buyinfo',{market,buyed,result:{}});
}))
module.exports = router