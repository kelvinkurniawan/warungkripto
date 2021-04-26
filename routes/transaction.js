var express = require('express');
var router = express.Router();
var fire = require('../config/firebase');
var bodyparser = require('body-parser');
var request = require('request-promise');
const { route } = require('./coin');
var db = fire.firestore();

router.use(bodyparser.json());

router.get('/history', async function(req, res, next){
  const userId = req.header('UserId');

  try{
    let result = {
      status : "success",
      data : []
    };
    const balanceQuerySnapshot = await db.collection('users').doc(userId).collection("transactions").orderBy("date", "desc").get();
    const docs = balanceQuerySnapshot.docs;

    for(let doc of docs){
      item = {
        id: doc.id,
        transaction: doc.data()
      }

      result.data.push(item);
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

router.get('/history_by_crypto', async function(req, res, next){
  const userId = req.header('UserId');
  const coinId = req.header('coinId');

  try{
    let result = {
      status : "success",
      data : []
    };
    const balanceQuerySnapshot = await db.collection('users').doc(userId).collection("transactions").get();
    const docs = balanceQuerySnapshot.docs;

    for(let doc of docs){
      if(doc.data().id == coinId){
        item = {
          id: doc.id,
          transaction: doc.data()
        }

        result.data.push(item);
      }
    }

    res.status(201).json(result);
  }catch(error){
    result = {
      status: "error",
      error: error
    }
    res.status(400).send(result);
  }
})

router.post('/', async function(req, res, next){
  const userId = req.header('UserId');

  try{
    const transaction = {
      id: req.body.id,
      coin: req.body.coin,
      amount: req.body.amount,
      price: req.body.price,
      type: req.body.type,
      date: new Date()
    };

    newDoc = db.collection('users')
               .doc(userId)
               .collection('transactions')
               .add(transaction);

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

router.get('/assets_in_single', async function(req, res, next){
  const userId = req.header('UserId');
  const coinId = req.header('CoinId');

  try{
    let result = {
      status : "success",
      data : {
        amount : 0,
        totalAsset : 0,
        avgBuy : 0
      }
    };
    
    const balanceQuerySnapshot = await db.collection('users').doc(userId).collection("transactions").get();
    const docs = balanceQuerySnapshot.docs;
    let totalRow = 0;

    buy=0, sell=0;
    totalBuy=0, totalSell = 0;

    for(let doc of docs){
      console.log(doc.data().price);
      if(doc.data().id == coinId){
        if(doc.data().type == 'buy'){
          buy += doc.data().amount
          totalBuy += doc.data().price * doc.data().amount;
        }

        if(doc.data().type == 'sell'){
          sell += doc.data().amount;
          totalSell += doc.data().price * doc.data().amount;
        }
      };
    }
    result.data['amount'] = buy - sell;
    result.data['totalAsset'] = totalBuy;
    result.data['avgBuy'] = totalBuy / buy;

    res.status(201).json(result);
  }catch(error){
    result = {
      status: "error",
      error: error
    }
    res.status(400).send(result);
  }
});

router.get('/my_coin', async function(req, res, next){
  const userId = req.header('UserId');

  try{
    let result = {
      status : "success",
      data : {
        coin : []
      }
    };
    
    const balanceQuerySnapshot = await db.collection('users').doc(userId).collection("transactions").get();
    const docs = balanceQuerySnapshot.docs;

    for(let doc of docs){

      id = doc.data().id;

      let amount = 0;
      countCheck = 0;
      if(doc.data().type == "buy"){
        amount = doc.data().amount
      }
      if(doc.data().type == "sell"){
        amount = -(doc.data().amount)
      }
      buy = 0; sell = 0; total = 0;
      for(let i = 0; i < result.data.coin.length; i++){
        let coin = result.data.coin;
        if(coin[i].id == id){
          countCheck += 1;
          amount += coin[i].total
        }
      }

      if(countCheck == 0 && amount != 0){
        console.log(amount);
        result.data.coin.push({
          id: id, 
          coin: doc.data().coin,
          total: amount
        });
      }
      
      if(countCheck != 0){
        console.log("sec " + amount);
        for(let i = 0; i < result.data.coin.length; i++){
          if(id == result.data.coin[i].id){
            result.data.coin[i].total = amount;
          }

          if(id == result.data.coin[i].id && amount == 0){
            result.data.coin.splice(i,i)
          }
        }
      }
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

module.exports = router;