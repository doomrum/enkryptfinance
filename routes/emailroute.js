const router = require("express").Router();
// const nodemailer = require('../helpers/nodemailer');

router.get("/test", async (req, res, next) => {
  // await nodemailer();
  res.send("done");
});

module.exports = router;
