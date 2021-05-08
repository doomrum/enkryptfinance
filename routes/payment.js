const axios = require('axios');
const transactionModel  = require('../models/transaction');
const userModel  = require('../models/user');
const express = require('express');
const Router = express.Router();

const apiKey = process.env.API_KEY;
const blockonomicsConfig ={
    apiKey,
    hostUrl: 'https://www.blockonomics.co',
    newAddressApi:'/api/new_address',
    priceApi: '/api/price?currency='
}

Router.post('/',async (req,res,next)=> {

   const newTransaction =  transactionModel({type:req.body.investmentType,btcAddress: req.body.btcAddress, amount:req.body.amount, owner:req.session.access});
    newTransaction.save()
        .then(t=>{
            userModel.findOne({_id:req.session.access})
                .then(user=>{
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
                    user.save()
                        .then(e=>{
                            console.log(e);
                            res.redirect('/client/invest');
                        }).catch(err=> {
                        res.send(err)
                    })
                })
                .catch(err=> {
                    res.send(err)
                })

        })
        .catch(err=>{
            res.send(err)
        })







    }
);

Router.post('/receive/:id',(req,res)=>{
    transactionModel.findById(req.params.id)
        .then()
})

module.exports = Router;


