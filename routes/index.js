var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {  
  

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
          coinName: body.data[key].name,
          symbol: body.data[key].symbol
        }
        result.data.push(data);
      }
      result.status.push(body.status);
      res.send(result);
    }
  });
  //res.render('index', { title: 'Express' });
});

module.exports = router;
