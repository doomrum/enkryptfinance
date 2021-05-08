const router = require('express').Router();
const UserModel = require('../models/user');
const PlanModel = require('../models/plan');
//
// router.all('/',(req,res,next)=>{
//     ///
//     next();
// })

router.get('/',async (req,res)=>{
   await UserModel.find({})
       .lean()
        .then(users=>{
            // const usersInfo = users;
            // console.log(users);

            PlanModel.find({})
                .lean()
                .then(plans=>{
                    // const plans = plan.toJSON();
                    res.render('admin/index',{layout: 'admin', title:'EnkryptFinance | Admin',users, plans});
                })
                .catch(err=>{
                    res.status(403).send(err);
                })

        })
        .catch(err=> {
            console.log(err)
           res.status(400).send(err) ;
        })


});


router.get('/chat',(req,res,next)=>{
    res.render('admin/chat',{layout: 'admin', title:'EnkryptFinance | Chat'});
});
router.get('/edit', async (req,res,next)=>{
   await PlanModel.find({})
       .lean()
       .then(plan=>{
           // const plans = plan.toJSON();
           res.render('admin/plans',{layout: 'admin', title:'EnkryptFinance | plan',plan});
       })
       .catch(err=>{
           res.status(403).send(err);
       })

});
router.get('/createPlan',(req,res,next)=>{
    res.render('admin/createPlan',{layout: 'admin', title:'EnkryptFinance |  Create plan'});
});
router.post('/createPlan',(req,res,next)=>{
    console.log(req.body);
    const newPlan = PlanModel({
        title: req.body.title,
        duration:req.body.duration,
        description:req.body.description,
        cost: req.body.cost,
        profit:req.body.profit
    });

    newPlan.save()
        .then(plan=>{
            res.redirect('/admin/edit');
        })
        .catch(err=>{
            res.status(403).send(err);
        })

});

router.get('/editPlan/:id', async (req,res,next)=>{
  await PlanModel.findOne({_id:req.params.id})
                 .lean()
                 .then(plan=>{
                     // console.log(plan)
                       res.render('admin/editPlans',{layout: 'admin', title:'EnkryptFinance |  Edit plan',plan});
                 })
      .catch(err=>{
          res.status(403).send(err)
      })
});

router.post('/editPlan/:id', async (req,res,next)=>{
  await PlanModel.findOne({_id:req.params.id})
                 .then(plan=>{
                     console.log(plan)

                       plan.title = req.body.title;
                       plan.duration = req.body.duration;
                       plan.cost = req.body.cost;
                       plan.profit = req.body.profit;
                       plan.description = req.body.description;

                       plan.save()
                           .then(result=>{
                               console.log(result);
                               res.redirect('/admin/edit');
                           })
                           .catch(err=>{
                               res.status(403).send(err)
                           })

                 })
      .catch(err=>{
          res.status(403).send(err)
      });
});
router.get('/deletePlan/:id',async (req,res,next)=>{
    await PlanModel.remove({_id:req.params.id})
        .then(plan=>{
            res.redirect('/admin/edit')
        })
        .catch(err=>{
            res.status(403).send(err)
        })
});
router.get('/users',async (req,res,next)=>{
    await UserModel.find({})
        .lean()
        .then(users=>{
            // const usersInfo = users;
            console.log(users);
            res.render('admin/users',{layout: 'admin', title:'EnkryptFinance | Users', users});
        })
        .catch(err=> {
            console.log(err)
            res.status(400).send(err) ;
        })

});


module.exports = router;