const router = require("express").Router();

router.get("/referral/:name", (req, res) => {
  res.render("referral", {
    title: "Enkryptfinance | Referral",
    layout: "index",
  });
});

module.exports = router;
