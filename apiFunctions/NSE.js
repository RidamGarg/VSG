const fetch = require("node-fetch");
const querystring = require("querystring");
const rapidApi = process.env.Rapid_Api;

module.exports.getStockPrices = (index, symbol = "") => {
  const data = {
    Indices: index.toUpperCase(),
    Identifier: symbol.toUpperCase(),
  };
  const query = querystring.stringify(data);
  return fetch("https://latest-stock-price.p.rapidapi.com/price?" + query, {
    method: "GET",
    headers: {
      "x-rapidapi-key": rapidApi,
      "x-rapidapi-host": "latest-stock-price.p.rapidapi.com",
      useQueryString: true,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log("Error", err));
};
module.exports.getPartucularStockPrices = (symbol = "") => {
  const data = {
    Identifier: symbol.toUpperCase(),
  };
  const query = querystring.stringify(data);
  return fetch("https://latest-stock-price.p.rapidapi.com/any?" + query, {
    method: "GET",
    headers: {
      "x-rapidapi-key": rapidApi,
      "x-rapidapi-host": "latest-stock-price.p.rapidapi.com",
      useQueryString: true,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log("Error", err));
};
