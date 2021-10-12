const Router = require('express').Router();
const postModel = require('../models/Post');
const {isEmpty} = require('../helpers/post-validator');
const fs = require('fs');


Router.all('/p',(req,res,next)=>{
    req.app.locals.layout = 'admin'
    next();
})
//GET ALL USER POSTS ROUTE
Router.get('/p', async (req,res)=>{
    if(req.session.access){

        postModel.find({})
            .lean()
            .populate('category')
            .then(posts=>{

                res.render('posts/posts-table',{
                    posts,
                    layout:'admin',
                    title: 'Enkrypt Finance | Create Post'

                })
            })
            .catch(err=>res.status(401).send(err))
    }
    else {
        res.status(500).send('<h1> Sorry Error </h1>')
    }
});

///GET post

Router.get('/p/create', (req,res)=>{

           res.render('posts/create-post',{layout:'admin'})

});
//CREATE POST
Router.post('/p/post/c',async (req,res)=>{
    //file
    console.log(req.body);
//paragraghs


  if(isEmpty(req.files)){
        const files = req.files;
        const fileName = Date.now() + "_" + files.file.name;

        files.file.mv('./public/uploads/' + fileName,(err)=>err);
      let p = req.body.description.split('\r\n');


      let newPost = postModel({
          title:req.body.title,
          subtitle: req.body.subtitle,
          description: p,
          file:fileName,
          author:req.body.author
      });
      console.log(newPost)
      await newPost.save()
          .then((post)=>{
              console.log(post)
              res.redirect('/admin/post/p')
          })
          .catch(err=>res.send(err))
    }
  else{
      res.status(401).send('error in form')
  }

    ///create new post instance

});

///EDIT POST
Router.get('/p/posts/edit/:id',(req,res)=>{
    PostModel.findOne({_id:req.params.id})
        .lean()
        .then(
            post=> {
                // console.log(post);
                Category.find({})
                    .lean()
                    .then(categories=>{
                        res.render('admin/posts/edit-post',{
                            layout:'admin',
                            post,
                            categories
                        })
                    })
                    .catch(err=>err);

            }
        )
        .catch(err=>err)
});


Router.put('/p/posts/edit/:id' ,async (req,res)=>{
    const files = req.files;
    let fileName;


    const item = await PostModel.findOne({_id:req.params.id});
    if(isEmpty(files)){
        fileName = Date.now() + "_" + files.file.name;
    }
    else{
        fileName = item.file;
    }
    const post = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        file: fileName,
        category: req.body.category
    }


    PostModel.updateOne({_id:req.params.id},post)
        .then(post=>{
            console.log(post);
            if (isEmpty(files)){
                files.file.mv('./public/uploads/posts/' + fileName,(err)=>err);
                fs.unlink(`./public/uploads/posts/${item.file}`,(err)=>{
                    if(err) return err;
                    console.log(`updated image`)
                })
                res.redirect('/admin/p');
            }
            res.redirect('/admin/p');
        })
        .catch(err=>err)
});
///delete post
Router.delete('/p/posts/edit/:id' , async (req,res)=>{
    const item = await PostModel.findOne({_id:req.params.id});
    PostModel.deleteOne({_id: req.params.id})
        .then((post)=>{
            fs.unlink(`./public/uploads/posts/${item.file}`,(err)=>{
                if(err) return err;
                console.log(`deleted image`)
            })
            res.redirect('/admin/p')})
        .catch(err=>err)
});



module.exports = Router;