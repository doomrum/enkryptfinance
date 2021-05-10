const router = require('express').Router();
const userModel  = require('../models/user');
const ticketModel  = require('../models/supportTicket');
const referralModel  = require('../models/referral');
const transactionModel  = require('../models/transaction');
const balanceModel = require('../models/balance');
// const cryptoData  = require('../helpers/userInfo');
const cryptoData  = require('../helpers/cryptoData');
const {sendEmail} = require('../helpers/nodemailer');
const moment = require('moment');
router.all('/*',(req,res,next)=>{
    if (req.session.accessType!=='client'){
        res.redirect('/admin');
    }else {
        next();}
})

router.get('/',async(req,res,next)=>{

    //sessions IDs are stored in the user browser as cookies
    //when a request s sent and there's no cookie with the session ID it will result in the failure of the request

    const ID  = req.session.access;


         await userModel.findOne({_id:ID})
             .populate('transactions')
             .populate({path:'balance',model:'balances'})
             .then(user=>{
                 const userInfo  = user.toJSON();
                 console.log(req.user);
                 const fullName = req.app.locals.username;
                 res.render('client/index',{layout: 'client', title:'EnkryptFinance | Client',userInfo,fullName });
             })

             .catch(err=>err)

});
router.get('/invest',(req,res,next)=>{
    const fullName = req.app.locals.username;
    res.render('client/invest',{layout: 'client', title:'EnkryptFinance | Invest',fullName});
});



router.get('/wallet',async (req,res,next)=>{

     transactionModel.find({owner:req.session.access})
         .lean()
         .then(transactions=>{
             balanceModel.findOne({owner:req.session.access})
                 .then(bal=>{
                     console.log(transactions);
                     console.log(bal);
                     const fullName = req.app.locals.username;
                     res.render('client/wallet',{layout: 'client', title:'EnkryptFinance | wallet',transactions ,btcBalance:bal.btcBalance,fullName});
                 })
                 .catch(err=>err);

         })
         .catch(err=>err)


});
router.get('/ticket',(req,res,next)=>{
     ticketModel.find({})
         .lean()
         .then(t=>{


             function ticketSort(t){
                 const tickets = [];
                 for (let j=0;j<t.length;j++){
                     const ticket = {
                         subject:t[j].subject,
                         msg:t[j].msg,
                         date: moment(t[j].date).format('MMM Do YY')
                     }
                     tickets.push(ticket);
                 }
                 return tickets;

             }

             console.log(ticketSort(t));
             const fullName = req.app.locals.username;
             res.render('client/ticket',{layout: 'client', title:'EnkryptFinance | Support Ticket',tickets:ticketSort(t),fullName});
         })
         .catch(err=> res.send(err))
});
router.post('/ticket/create',(req,res,next)=>{
    const newTicket = ticketModel({subject:req.body.subject,msg:req.body.msg,owner:req.session.access});
    newTicket.save()
        .then(t=>{
            userModel.findOne({_id:req.session.access})
                .then(user=>{
                    user.supporttickets.push(newTicket);
                    user.save()
                        .then(t=>{
                            res.redirect('/client/ticket');
                    })

                })

        })
        .catch(err=>err)


});

router.get('/profile',(req,res,next)=>{
    const ID  = req.session.access;

    userModel.findOne({_id:ID}).then(user=>{
        console.log(`${user} s here`);
        const userInfo  = user.toJSON();
        const fullName = req.app.locals.username;
        res.render('client/profile',{layout: 'client', title:'EnkryptFinance | profile',user:userInfo, fullName});

    })

});
router.get('/profile/edit/:_id',(req,res,next)=>{
    const ID  = req.session.access;

    userModel.findOne({_id:ID}).then(user=>{
        console.log(`${user} s here`);
        const userInfo  = user.toJSON();
        const fullName = req.app.locals.username;
        res.render('client/editProfile',{layout: 'client', title:'EnkryptFinance | profile',user:userInfo, fullName});

    })

});

router.post('/profile/edit/:_id',(req,res,next)=>{
    const ID  = req.params._id;

         userModel.updateOne({_id:ID}, {fullName:req.body.fullName, email: req.body.email, phone:req.body.phone})
             .then(user=>{
                 console.log(user)
                 res.render('client/editProfile',{layout: 'client', title:'EnkryptFinance | wallet',user:userInfo});
             })
             .catch(err=>{
                 res.send(err)
             });





});
router.get('/referral',(req,res,next)=>{

    userModel.findOne({_id:req.session.access})
        .then(user=>{
            const newReferralLink = `http://:4000${req.baseUrl}/r/${user.fullName.split(' ')[0]}`;
            const newReferral =  referralModel({link:newReferralLink,owner:req.session.access});
                newReferral.save()
                    .then(ref=>{
                        user.referralUrl = newReferralLink;
                        user.save()
                            .then(r=>{
                                const fullName = req.app.locals.username;
                                res.render('client/referral',{layout: 'client', title:'EnkryptFinance | Referral',referralLink:newReferralLink,fullName});
                            })
                            .catch(err=>err)

                    })
                    .catch(err=>err)

        })

});
router.post('/referral/em/',(req,res,next)=>{
    const params = {
        senderName: "Okibe Obinna",
        sender: "EnkryptFinance",
        client:  req.body.email,
        text: `Hi ${req.body.email}, welcome enkryptFinance`,
        subject: `Welcome to enkryptFinance`,
        user: user.fullName,
        data: {
            header: `Hi ${req.body.email}! welcome enkryptFinance` ,
            body:"You have been invited to join Enkrypt Finance",
           link: req.body.refLink



        },
        req,
        res

    };
      sendEmail(params)
});


///REFERRAL URL

router.get('/withdraw',(req,res,next)=>{
    const fullName = req.app.locals.username;
    res.render('client/withdraw',{layout: 'client', title:'EnkryptFinance | wallet',fullName});
});
router.get('/upgrade',(req,res,next)=>{
    const fullName = req.app.locals.username;
    res.render('client/upgrade',{layout: 'client', title:'EnkryptFinance | Upgrade Plan',fullName});
});
router.get('/editPassword',(req,res,next)=>{
    const fullName = req.app.locals.username;
    res.render('client/editPassword',{layout: 'client', title:'EnkryptFinance | Upgrade Plan',fullName});
});
router.get('/logout',(req,res,next)=>{
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;