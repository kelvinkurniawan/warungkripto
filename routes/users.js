var express = require('express');
var router = express.Router();
var fire = require('../config/firebase');
var db = fire.firestore();
var bodyparser = require('body-parser');
var userId = "Yq4R5KCUaQOjf8e5qP3rmBVdutB3";

router.use(bodyparser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/detail', async function(req, res, next){
  try{
    const userQuerySnapshot = await db.collection('users').doc(userId).get();
    const doc = userQuerySnapshot;
    
    result = {
      id: doc.id,
      data: doc.data()
    }

    res.status(201).send(result);
  }catch(error){
    result = {
      status: "error",
      error: error
    }

    res.status(400).send(result);
  }

})

router.post('/setProfile', async function(req, res, next){
  try{

    const userDetail = {
      fullname: req.body.fullname,
      username: req.body.username,
      photo_path: req.body.photo_path
    }

    doc = db.collection('users').doc(userId).set(userDetail);

    result = {
      status: "success",
      data: doc
    }

    res.status(201).send(result);
  }catch(error){
    result = {
      status: "error",
      error: error
    }

    res.status(400).send(result);
  }
})

module.exports = router;
