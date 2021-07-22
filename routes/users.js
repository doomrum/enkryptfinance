var express = require("express");
var router = express.Router();
const { uploadImage,getImage} = require('../helpers/imageUpload');
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const planModel = require("../models/plan");
const balanceModel = require("../models/balance");
const { validateLogin, validateNewUser } = require("../helpers/authValidator");
const axios = require("axios");
const Emailing = require('../helpers/Emailing');

/* GET users listing. */
router.get("/signup", async function (req, res, next) {
  await axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
    planModel
      .find({})
      .lean()
      .then((plan) => {
        // console.log(plan);
        const countryInfo = response.data;
        let country = [];
        for (let i = 0; i < countryInfo.length; i++) {
          let item = countryInfo[i];
          country.push({
            name: item["name"],
            code: item["callingCodes"][0],
          });
        }
        // console.log(country);

        res.render("auth/signup", {
          layout: "auth",
          title: "Enkryptfinance | sign up",
          country,
          plan,
        });
      })
      .catch((err) => {
        res.status(403).send(err);
      });
  });
});

router.get("/reset", (req, res) => {
  userModel
    .remove({})
    .then((result) => res.send(`removed ${result}`))
    .catch((err) => res.status(403).send(err));
});

router.post('/register/:id', async (req, res) => {


    if (!req.files || Object.keys(req.files).length === 0) {

        req.flash('failure_message', 'Please Login & upload documents');
        res.redirect('/auth/signup');

    }


    let proofID = req.files.proofID;
    let proofResidenceFile = req.files.proofResidence;

// //cloudinary//
//     console.log(proofID)
    const proofID_ = await uploadImage(proofID);
    const proofRes = await uploadImage(proofResidenceFile);


    // Use the mv() method to place the file somewhere on your server
    if (proofID_ && proofRes) {
        const proofIdUrl = proofID_.secure_url;
        const proofResUrl = proofRes.secure_url;
        userModel.findByIdAndUpdate({_id: req.params.id}, {
            urlProofId: proofIdUrl,
            urlProofResidence: proofResUrl
        },{useFindAndModify:false})
            .then(async (user) => {
                // let userInitial = user;
                ///Email is sent here

                ///HEADER
                let emailHeader = {
                    subject:'Welcome to enkrypt Finance',
                    redirect:'/auth/login',
                    id: user._id
                }

                ///MESSAGE
                let emailMessage = {
                    header: `Hi ${user.fullName.split(' ', 1)}! welcome to enkryptFinance`,
                    imgPath: './public/images/welcome3.png',
                    cidName: 'welcome3.png',
                    cid: 'uniquebody@enkrypt',
                }

                ///ACCOUNT MAILING
                let emailAccount = {
                    sender:'Tonda Miles',
                    email: 'support'
                }

                ///RECEIVER
                let mailedTo = {
                    receiver: user.email,
                    message:`Hi ${user.fullName.split(' ', 1)}, welcome to enkryptFinance`,
                    header:'',
                    name:user.fullName,
                }

                let newEmail = new Emailing('signUp', emailHeader, emailMessage, emailAccount,mailedTo,{req,res});
                await newEmail.sendEmail();


            })
            .catch(err => {
                console.log(err);
                res.send(err)
            })
    } else {
        req.flash('failure_message', 'sorry try again later');
        const id = req.session.access
        res.render('auth/signup-det', {layout: 'auth', title: 'Enkryptfinance | sign up', id: id});

    }

})

