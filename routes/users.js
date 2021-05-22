var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const planModel = require('../models/plan');
const balanceModel = require('../models/balance');
const {emailSender} = require('../helpers/nodemailer');
const {validateLogin,validateNewUser} = require('../helpers/authValidator')
const axios = require('axios');
/* GET users listing. */
router.get('/signup',async function(req, res, next) {

  await  axios.get('https://restcountries.eu/rest/v2/all')
        .then(response=>{
            planModel.find({})
                .lean()
                .then(plan=>{
                    console.log(plan)
                    const countryInfo = response.data;
                    let country = [];
                    for (let i = 0;i<countryInfo.length;i++){
                        let item = countryInfo[i];
                        country.push({
                            name: item['name'],
                            code: item['callingCodes'][0],
                        })
                    }
                    console.log(country);

                    res.render('auth/signup',{layout:'auth',title:'Enkryptfinance | sign up', country, plan});
                })
                .catch(err=>{
                    res.status(403).send(err);
                })


        })

});

router.get('/reset',(req,res)=>{
    userModel.remove({})
        .then(result=>res.send(`removed ${result}`))
        .catch(err=>res.status(403).send(err))
})

router.post('/register/:id', function(req, res, next) {


    let proofIdFile;
    let proofResidenceFile;
    let uploadPathID;
    let uploadPathRES;

    if (!req.files || Object.keys(req.files).length === 0) {

       req.flash('failure_message', 'Please upload documents');
       res.redirect('/auth/register');

    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    proofIdFile =  req.files.proofID;
    proofResidenceFile =  req.files.proofResidence;
    uploadPathID = './public/uploads/' + proofIdFile.name;
    uploadPathRES = './public/uploads/' + proofResidenceFile.name;

    // Use the mv() method to place the file somewhere on your server
    proofIdFile.mv(uploadPathID, function(err) {
        if (err)
            return res.status(500).send(err);
        proofResidenceFile.mv(uploadPathRES,(err)=>{
            if(!err){
                userModel.findByIdAndUpdate({_id:req.params.id},{
                    urlProofId: uploadPathID,
                    urlProofResidence: uploadPathRES
                })
                    .then(async (user)=>{
                        let userInitial = user;
                        ///Email is sent here
                        const params = {
                            senderName: "Okibe Obinna",
                            sender: "EnkryptFinance",
                            client:  user.email,
                            text: `Hi ${user.fullName}, welcome enkryptFinance`,
                            subject: `Welcome to enkryptFinance`,
                            user: user.fullName,
                            data: {
                                header: `Hi ${user.fullName.split(' ',1)}! welcome to enkryptFinance` ,
                                body:"Welcome to a world of investment and opportunities",
                                imgPath: './public/images/logo.png',
                                imgPathBody: './public/images/welcome3.png',
                                imgName: 'logo.png',
                                imgNameBody: 'welcome3.png',
                                cid: 'unique@enkryptfin',
                                cidBody:'uniquebody@enkrypt',

                            },
                            req,
                            res

                        };

                      await emailSender(params);


                    })
                    .catch(err=>{
                        console.log(err);
                        res.send(err)
                    })
            }
        })
    });



});


router.get('/users', async function(req, res, next) {
    userModel.find({})
        .then(user=>{
            res.send(user)
        })
        .catch(err=>res.status(401).send(err))
});


router.get('/login',(req,res,next)=>{
  res.render('auth/login',{layout:'auth',title:'Enkryptfinance | login'});
});

router.post('/register',async (req,res)=>{


    ////merging first, mid & last name to give full name
    console.log(req.body)
    const fullName = req.body.firstName + " "  + req.body.middleName + " " + req.body.lastName;
    const phoneNumber = req.body.code + req.body.phone;
    const terms = req.body.terms === 'on';

   const {error} = validateNewUser({
       fullName,
       email:req.body.email,
       phone:phoneNumber,
       terms,
       password:req.body.password,

   });
   if (!error){
      userModel.findOne({email:req.body.email.toLowerCase()})
          .then(user=>{
              req.flash('failure_message',`user with email ${user.email} exists Please Try again with another Email or Login`)
              res.redirect('/auth/signup');
          })
          .catch(async ()=>{
            const salt = await bcrypt.genSalt(12);
            const password = await bcrypt.hash(req.body.password,salt);

            const newUser = new userModel({fullName, email:req.body.email.toLowerCase(),password,phone:phoneNumber,verified:false, terms,code: req.body.code,
                country:req.body.country, plan: req.body.plan});

            newUser.save()
                .then(user =>{
                 const newbalance = new balanceModel({currentInvestment:0,currentReturns:0, btcBalance:0, owner: user._id});
                 newbalance.save()
                     .then(bal=>{
                         console.log(user, bal)
                         user.balance = newbalance;
                         user.save()
                             .then(u=>{
                                 res.render('auth/signup-det',{layout:'auth',title:'Enkryptfinance | sign up', id: user._id});
                             })
                             .catch(e=>{
                                 res.status(403).send(e)
                             })

                     })
                     .catch(err=>res.status(403).send(err))



                  // res.send(`${user} created`)
                })
                .catch(err=>{
                  res.send(err);
                });
          })
   }

});


router.post('/login',async (req,res)=>{

   const {error} = validateLogin({email:req.body.email.trim().toLowerCase(),password:req.body.password});
   if (!error){
      userModel.findOne({email:req.body.email.trim().toLowerCase()})
          .then(async (user)=>{
           const validPassword = await bcrypt.compare(req.body.password,user.password);
//////SET COOKIE IF VALID
           if (validPassword){

            if(user.email==='admin@enkrypt.com'){
                req.session.access = user._id;
                req.session.accessType = 'admin';
                req.app.locals.username = user.fullName;
                req.flash('success_message','welcome')
                res.redirect('/admin');

            }
            // if(user.fullName==='SuperAdmin'){
            //     ///super Admin
            // }
            else{
                req.session.access = user._id;
                req.session.accessType = 'client';
                req.app.locals.username = user.fullName;
                req.flash('success_message','welcome ')

                res.redirect('/client');
            }
           }
           else {
               req.flash('failure_message',`Password  is not correct!`)
               res.redirect('/auth/login');
           }

          })
          .catch( err=>{
              req.flash('failure_message',`Invalid User`)
              res.redirect('/auth/login');
          });
   }
   else{
       req.flash('failure_message',`${error}`)
       res.redirect('/auth/login');
   }

})

module.exports = router;
