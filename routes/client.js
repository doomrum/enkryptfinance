const router = require("express").Router();
const userModel = require("../models/user");
const ticketModel = require("../models/supportTicket");
const referralModel = require("../models/referral");
const transactionModel = require("../models/transaction");
const upTransactionModel = require("../models/transaction");
const balanceModel = require("../models/balance");
const planModel = require("../models/plan");
const qr = require("qrcode");
const axios = require('axios');
const bcrypt = require("bcrypt");
// const cryptoData  = require('../helpers/userInfo');
const { sendEmail } = require("../helpers/nodemailer");
const moment = require("moment");
router.all("/*", (req, res, next) => {
  if (req.session.accessType !== "client") {
    res.redirect("/admin");
  } else {
    next();
  }
});

router.get("/", async (req, res) => {
  //sessions IDs are stored in the user browser as cookies
  //when a request s sent and there's no cookie with the session ID it will result in the failure of the request

  const ID = req.session.access;
  const IDType = req.session.accessType;

  await userModel
    .findOne({ _id: ID })
    .populate({path:"transactions",model:"transactions"})
    .populate({ path: "balance", model: "balances" })
    .populate({ path: "plan", model: "plans" })

    .then((user) => {
      const userInfo = user.toJSON();
      // console.log(user.transactions);
      let transactions = userInfo.transactions.slice(0,7)
      const fullName = req.app.locals.username;
      res.render("client/index", {
        layout: "client",
        title: "EnkryptFinance | Client",
        userInfo,
        fullName,
          transactions
      });
    })

    .catch((err) => err);
});

router.get("/invest", async (req, res) => {
  const fullName = req.app.locals.username;
  planModel
    .find({})
    .lean()
    .then((plan) => {
      res.render("client/invest", {
        layout: "client",
        title: "EnkryptFinance | Invest",
        fullName,
        plan,
      });
    })
    .catch((err) => err);
});

router.get("/wallet", async (req, res) => {
  transactionModel
    .find({ owner: req.session.access })
    .lean()
    .then((transactions) => {
      balanceModel
        .findOne({ owner: req.session.access })
        .then((bal) => {
          const fullName = req.app.locals.username;
          res.render("client/wallet", {
            layout: "client",
            title: "EnkryptFinance | wallet",
            transactions,
            btcBalance: bal.btcBalance,
            fullName,
          });
        })
        .catch((err) => err);
    })
    .catch((err) => err);
});
router.get("/ticket", (req, res) => {
  ticketModel
    .find({owner:req.session.access})
    .lean()
    .then((t) => {
      function ticketSort(t) {
        const tickets = [];
        for (let j = 0; j < t.length; j++) {
          const ticket = {
            subject: t[j].subject,
            msg: t[j].msg,
            date: moment(t[j].date).format("MMM Do YY"),
          };
          tickets.push(ticket);
        }
        return tickets;
      }

      console.log(ticketSort(t));
      const fullName = req.app.locals.username;
      res.render("client/ticket", {
        layout: "client",
        title: "EnkryptFinance | Support Ticket",
        tickets: ticketSort(t),
        fullName,
      });
    })
    .catch((err) => {
        res.render("client/ticket", {
            layout: "client",
            title: "EnkryptFinance | Support Ticket"
        });
    });
});
router.post("/ticket/create", (req, res) => {
  const newTicket = ticketModel({
    subject: req.body.subject,
    msg: req.body.msg,
    owner: req.session.access,
  });
  newTicket
    .save()
    .then((t) => {
      userModel.findOne({ _id: req.session.access }).then((user) => {
        user.supporttickets.push(newTicket);
        user.save().then((t) => {
          res.redirect("/client/ticket");
        });
      });
    })
    .catch((err) => err);
});

router.get("/profile", (req, res) => {
  const ID = req.session.access;

  userModel.findOne({ _id: ID }).then((user) => {
    console.log(`${user} s here`);
    const userInfo = user.toJSON();
    const fullName = req.app.locals.username;
    res.render("client/profile", {
      layout: "client",
      title: "EnkryptFinance | profile",
      user: userInfo,
      fullName,
    });
  });
});

