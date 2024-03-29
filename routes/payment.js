const axios = require("axios");
const transactionModel = require("../models/transaction");
const userModel = require("../models/user");
const express = require("express");
const Router = express.Router();
const qr = require("qrcode");
const apiKey = process.env.API_KEY;
const blockonomicsConfig = {
  apiKey,
  hostUrl: "https://www.blockonomics.co",
  newAddressApi: "/api/new_address",
  priceApi: "/api/price?currency=",
};

Router.post("/", async (req, res, next) => {
  const newTransaction = transactionModel({
    type: req.body.investmentType,
    btcAddress: req.body.btcAddress,
    amount: req.body.amount,
    owner: req.session.access,
  });
  newTransaction
    .save()
    .then((t) => {
      userModel
        .findOne({ _id: req.session.access })
        .then((user) => {
          console.log(user);

          // axios.post(blockonomicsConfig.hostUrl+blockonomicsConfig.newAddressApi,{
          //     headers:{
          //         'Authorization': 'Bearer ' + apiKey,
          //         'Content-Type': 'application/json'
          //     }})
          //     .then((result)=>{
          //         console.log(result.data);
          //     })
          //     .catch(err=>{
          //         res.send(err)
          //     })

          user.transactions.push(newTransaction);
          user
            .save()
            .then((e) => {
              console.log(e);
              res.redirect("/client/invest");
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

Router.post("/receive/:id", (req, res) => {
  transactionModel.findById(req.params.id).then();
});
Router.post("/pay", (req, res) => {
  const fullName = req.app.locals.username;

  ///add btcaddress when payment gateway is added
  const newTransaction = transactionModel({
    type: req.body.investmentType,
    btcAddress: "bc1q67z2jfac9e4jkyxrkrk2klpsumwd037kyf5k90",
    amount: req.body.amount,
    owner: req.session.access,
  });
  newTransaction
    .save()
    .then((t) => {
      userModel
        .findOne({ _id: req.session.access })
        .then((user) => {
          user.transactions.push(newTransaction);
          user
            .save()
            .then((e) => {
              qr.toDataURL(
                "bc1q67z2jfac9e4jkyxrkrk2klpsumwd037kyf5k90",
                (err, data) => {
                  if (err) throw err;
                  res.render("client/invest", {
                    layout: "client",
                    title: "EnkryptFinance | Invest",
                    fullName,
                    data,
                    walletAddress: "bc1q67z2jfac9e4jkyxrkrk2klpsumwd037kyf5k90",
                  });
                }
              );
            })
            .catch((err) => {
              res.send(err);
            });
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

Router.get('/cardPayment',(req,res)=>{

})

module.exports = Router;
