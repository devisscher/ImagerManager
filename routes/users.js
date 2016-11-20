var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('identity');
});
router.get('/identity', function(req, res, next) {

    var domain_name = req.query.domain_name;
    req.session['team'] = domain_name;
    console.log(req.session.team);
    res.redirect('/');


});

module.exports = router;