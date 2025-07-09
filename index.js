const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { checkForAuthenticationCookie } = require("./middlewares/auth");
const { checkTaskRole } = require("./middlewares/checkAcess");
require("./schedulers/taskRemainder");
const app = express();

const userRoute = require("./routes/user");
const taskRoute = require("./routes/task");
const subtaskRoute = require("./routes/subTask")
const notifcationRoutes = require("./routes/notification");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MongoDB_URI)
  .then((e) => console.log("MongoDB is connected"));

app.use(cookieParser());
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send("HEY, SERVER IS RUNNING PERFECTLY FINE");
});

app.use("/api/users", userRoute);
app.use(checkForAuthenticationCookie("token"));
app.use("/api/tasks", taskRoute);
app.use("/api/subtasks", subtaskRoute);
app.use("/api/notification", notifcationRoutes)

app.listen(PORT, () =>
  console.log(`Server is started on http://localhost:${PORT}`)
);