router.get("/referral", (req, res) => {
  userModel.findOne({ _id: req.session.access }).then((user) => {
    const newReferralLink =
      process.env.NODE_ENV === "production"
        ? `https://enkryptfinance.com/r/referral/${user.fullName.split(" ")[0]}`
        : `http://:4000/r/${user.fullName.split(" ")[0]}`;
    const newReferral = referralModel({
      link: newReferralLink,
      owner: req.session.access,
    });
    newReferral
      .save()
      .then((ref) => {
        user.referralUrl = newReferralLink;
        user
          .save()
          .then((r) => {
            const fullName = req.app.locals.username;
            res.render("client/referral", {
              layout: "client",
              title: "EnkryptFinance | Referral",
              referralLink: newReferralLink,
              fullName,
            });
          })
          .catch((err) => err);
      })
      .catch((err) => err);
  });
});

router.get("/referral", (req, res) => {
  userModel.findOne({ _id: req.session.access }).then((user) => {
    const newReferralLink =
      process.env.NODE_ENV === "production"
        ? `https://enkryptfinance${req.baseUrl}/r/${
            user.fullName.split(" ")[0]
          }`
        : `http://:4000${req.baseUrl}/r/${user.fullName.split(" ")[0]}`;
    const newReferral = referralModel({
      link: newReferralLink,
      owner: req.session.access,
    });
    newReferral
      .save()
      .then((ref) => {
        user.referralUrl = newReferralLink;
        user
          .save()
          .then((r) => {
            const fullName = req.app.locals.username;
            res.render("client/referral", {
              layout: "client",
              title: "EnkryptFinance | Referral",
              referralLink: newReferralLink,
              fullName,
            });
          })
          .catch((err) => err);
      })
      .catch((err) => err);
  });
});
router.get("/profile/edit/:_id", (req, res) => {
    const ID = req.params._id;

    userModel
        .findOne(
            { _id: ID },
        )
        .then(async (user) => {

            await axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
                const countryInfo = response.data;
                let country = [];
                for (let i = 0; i < countryInfo.length; i++) {
                    let item = countryInfo[i];
                    country.push({
                        name: item["name"],
                        code: item["callingCodes"][0],
                    });
                }
                res.render('client/editProfile',{
                    layout: "client",
                    title: "EnkryptFinance | Edit Profile",
                    country: country
                })
            })
                .catch(err=>{

                })

        })
        .catch((err) => {
            res.send(err);
        });
});
router.post("/profile/edit/:_id", (req, res) => {
  const ID = req.params._id;

  userModel
    .updateOne(
      { _id: ID },
      {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
      }
    )
    .then((user) => {
      res.redirect("/client/");
    })
    .catch((err) => {
      res.send(err);
    });
});
router.get("/referral", (req, res) => {
  userModel.findOne({ _id: req.session.access }).then((user) => {
    const newReferralLink = `http://4000${req.baseUrl}/r/${
      user.fullName.split(" ")[0]
    }`;
    const newReferral = referralModel({
      link: newReferralLink,
      owner: req.session.access,
    });
    newReferral
      .save()
      .then((ref) => {
        user.referralUrl = newReferralLink;
        user
          .save()
          .then((r) => {
            const fullName = req.app.locals.username;
            res.render("client/referral", {
              layout: "client",
              title: "EnkryptFinance | Referral",
              referralLink: newReferralLink,
              fullName,
            });
          })
          .catch((err) => err);
      })
      .catch((err) => err);
  });
});
router.post("/referral/em/", (req, res) => {
  const params = {
    senderName: "Tunda Miles",
    sender: "EnkryptFinance",
    client: req.body.email,
    text: `Hi ${req.body.email}, welcome enkryptFinance`,
    subject: `Welcome to enkryptFinance`,
    user: user.fullName,
    data: {
      header: `Hi ${req.body.email}! welcome enkryptFinance`,
      body: "You have been invited to join Enkrypt Finance",
      link: req.body.refLink,
    },
    req,
    res,
  };
  sendEmail(params);
});

///REFERRAL URL

