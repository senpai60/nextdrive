var express = require('express');
var router = express.Router();
const isAuthenticated = require('../middlewares/auth');

const authCheck = require('../middlewares/authcheck');
/* GET home page. */
router.get('/', authCheck,function(req, res, next) {
  res.render('index', { title: 'Express'});
});

module.exports = router;
