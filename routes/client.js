const router = require('express').Router();

router.get('/',(req,res,next)=>{
    res.render('client/index',{layout: 'client', title:'EnkryptFinance | Client'});
});
router.get('/invest',(req,res,next)=>{
    res.render('client/invest',{layout: 'client', title:'EnkryptFinance | Invest'});
});
router.get('/wallet',(req,res,next)=>{
    res.render('client/wallet',{layout: 'client', title:'EnkryptFinance | wallet'});
});

module.exports = router;