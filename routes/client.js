const router = require('express').Router();
const userModel  = require('../models/user');
const ticketModel  = require('../models/supportTicket');
const referralModel  = require('../models/referral');
const transactionModel  = require('../models/transaction');
// const cryptoData  = require('../helpers/userInfo');
const cryptoData  = require('../helpers/cryptoData');
const {sendEmail} = require('../helpers/nodemailer');
const moment = require('moment');


router.get('/',async(req,res,next)=>{

    //sessions IDs are stored in the user browser as cookies
    //when a request s sent and there's no cookie with the session ID it will result in the failure of the request

    const ID  = req.session.access;

       await userModel.findOne({_id:ID})
           .populate('transactions')
            .then(user=>{
            const userInfo  = user.toJSON();
                // console.log(req.user);
            res.render('client/index',{layout: 'client', title:'EnkryptFinance | Client',userInfo,});
        })

            .catch(err=>err)
});
router.get('/invest',(req,res,next)=>{

    res.render('client/invest',{layout: 'client', title:'EnkryptFinance | Invest'});
});



router.get('/wallet',async (req,res,next)=>{

     transactionModel.find({owner:req.session.access})
         .lean()
         .then(transactions=>{
             console.log(transactions);
             res.render('client/wallet',{layout: 'client', title:'EnkryptFinance | wallet',transactions });
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

             console.log(ticketSort(t))
             res.render('client/ticket',{layout: 'client', title:'EnkryptFinance | Invest',tickets:ticketSort(t)});
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
        res.render('client/profile',{layout: 'client', title:'EnkryptFinance | wallet',user:userInfo});

    })

});
router.get('/profile/edit/:_id',(req,res,next)=>{
    const ID  = req.session.access;

    userModel.findOne({_id:ID}).then(user=>{
        console.log(`${user} s here`);
        const userInfo  = user.toJSON();
        res.render('client/editProfile',{layout: 'client', title:'EnkryptFinance | wallet',user:userInfo});

    })

});

router.post('/profile/edit/:_id',(req,res,next)=>{
    const ID  = req.params._id;

         userModel.updateOne({_id:ID}, {fullName:req.body.fullName, email: req.body.email, phone:req.body.phone})
             .then(user=>{
                 console.log(user)
                 res.send(user)
             })
             .catch(err=>{
                 res.send(err)
             });

        // res.render('client/editProfile',{layout: 'client', title:'EnkryptFinance | wallet',user:userInfo});



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
                                res.render('client/referral',{layout: 'client', title:'EnkryptFinance | Invest',referralLink:newReferralLink});
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
    res.render('client/withdraw',{layout: 'client', title:'EnkryptFinance | wallet'});
});

module.exports = router;