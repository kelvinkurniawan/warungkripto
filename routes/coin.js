var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/api/v1', function(req, res, next) {  
  
  request({
    url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', 
    qs: {
      'start': '1',
      'limit': '10',
      'convert': 'USD'
    },
    headers: {
      'X-CMC_PRO_API_KEY': 'de6a3287-fcbd-4907-8a26-ea2d5d15517f'
    },
    method: 'GET',
    json: true,
    gzip: true
  }, function(error, response, body){
    if(error){
      console.log(error);
    }else{

      let result = {
        status : [],
        data : []
      };
      for(let key in body.data){
        let data = {
          id: body.data[key].id,
          coinName: body.data[key].name,
          symbol: body.data[key].symbol,
          lastUpdate: body.data[key].last_updated,
          price: {
            current: body.data[key].quote.USD.price,
            in_1h: body.data[key].quote.USD.price + body.data[key].quote.USD.price * body.data[key].quote.USD.percent_change_1h / 100,
            in_24h: body.data[key].quote.USD.price + body.data[key].quote.USD.price * body.data[key].quote.USD.percent_change_24h / 100,
            in_7d: body.data[key].quote.USD.price + body.data[key].quote.USD.price * body.data[key].quote.USD.percent_change_7d / 100,
            in_30d: body.data[key].quote.USD.price + body.data[key].quote.USD.price * body.data[key].quote.USD.percent_change_30d / 100,
            in_60d: body.data[key].quote.USD.price + body.data[key].quote.USD.price * body.data[key].quote.USD.percent_change_60d / 100,
            in_90d: body.data[key].quote.USD.price + body.data[key].quote.USD.price * body.data[key].quote.USD.percent_change_90d / 100
          }
        }
        result.data.push(data);
      }
      result.status.push(body.status);
      res.send(result);
    }
  });
  //res.render('index', { title: 'Express' });
});

router.get("/api/v1/single", function(req, res){
  
  var id = req.header("coinId");
  
   request({
    url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=' + id, 
    qs: {
      'id': id
    },
    headers: {
      'X-CMC_PRO_API_KEY': 'de6a3287-fcbd-4907-8a26-ea2d5d15517f'
    },
    method: 'GET',
    json: true,
    gzip: true
  }, function(error, response, body){
    if(error){
      console.log(error);
    }else{
      let result = {
        status : [],
        data : []
      };

      let data = {
        id: body.data[id].id,
        coinName: body.data[id].name,
          symbol: body.data[id].symbol,
          lastUpdate: body.data[id].last_updated,
          price: {
            current: body.data[id].quote.USD.price,
            in_1h: body.data[id].quote.USD.price + body.data[id].quote.USD.price * body.data[id].quote.USD.percent_change_1h / 100,
            in_24h: body.data[id].quote.USD.price + body.data[id].quote.USD.price * body.data[id].quote.USD.percent_change_24h / 100,
            in_7d: body.data[id].quote.USD.price + body.data[id].quote.USD.price * body.data[id].quote.USD.percent_change_7d / 100,
            in_30d: body.data[id].quote.USD.price + body.data[id].quote.USD.price * body.data[id].quote.USD.percent_change_30d / 100,
            in_60d: body.data[id].quote.USD.price + body.data[id].quote.USD.price * body.data[id].quote.USD.percent_change_60d / 100,
            in_90d: body.data[id].quote.USD.price + body.data[id].quote.USD.price * body.data[id].quote.USD.percent_change_90d / 100
        }
      }
      result.status.push(body.status);
      result.data.push(data);

      res.send(result);
    }
  });
});

module.exports = router;
