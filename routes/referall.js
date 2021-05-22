const router = require('express').Router();


router.get('/referral/:name',(req,res)=>{
 res.render('referral',{title:'Enkryptfinance | Referral'})
});


module.exports = router;