var express = require('express');
var router = express.Router();
var fire = require('../config/firebase');
var db = fire.firestore();
var bodyparser = require('body-parser');

router.use(bodyparser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/setProfile', function(req, res, next){
  res.send();
})


module.exports = router;
