const {getStockPrices,getPartucularStockPrices} = require('../apiFunctions/NSE');
const stockModel = require('../model/stock');

module.exports.getAllHomeIndices = async(Indices)=>{
return Promise.all(Indices.map(str=>{
    const indice = `nifty ${str}`
    return getPartucularStockPrices(indice)
}))
}
module.exports.getAllportfolioStocks = async(arr)=>{
    return Promise.all(arr.map(name=>{
        return getPartucularStockPrices(name+'eqn')
    }))  
}
module.exports.getAll =  async(id)=>{
    const indice = `nifty ${id.split('!').join(' ')}` 
    return getStockPrices(indice);
}
module.exports.getSpecific = async(stock,ext = 'eqn')=>{
    if(stock.includes(' ')){
        return getPartucularStockPrices(stock)  
    }
    return getPartucularStockPrices(stock+ext)
}
//Take id from req.user and get stocks details from that.
module.exports.makePortfolio =  async()=>{
const allStocks = await stockModel.find({});
let totalInvested = 0 ;
const indices = allStocks.map((obj)=>{
    totalInvested += obj.average*obj.volume
    return obj.name
});
const response = await this.getAllportfolioStocks(indices);
const result = response.map(arr=>arr[0])
let currentValue = 0;
allStocks.forEach((cur,index)=>{
currentValue += cur.volume*result[index].lastPrice ;
})
 return {
     allStocks,
     result,
     totalInvested,
     currentValue
    }
}
