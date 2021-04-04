var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const {validateLogin,validateNewUser} = require('../helpers/authValidator')
/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('auth/signup',{layout:'auth',title:'Enkryptfinance | sign up'});
});

router.get('/login',(req,res,next)=>{
  res.render('auth/login',{layout:'auth',title:'Enkryptfinance | login'});
});

router.post('/register',async (req,res)=>{
   const {error} = validateNewUser(req.body);
   if (!error){
      userModel.findOne({email:req.body.email})
          .then(user=>{
            res.send(`user with email${user.email} exists`);
          })
          .catch(async ()=>{
            const salt = await bcrypt.genSalt(12);
            const password = await bcrypt.hash(req.body.password,salt);
            const newUser = userModel({fullName:req.body.fullName, email:req.body.email,password});

            newUser.save()
                .then(user=>{
                  // console.log(user);
                    res.redirect('/client',200);
                  res.send('user created ')
                })
                .catch(err=>{
                  res.send(err);
                });
          })
   }

});


router.post('/login',async (req,res)=>{
   const {error} = validateLogin(req.body);
   if (!error){
     await userModel.findOne({email:req.body.email})
          .then(async (user)=>{
           const validPassword = await bcrypt.compare(req.body.password,user.password);
//////SET COOKIE IF VALID
           if (validPassword){

               res.redirect('/admin',200);
               // res.status(200).send('valid user')
           }
           else {
               res.status(403).send('error')
           }

          })
          .catch( err=>{
            res.send(err)
          });
   }

})

module.exports = router;
