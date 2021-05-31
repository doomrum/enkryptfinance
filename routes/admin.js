const router = require("express").Router();
const UserModel = require("../models/user");
const PlanModel = require("../models/plan");
const balanceModel = require("../models/balance");
const transactionModel = require("../models/transaction");

//
router.all("/*", (req, res, next) => {
  if (req.session.accessType !== "admin") {
    res.redirect("/client");
  } else {
    next();
  }
});

router.get("/", async (req, res) => {
  await UserModel.find({})
    .lean()
    .populate({ path: "balance", model: "balances" })
    .then((users) => {
      // const usersInfo = users;
      // console.log(users);

      PlanModel.find({})
        .lean()
        .then((plans) => {
          // const plans = plan.toJSON();
          res.render("admin/index", {
            layout: "admin",
            title: "EnkryptFinance | Admin",
            users,
            plans,
          });
        })
        .catch((err) => {
          res.status(403).send(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.get("/chat", (req, res, next) => {
  res.render("admin/chat", { layout: "admin", title: "EnkryptFinance | Chat" });
});
router.get("/edit", async (req, res, next) => {
  await PlanModel.find({})
    .lean()
    .then((plan) => {
      // const plans = plan.toJSON();
      res.render("admin/plans", {
        layout: "admin",
        title: "EnkryptFinance | plan",
        plan,
      });
    })
    .catch((err) => {
      res.status(403).send(err);
    });
});

router.get("/createPlan", (req, res, next) => {
  res.render("admin/createPlan", {
    layout: "admin",
    title: "EnkryptFinance |  Create plan",
  });
});

router.post("/createPlan", (req, res, next) => {
  console.log(req.body);
  const newPlan = PlanModel({
    title: req.body.title,
    duration: req.body.duration,
    description: req.body.description,
    cost: req.body.cost,
    profit: req.body.profit,
  });

  newPlan
    .save()
    .then((plan) => {
      res.redirect("/admin/edit");
    })
    .catch((err) => {
      res.status(403).send(err);
    });
});

router.get("/editPlan/:id", async (req, res, next) => {
  await PlanModel.findOne({ _id: req.params.id })
    .lean()
    .then((plan) => {
      // console.log(plan)
      res.render("admin/editPlans", {
        layout: "admin",
        title: "EnkryptFinance |  Edit plan",
        plan,
      });
    })
    .catch((err) => {
      res.status(403).send(err);
    });
});
router.get("/transactions", (req, res, next) => {
  transactionModel
    .find()
    .lean()
    .populate({ path: "owner", model: "users" })
    .then((transactions) => {
      res.render("admin/transactions", {
        layout: "admin",
        title: "EnkryptFinance | Edit user",
        transactions,
      });
    })
    .catch((err) => err);
});

router.get("/transactions/edit/:id", (req, res, next) => {
  transactionModel
    .findById(req.params.id)
    .lean()
    .populate({ path: "owner", model: "users" })
    .then((transaction) => {
      res.render("admin/editTransaction", {
        layout: "admin",
        title: "EnkryptFinance | Edit user",
        transaction,
      });
    })
    .catch((err) => err);
});

router.post("/transactions/edit/:id", (req, res, next) => {
  transactionModel
    .findById(req.params.id)
    .then((transaction) => {
      transaction.status = req.body.status;
      transaction.save().then((tr) => {
        res.redirect("/admin/transactions");
      });
    })
    .catch((err) => res.status(403).send(err));
});

router.get("/users/edit/:id", async (req, res) => {
  UserModel.findById(req.params.id)
    .lean()
    .populate({ path: "balance", model: "balances" })
    .then((user) => {
      res.render("admin/editUsers", {
        layout: "admin",
        title: "EnkryptFinance | Edit user",
        user,
      });
    })
    .catch((err) => res.status(403).send(err));
});

router.post("/users/edit/:id", async (req, res) => {
  balanceModel
    .findById(req.body.balanceId)
    .then((b) => {
      console.log(b);
      b.currentReturns = req.body.currentReturns;
      b.btcBalance = req.body.btcBalance;
      b.currentInvestment = req.body.currentInvestment;
      b.save()
        .then((result) => {
          console.log(result);
          res.redirect("/admin/users");
        })
        .catch((err) => res.status(403).send(err));
    })
    .catch((err) => res.status(403).send(err));
});

router.post("/editPlan/:id", async (req, res, next) => {
  await PlanModel.findOne({ _id: req.params.id })
    .then((plan) => {
      plan.title = req.body.title;
      plan.duration = req.body.duration;
      plan.cost = req.body.cost;
      plan.profit = req.body.profit;
      plan.description = req.body.description;

      plan
        .save()
        .then((result) => {
          res.redirect("/admin/edit");
        })
        .catch((err) => {
          res.status(403).send(err);
        });
    })
    .catch((err) => {
      res.status(403).send(err);
    });
});
router.get("/deletePlan/:id", async (req, res, next) => {
  await PlanModel.remove({ _id: req.params.id })
    .then((plan) => {
      res.redirect("/admin/edit");
    })
    .catch((err) => {
      res.status(403).send(err);
    });
});
router.get("/users", async (req, res, next) => {
  await UserModel.find({})
    .lean()
    .populate({ path: "balance", model: "balances" })
    .populate({ path: "plan", model: "plans" })
    .then((users) => {
      // const usersInfo = users;
      // console.log(users);
      res.render("admin/users", {
        layout: "admin",
        title: "EnkryptFinance | Users",
        users,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

module.exports = router;