router.get("/withdraw", (req, res) => {
  const fullName = req.app.locals.username;

    balanceModel
        .findOne({ owner: req.session.access })
        .then((bal) => {
            // console.log(transactions);
            // console.log(bal);
            const fullName = req.app.locals.username;
            res.render("client/withdraw", {
                layout: "client",
                title: "EnkryptFinance | wallet",
                fullName,
                btcBalance:bal.btcBalance
            });
        })
        .catch((err) => err);

});
router.post("/withdraw", (req, res) => {
    ///NewTransaction
    const fullName = req.app.locals.username;
    userModel.findById(req.session.access)
        .then(user=>{
            if (user.btcBalance<req.body.amount){
                req.flash('failure_message','error Loading Page');
                res.redirect('/client/withdraw')
            }
           else{
                const newWithdrawal = new transactionModel({
                    type: 'Withdrawal',
                    btcAddress: req.body.clientAddress,
                    amount: req.body.amount,
                    owner: req.session.access,
                });
                newWithdrawal.save()
                    .then(tr=>{
                        user.transactions.push(newWithdrawal);
                        user.save()
                            .then(e=>{
                                res.render('client/payProcessing',{layout: "client",
                                    title: "EnkryptFinance | Upgrade Plan",
                                    fullName,})
                            })
                            .catch(err=>{
                                req.flash('failure_message','transaction not successfull')
                                res.render('client/withdraw')})

                    }).catch(err=>{
                    req.flash('failure_message','transaction not successfull')
                    res.render('client/withdraw')
                })
            }
        })
        .catch(err=>req.flash('failure_message','error Loading Page'))

});
router.get("/upgrade", (req, res) => {
  const fullName = req.app.locals.username;
  const userId = req.session.access;
  userModel.findById(userId)
      .then(user=>{
          planModel
              .find({})
              .lean()
              .then((plan) => {
                   planModel.findById(user.plan)
                       .then(currentPlan=>{
                           res.render("client/upgrade", {
                               layout: "client",
                               title: "EnkryptFinance | Upgrade Plan",
                               fullName,
                               plan,
                               userId,
                               currentPlan
                           });
                       }).catch(err=>{
                       res.status(500).send(err);
                   })
              }).catch(err=>{
                  res.status(500).send(err);
          })
      })
      .catch(err=>{

      })
});


router.post('/upgrade/verify/:id',(req,res)=>{
    const fullName = req.app.locals.username;
    const id = req.params.id;
    const body = req.body;
    //Find the current plan subtract the amount required to pay and then send it
    userModel.findById(id)
        .populate({path:'balance',model:'balances'})
        .then(user=>{
            let _bal  = Number(user.balance.currentInvestment);
            planModel.findById(body.plan)
                .then(pl=>{
                    ///compare the plans
                    let amount_toPay  = 0;
                    const _pl = Number(pl.cost.split("-")[0]);
                    if (_pl>_bal) amount_toPay = _pl - _bal;


                    qr.toDataURL(
                        "1LQNJA8pAYaaiFhgNvSREXmUkdPWeNSqQV",
                        (err, data) => {
                            if (err) throw err;
                            res.render("client/upgradePay", {
                                layout: "client",
                                title: "EnkryptFinance | Upgrade Pay",
                                fullName,
                                data,
                                amount_toPay,
                                hash_plan:pl.title,
                                hash_code:pl._id,
                                id,
                                walletAddress: "1LQNJA8pAYaaiFhgNvSREXmUkdPWeNSqQV",
                            });
                        }
                    );
                })
        })


})



///use a form to

router.post("/upgrade/:id", (req, res) => {
  const _status = 'pending';
  const body = req.body;
    console.log(req.body.hash)


        let newUpgrade = new transactionModel({
            status:_status,
            hash_plan: req.body.plan,
            btcAddress: req.body.btcAddress,
            amount: req.body.amount,
            hash:req.body.hash,
            type:'upgrade',
            owner:req.params.id
        });

        newUpgrade.save()
            .then((upgrade)=>{
                userModel.findById(req.params.id)
                    .then(user=>{
                        user.transactions.push(upgrade._id);
                        user.save()
                            .then(()=>{
                                req.flash('success_message',"Upgrade pending");
                                res.redirect('/client');
                            })
                            .catch(()=>{
                                req.flash('failure_message',"Upgrade unsuccessful ");
                                res.redirect('/client');
                            })
                    })

            })
            .catch((err)=>{
                req.flash('failure_message',err.toString());
                res.redirect('/client');
            })



});




router.get("/editPassword", (req, res) => {
  const fullName = req.app.locals.username;
  userModel.findById(req.session.access)
      .lean()
      .then((user)=>{
          res.render("client/editPassword", {
              layout: "client",
              title: "EnkryptFinance | Upgrade Plan",
              fullName,
              user
          });
      })
      .catch(err=>console.log(err))
});
router.post("/editPassword/:id", (req, res) => {
    let newPassword = req.body.newPassword;
  userModel.findById(req.params.id)
      .then(async (user)=>{
          if (newPassword!==''){

              const salt = await bcrypt.genSalt(12);
              const newPass = await bcrypt.hash(newPassword, salt);
             user.password = newPass;
             user.save()
                 .then((user)=>{
                     res.redirect('/client/profile')
                 }).catch(err=>req.flash('failure_message','error changing password'))

          }
          res.redirect('/client/profile')
      })
      .catch(err=>{
          console.log(err)
      })
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

module.exports = router;
