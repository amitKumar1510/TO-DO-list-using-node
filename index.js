const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ToDoList");
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

const taskSchema = {
  name: {
    type: String,
    required: true
  }
};

const Task = mongoose.model("Task", taskSchema);

app.set("view engine", "ejs");

app.get("/", async function (req, res) {
  let today = new Date();
  let options = { weekday: "long", day: "numeric", month: "long" };
  let day = today.toLocaleDateString("en-US", options);

  try {
    const foundTasks = await Task.find({});
    res.render("TO_DO_UI", { today: day, tasks: foundTasks });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching tasks.");
  }
});

app.post("/", async function (req, res) {
  const taskName = req.body.newTask;
  if (taskName) {
    const task = new Task({
      name: taskName
    });
    await task.save();
  }
  res.redirect("/");
});

app.post("/delete", async function (req, res) {
  const checkedItemId = req.body.checkbox;
  try {
    await Task.findByIdAndDelete(checkedItemId);
    console.log("Successfully deleted checked item.");
  } catch (err) {
    console.log("Error deleting item:", err);
  }
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server running at port 3000");
});
