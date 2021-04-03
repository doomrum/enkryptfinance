const axios = require('axios');

const express = require('express');
const Router = express.Router();

const apiKey = process.env.API_KEY;
const options ={
    headers:{
        'Authorization':`Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    }
};
Router.get('/',async (req,res,next)=>{

 axios.post(`https://blockonomics.co/api/new_address`,{headers: options.headers})
        .then(result=>res.render('index',{title:'hello'}))
        .catch(err=>res.render('index',{title:err}))

});

module.exports = Router;

