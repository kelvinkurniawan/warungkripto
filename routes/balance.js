var express = require('express');
var router = express.Router();
var fire = require('../config/firebase');
var bodyparser = require('body-parser');
var db = fire.firestore();
router.use(bodyparser.json());

router.get('/current', async function(req, res, next){
  const userId = req.header('UserId');

  try{
    let topup = 0, withdraw = 0;
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

    result = {
      top_up: topup,
      withdraw: withdraw,
      current: topup - withdraw
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
      status: false,
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