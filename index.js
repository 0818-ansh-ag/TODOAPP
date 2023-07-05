const express = require("express");
const port = 7000;

const db = require("./config/mongoose");
const Todolist = require("./models/todo");
const nodemailer = require("nodemailer");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded());
app.use(express.static("assets"));

//new Date(year, month, day, hours, minutes, seconds, milliseconds)

var taskList = [
  {
    uniqueid: 123,
    taskname: "complete CN worksheet",
    //endtime: new Date(2022, 8, 28)
  },
];
app.get("/", function (req, res) {
  Todolist.find({}, function (err, taskList) {
    if (err) {
      console.log("error in fetching tasks from db");
      return;
    }

    res.render("home", {
      title: "mytodoapp",
      todolist: taskList,
    });
  });
});

app.post("/addtask", async (req, res) => {
  try {
    let id = await Todolist.findOne({ uniqueid: req.body.unique });
    if (id) {
      return res.redirect("back");
    }

    await Todolist.create(
      {
        uniqueid: req.body.unique,
        taskname: req.body.newtask,
      },
      function (err, placetask) {
        if (err) {
          console.log("error in creating task");
          console.log(uniqueid);
          console.log(taskname);
          return;
        }

        console.log("**********", placetask);
        return res.redirect("back");
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

app.get("/sendemail", function (req, res) {
  res.render("mail.ejs");
});
app.get("/home", function (req, res) {
  res.render("home.ejs");
});

app.post("/details", function (req, res) {
  console.log(req.body);
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: req.body.email,
      pass: req.body.password,
    },
  });
  //hahohcsseqqigdqh
  let mailDetails = {
    from: req.body.email,
    to: req.body.email2,
    subject: req.body.subject,
    text: req.body.reinder,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs");
    } else {
      console.log("Email sent successfully");
    }
  });
  res.send("SuccessZFully send the email");
});

//running the server
app.listen(port, function (err) {
  if (err) {
    console.log("Error in running the server", err);
  }
  console.log("Yup Express server is running on port:", port);
});

app.get("/delete-task", function (req, res) {
  console.log(req.query);
  let id = req.query.id;

  /*let taskindex = taskList.findIndex(task => task.taskname == taskname);
    if(taskindex != -1){
        taskList.splice(taskindex, 1);
    }*/
  Todolist.findByIdAndDelete(id, function (err) {
    if (err) {
      console.log("error in creatin the databse");
      return;
    }
    return res.redirect("back");
  });
});
