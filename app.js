var unirest = require("unirest");

var req = unirest("GET", "https://latest-stock-price.p.rapidapi.com/any");

req.query({
	"Identifier": "HDFCEQN"
});

req.headers({
	"x-rapidapi-key": "76633c8222msh605f67b23d649edp1f033cjsn67bf2fdcc7c7",
	"x-rapidapi-host": "latest-stock-price.p.rapidapi.com",
	"useQueryString": true
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});