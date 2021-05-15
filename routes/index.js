var express = require('express');
var router = express.Router();
const axios = require('axios');
/* GET home page. */
router.get('/',async function(req, res, next) {

    res.render('home',{title:'EnkryptFinance | Landing Page'})
});

router.get('/about',async function(req, res, next) {

    res.render('about',{title:'EnkryptFinance | About', layout: 'index'})
});
router.get('/terms',async function(req, res, next) {

    res.render('terms',{title:'EnkryptFinance |Terms', layout: 'index'})
});

router.get('/faqs',async function(req, res, next) {

    res.render('faqs',{title:'EnkryptFinance | FAQs', layout: 'index'})
});

router.get('/plans',async function(req, res, next) {

    res.render('plans',{title:'EnkryptFinance | Plans', layout: 'index'})
});


router.get('/security',async function(req, res, next) {

    res.render('security',{title:'EnkryptFinance | Security', layout: 'index'})
});

router.get('/offers',async function(req, res, next) {

    res.render('offers',{title:'EnkryptFinance | Offers', layout: 'index'})
});

router.get('/gettingstarted',async function(req, res, next) {

    res.render('gettingStarted',{title:'EnkryptFinance | Getting Started', layout: 'index'})
});

module.exports = router;



















//
// await  axios.get(`https://api.nomics.com/v1/exchange-rates?key=${process.env.API_KEY}`)
//     .then(result=>{
//             let  response = result.data;
//             console.log(response);
//             res.render('index', {title:'home', result: response});
//         }
//     )
//     .catch(err=>console.log(err))
// },3000)
