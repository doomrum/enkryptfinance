const router = require('express').Router();

router.get('/',(req,res,next)=>{
    res.render('client/index',{layout: 'client', title:'EnkryptFinance | Client'});
});
router.get('/invest',(req,res,next)=>{
    res.render('admin/invest',{layout: 'admin', title:'EnkryptFinance | Invest'});
});
router.get('/wallet',(req,res,next)=>{
    res.render('client/wallet',{layout: 'admin', title:'EnkryptFinance | wallet'});
});

module.exports = router;