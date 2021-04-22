var express = require('express');
var router = express.Router();
var fire = require('../config/firebase');
var bodyparser = require('body-parser');
var db = fire.firestore();
var request = require('request-promise');

router.use(bodyparser.json());
require('dotenv').config();

const baseURL = process.env.BASEURL;

router.get('/current', async function(req, res, next){
  const userId = req.header('UserId');
  transactionBuy = 0;
  transactionSell = 0;
  topup = 0;
  withdraw = 0;
  
  result = {
    transaction : {}
  }

  await request({
    url: baseURL + '/transaction/history',
    headers: {
      'userId': userId
    },
    method: 'GET',
    json: true
  }, function(error, response, body){
    if(error){
      console.log(error);
    }else{
      for(let doc of body.data){
        if(doc.transaction.type == "buy"){
          tempTransactionBuy = doc.transaction.amount * doc.transaction.price;
          transactionBuy += tempTransactionBuy;
        }

        if(doc.transaction.type == "sell"){
          tempTransactionSell = doc.transaction.amount * doc.transaction.price;
          transactionSell += tempTransactionSell;
        }
      }
      result.transaction['transactionBuy'] = transactionBuy;
      result.transaction['transactionSell'] = transactionSell;
    }
  });

  try{
    const balanceQuerySnapshot = await db.collection('users').doc(userId).collection("balances").get();
    const docs = balanceQuerySnapshot.docs;

    for(let doc of docs){
      if(doc.data().type == 'topup'){
        topup += doc.data().amount;
      }

      if(doc.data().type == 'withdraw'){
        withdraw += doc.data().amount;
      }
    }

    result['top_up'] = topup;
    result['withdraw'] = withdraw;
    result['current'] = parseFloat(topup) - parseFloat(withdraw) + (transactionSell - transactionBuy);
    res.status(201).send(result);

  }catch(error){
    result = {
      status: "error",
      error: error
    }
    res.status(400).send(result);
  }

});

router.get('/history', async function(req, res, next){
  const userId = req.header('UserId');

  try{
    let result = [];
    const balanceQuerySnapshot = await db.collection('users').doc(userId).collection("balances").get();
    const docs = balanceQuerySnapshot.docs;

    for(let doc of docs){
      item = {
        id: doc.id,
        balance: doc.data()
      }

      result.push(item);
    }

    res.status(201).json(result);
  }catch(error){
    result = {
      status: "error",
      error: error
    }
    res.status(400).send(result);
  }
});

router.post('/', async function(req, res, next){
  const userId = req.header('UserId');
  try{
    const balance = {
      amount: req.body.amount,
      gateway: req.body.gateway,
      type: req.body.type,
      status: true,
      date: new Date()
    };

    newDoc = db.collection('users')
               .doc(userId)
               .collection('balances')
               .add(balance);

    result = {
      status : "success",
      data : newDoc
    }

    res.status(201).send(result);

  }catch(error){
    result = {
      status: "error",
      error: error
    }
    res.status(400).send(result);
  }
 
});

module.exports = router;