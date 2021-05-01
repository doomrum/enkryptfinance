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
router.get('/ticket',(req,res,next)=>{
    res.render('client/ticket',{layout: 'client', title:'EnkryptFinance | Invest'});
});
// router.get('/transaction',(req,res,next)=>{
//     res.render('client/walletTransaction',{layout: 'client', title:'EnkryptFinance | wallet'});
// });
router.get('/profile',(req,res,next)=>{
    res.render('client/profile',{layout: 'client', title:'EnkryptFinance | wallet'});
});
router.get('/referral',(req,res,next)=>{
    res.render('client/referral',{layout: 'client', title:'EnkryptFinance | Invest'});
});
router.get('/withdraw',(req,res,next)=>{
    res.render('client/withdraw',{layout: 'client', title:'EnkryptFinance | wallet'});
});

module.exports = router;