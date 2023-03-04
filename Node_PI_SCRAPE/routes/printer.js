const express = require("express");
const router = express.Router();
const path = require("path");

const lex = require("../src/Lexmark-M5255");

router.get("/", (req, res, next) => {
  console.log(
    "\x1b[33m",
    "\n" +
      date.getDate() +
      "/" +
      date.getMonth() +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds()
  );
  console.log("Request: Printer Index");
  res.sendFile(path.join(__dirname, "..", "views/printer", "index.html"));
  console.log("\x1b[32m", "Index Sent");
});

router.get("/hostname/:hostname/model/M5255", async (req, res, next) => {
  var date = new Date();
  console.log(
    "\x1b[33m",
    "\n" +
      date.getDate() +
      "/" +
      date.getMonth() +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds()
  );
  console.log(
    "\x1b[33m",
    "Request: HOSTNAME: " + req.params.hostname + "| MODEL:M5255"
  );
  var dbJSON = await lex.scrapeLexmark({
    HOSTNAME: req.params.hostname,
    MODEL: "M5255",
  });
  res.send(dbJSON);
});

module.exports = router;
