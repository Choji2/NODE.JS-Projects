const http = require("http");
const path = require("path");
const express = require("express");
const bodyParse = require("body-parser");
var date = new Date();

const app = express();
const printerRoutes = require("../routes/printer");

app.use(bodyParse.urlencoded({ extended: false }));
app.use("/printer", printerRoutes);

app.use("/", (req, res, next) => {
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
  console.log("\x1b[31m", "Bad Request: 404");
  res.status(404).sendFile(path.join(__dirname, "..", "views", "404.html"));
});

app.listen(3000);
console.log("NODE.JS| AAP Printer API server listining on port 3000...");
