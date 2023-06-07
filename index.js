const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const {dataDieuXe} = require('./dieuxe.js');
const {xulyDataDieuXe} = require('./help/functions.js');
require('dotenv').config();

var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync("db.json");
var db = low(adapter);
db.defaults({
  users: [],
}).write();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.render("index", { title: "Hey", message: "Hello there!" });
});


app.get('/dieuxe', (req, res)=>{
    let thongTinDieuXe = xulyDataDieuXe(dataDieuXe);
    res.render('dieuxe/index', {
      data : thongTinDieuXe
    })
    // res.json(thongTinDieuXe)
})


app.get("/users", (req, res) => {
  res.render("users/index", {
    users: db.get("users").value(),
  });
});
app.get("/users/create", (req, res) => {
  res.render("users/create");
});
app.post("/users/create", (req, res) => {
  users.push(req.body);
  res.redirect("/users");
});
app.get("/users/search", (req, res) => {
  const q = req.query.q;
  const matchedUsers = users.filter(user => {
    return user.name.toLowerCase().indexOf(q) !== -1;
  });
  res.render("users/index", {
    users: matchedUsers,
  });
});
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});