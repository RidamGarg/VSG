const express = require("express");
const router = express.Router();
const allIndices = require("../seeds/allindices");
const ExpressError = require("../utils/ExpressError");
const { isLoggedin } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const User = require("../model/user");

const {
  getAllHomeIndices,
  getAllportfolioStocks,
  getSpecific,
  getAll,
  makePortfolio,
} = require("../helper/allStockDetails");
router.get(
  "/",
  catchAsync(async (req, res) => {
    const response = await getAllHomeIndices(allIndices);
    const result = response.map((arr) => arr[0]);
    res.render("stocks/allindices", { allIndices, result });
  })
);
router.post(
  "/nifty/search",
  catchAsync(async (req, res) => {
    const { search } = req.body;
    const result = await getSpecific(search);
    if (result.length) {
      res.redirect(`/${search}`);
    } else {
      req.flash("error", "Nothing is found related to your search");
      res.redirect("/");
    }
  })
);
router.get(
  "/nifty/:id",
  catchAsync(async (req, res, next) => {
    const result = await getAll(req.params.id);
    if (result.length) {
      res.render("stocks/all", { result });
    } else {
      req.flash(
        "error",
        "Currently,We are having problem to retrieve information about it"
      );
      res.redirect("/");
    }
  })
);
router.get("/portfolio", isLoggedin, async (req, res) => {
  const obj = await makePortfolio(req.user._id);
  res.render("user/portfolio", { ...obj });
});
router.get(
  "/:stock",
  catchAsync(async (req, res, next) => {
    let { stock } = req.params;
    const result = await getSpecific(stock);
    let share;
    if (!req.user) {
      share = null;
    } else {
      const shareInfo = await User.find(
        { _id: req.user._id, "trades.name": req.params.stock.toUpperCase() },
        { _id: 0, "trades.$": 1 }
      );
      if (shareInfo.length) share = shareInfo[0].trades[0];
      else share = null;
    }
    if (result.length) {
      res.render("stocks/show", { result, share });
    } else {
      next(new ExpressError("Page Not Found", 404));
    }
  })
);
//Take id from req.user and push stocks detail in that.
router.post(
  "/:stock/BUY",
  isLoggedin,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { shares } = req.body;
    const result = await getSpecific(req.params.stock);
    const shareInfo = await User.find(
      { _id: req.user._id, "trades.name": req.params.stock.toUpperCase() },
      { _id: 0, "trades.$": 1 }
    );
    if (shareInfo.length) {
      const share = shareInfo[0].trades[0];
      const average =
        (result[0].lastPrice * parseInt(shares) +
          share.average * share.volume) /
        (share.volume + parseInt(shares));
      const avg = average.toFixed(2);
      const volume = share.volume + parseInt(shares);
      await User.updateOne(
        {
          _id: req.user._id,
          trades: { $elemMatch: { name: req.params.stock.toUpperCase() } },
        },
        { $set: { "trades.$.volume": volume, "trades.$.average": avg } }
      );
      req.flash(
        "success",
        `You successfully bought ${shares} shares in ${req.params.stock}`
      );
      res.redirect("/portfolio");
    } else {
      const stock = {
        name: result[0].symbol,
        price: result[0].lastPrice,
        date: result[0].lastUpdateTime.split(" ")[0],
        time: result[0].lastUpdateTime.split(" ")[1],
        volume: shares,
        average: result[0].lastPrice,
      };
      user.trades.push(stock);
      await user.save();
      req.flash(
        "success",
        `You successfully bought ${shares} shares in ${req.params.stock}`
      );
      res.redirect("/portfolio");
    }
    // var currentdate = new Date();
    // var datetime = "Last Sync: " + currentdate.getDay() + "/" + currentdate.getMonth()
    // + "/" + currentdate.getFullYear() + " @ "
    // + currentdate.getHours() + ":"
    // + currentdate.getMinutes() + ":" + currentdate.getSeconds();
  })
);
//Take id from req.user and remove stocks detail from that.
router.post(
  "/:stock/SELL",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id, stock } = req.params;
    const { shares } = req.body;
    const result = await getSpecific(req.params.stock);
    const shareInfo = await User.find(
      { _id: req.user._id, "trades.name": req.params.stock.toUpperCase() },
      { _id: 0, "trades.$": 1 }
    );
    if (shareInfo.length && shareInfo[0].trades[0].volume > parseInt(shares)) {
      const volume = shareInfo[0].trades[0].volume - parseInt(shares);
      await User.updateOne(
        {
          _id: req.user._id,
          trades: { $elemMatch: { name: req.params.stock.toUpperCase() } },
        },
        { $set: { "trades.$.volume": volume } }
      );
      req.flash(
        "success",
        `You successfully sold ${shares} shares of ${stock}`
      );
      res.redirect("/portfolio");
    } else if (
      shareInfo.length &&
      shareInfo[0].trades[0].volume === parseInt(shares)
    ) {
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { trades: { name: req.params.stock.toUpperCase() } } }
      );
      req.flash(
        "success",
        `You successfully sold ${shares} shares of ${stock}`
      );
      res.redirect("/portfolio");
    } else {
      req.flash("error", "You don't have shares to sell");
      res.redirect(`/${stock}`);
    }
  })
);
//Take id from req.user and get stocks detail from that.
router.get(
  "/:stock/details",
  isLoggedin,
  catchAsync(async (req, res) => {
    const { id, stock } = req.params;
    const market = await getSpecific(stock);
    const user = await User.findOne({ _id: req.user._id });
    const buyed = user.trades.filter((trade) => trade.name === stock)[0];

    res.render("stocks/buyinfo", { market, buyed, result: {} });
  })
);
module.exports = router;