router.get("/users", async function (req, res, next) {
  userModel
    .find({})
    .then((user) => {
      res.send(user);
    })
    .catch((err) => res.status(401).send(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { layout: "auth", title: "Enkryptfinance | login" });
});

router.post("/register", async (req, res) => {
  ////merging first, mid & last name to give full name
  const middleName = req.body.middleName?req.body.middleName:' '
    const fullName =
    req.body.firstName + " " + middleName + " " + req.body.lastName;
  const phoneNumber = req.body.code + req.body.phone;
  const terms = req.body.terms === "on";

  const { error } = validateNewUser({
    fullName,
    email: req.body.email,
    phone: phoneNumber,
    terms,
    password: req.body.password,
  });
  if (!error) {
    userModel
      .findOne({ email: req.body.email.toLowerCase() })
      .then((user) => {
        req.flash(
          "failure_message",
          `user with email ${user.email} exists Please Try again with another Email or Login`
        );
        res.redirect("/auth/signup");
      })
      .catch(async () => {
        const salt = await bcrypt.genSalt(12);
        const password = await bcrypt.hash(req.body.password, salt);

        const newUser = new userModel({
          fullName,
          email: req.body.email.toLowerCase(),
          password,
          phone: phoneNumber,
          verified: false,
          terms,
          code: req.body.code,
          country: req.body.country,
          plan: req.body.plan,
        });

        newUser
          .save()
          .then((user) => {
            const newbalance = new balanceModel({
              currentInvestment: 0,
              currentReturns: 0,
              btcBalance: 0,
              owner: user._id,
            });
            newbalance
              .save()
              .then((bal) => {
                console.log(user, bal);
                user.balance = newbalance;
                user
                  .save()
                  .then((u) => {
                    res.render("auth/signup-det", {
                      layout: "auth",
                      title: "Enkryptfinance | sign up",
                      id: user._id,
                    });
                  })
                  .catch((e) => {
                    res.status(403).send(e);
                  });
              })
              .catch((err) => res.status(403).send(err));

            // res.send(`${user} created`)
          })
          .catch((err) => {
            res.send(err);
          });
      });
  }
});

router.post("/login", async (req, res) => {
  const { error } = validateLogin({
    email: req.body.email.trim().toLowerCase(),
    password: req.body.password,
  });
  if (!error) {
    userModel
      .findOne({ email: req.body.email.trim().toLowerCase() })
      .then(async (user) => {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        //////SET COOKIE IF VALID
        if (validPassword) {
          if (user.email === "admin@enkrypt.com") {
            req.session.access = user._id;
            req.session.accessType = "admin";
            req.app.locals.username = user.fullName;

            req.flash("success_message", "welcome");
            res.redirect("/admin");
          }
          // if(user.fullName==='SuperAdmin'){
          //     ///super Admin
          // }
          else {
            req.session.access = user._id;
            req.session.accessType = "client";
            req.app.locals.username = user.fullName;
              ///HEADER
              let emailHeader = {
                  subject:'New login ⭐⭐',
                  redirect:'/client'
              }


              ///MESSAGE
              let emailMessage = {
                  header: `Hi ${user.fullName.split(' ', 1)}, There has been a new login to your account`,
                  imgPath: './public/images/login.png',
                  cidName: 'login.png',
                  cid: 'uniquebody@enkrypt',
              }

              ///ACCOUNT MAILING
              let emailAccount = {
                  sender:'Enkrypt Support',
                  email: 'support'
              }

              ///RECEIVER
              let mailedTo = {
                  receiver: user.email,
                  message: user.email,
                  header:'New login to Your Account 💥',
                  name:user.fullName,
              }

              let newEmail = new Emailing('login', emailHeader, emailMessage, emailAccount,mailedTo,{req,res});
              await newEmail.sendEmail();
            res.redirect("/client");
          }
        } else {
          req.flash("failure_message", `Password  is not correct!`);
          res.redirect("/auth/login");
        }
      })
      .catch((err) => {
        req.flash("failure_message", `Invalid User ${err}`);
        res.redirect("/auth/login");
      });
  } else {
    req.flash("failure_message", `${error}`);
    res.redirect("/auth/login");
  }
});

router.get('/verification/:id',(req,res)=>{
    userModel.findById(req.params.id)
        .then(user=>{
            if (user.verified===true){
                res.render('client/allVerified',{layout: 'verified'})
            }
            user.verified = true;
            user.save()
                .then(u=>{
                    res.render('client/verified',{layout: 'verified'})
                })
        })
})

module.exports = router;