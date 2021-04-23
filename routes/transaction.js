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
    const balanceQuerySnapshot = await db.collection('users').doc(userId).collection("transactions").get();
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

    for(let doc of docs){
      if(doc.data().id == coinId){
        let subTotal = 0;
        subTotal = doc.data().price * doc.data().amount;
        result.data['amount'] += doc.data().amount;
        result.data['totalAsset'] += subTotal;
      };
    }

    result.data['avgBuy'] = result.data['totalAsset'] / result.data['amount'];

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