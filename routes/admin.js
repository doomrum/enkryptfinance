const router = require('express').Router();

router.get('/',(req,res,next)=>{
    res.render('admin/index',{layout: 'admin', title:'EnkryptFinance | Admin'});
});

router.get('/chat',(req,res,next)=>{
    res.render('admin/chat',{layout: 'admin', title:'EnkryptFinance | Chat'});
});
router.get('/users',(req,res,next)=>{
    res.render('admin/users',{layout: 'admin', title:'EnkryptFinance | Users'});
});


module.exports = router;