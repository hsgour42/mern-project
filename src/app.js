require("dotenv").config();
const express = require("express");
const { set } = require("mongoose");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("./db/conn");
const Register = require("./models/registers");

const app = express();
const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const templete_path = path.join(__dirname, "../templetes/views");
const partials_path = path.join(__dirname, "../templetes/partials");

app.use(express.json());
//for reading form data
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templete_path);
hbs.registerPartials(partials_path);

app.get("/", async (req, res) => {
  try {
    res.status(200).render("index");
  } catch (error) {
    res.status(500).send();
  }
});

app.get("/register", async (req, res) => {
  try {
    res.status(200).render("register");
  } catch (error) {
    res.status(500).send();
  }
});

app.post("/register", async (req, res) => {
  try {
    //const registerData = await Register.save()
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password == cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        gender: req.body.gender,
        password: password,
        confirmpassword: cpassword,
      });

      //this is concept of middleware
      console.log("the success part" + registerEmployee);
      const token = await registerEmployee.generateAuthToken();
      const registeredData = await registerEmployee.save();
      res.status(201).render("home");
    } else {
      res.send("password not matched");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/login", async (req, res) => {
  try {
    res.status(200).render("login");
  } catch (error) {
    res.status(500).send();
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await Register.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, useremail.password);
    const token = await useremail.generateAuthToken();
    console.log(token);
    if (isMatch) {
      res.status(201).render("home");
    } else {
      res.send("invalid password details");
    }
  } catch (error) {
    res.status(400).send("invalid login details");
  }
});

app.get("/home", async (req, res) => {
  try {
    res.status(200).render("home");
  } catch (error) {
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`running port ${port}`);
});
