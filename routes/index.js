var express = require("express");
var router = express.Router();
const planModel = require("../models/plan");
const PostModel = require('../models/Post');
/* GET home page. */
router.get("/", async function (req, res, next) {
  planModel
    .find({})
    .lean()
    .then((plan) => {
      res.render("home", { title: "EnkryptFinance | Home", plan ,layout:'index'});
    })
    .catch((err) => {
      res.status(403).send(err);
    });
});

router.get("/about", async function (req, res, next) {
  res.render("about", { title: "EnkryptFinance | About", layout: "index" });
});
router.get("/terms", async function (req, res, next) {
  res.render("terms", { title: "EnkryptFinance |Terms", layout: "index" });
});

router.get("/faqs", async function (req, res, next) {
  res.render("faqs", { title: "EnkryptFinance | FAQs", layout: "index" });
});

router.get("/plans", async function (req, res, next) {
  planModel
    .find({})
    .lean()
    .then((plan) => {
      res.render("plans", {
        title: "EnkryptFinance | Plans",
        layout: "index",
        plan,
      });
    })
    .catch((err) => {
      res.status(403).send(err);
    });
});

router.get("/security", async function (req, res, next) {
  res.render("security", {
    title: "EnkryptFinance | Security",
    layout: "index",
  });
});


router.get("/testimonials", async function (req, res, next) {
  res.render("testimonials", {
    title: "EnkryptFinance | Testimonials",
    layout: "index",
  });
});

router.get("/contact", async function (req, res, next) {
  res.render("contactUs", {
    title: "EnkryptFinance | Contact Us",
    layout: "index",
  });
});

router.get("/offers", async function (req, res, next) {
  res.render("offers", { title: "EnkryptFinance | Offers", layout: "index" });
});

router.get("/gettingstarted", async function (req, res, next) {
  res.render("gettingStarted", {
    title: "EnkryptFinance | Getting Started",
    layout: "index",
  });
});

router.get('/blog/post/:id/:title',(req,res)=>{
    res.render('posts/post-article',{layout:'article'})
})
router.get('/gt/blog/post/:id/:title',(req,res)=>{
  console.log(req.params.id)
    PostModel.findOne({_id:req.params.id})
        // .populate({path:'comments',model:'comment'})
        .then(post=>{
          console.log(post);
          res.send(post)
        })
        .catch(err=>res.status(500).send('Internal Server Error'))
})


//get all posts and render
router.get('/blog/',(req,res)=>{

  res.render('posts/index',{layout:'article'})
})
router.get('/getAllPosts/',(req,res)=>{
  PostModel.find({})
      .then(
          posts=> {
           res.send(posts);
          })
      .catch(e=>e)
})

module.exports = router;

