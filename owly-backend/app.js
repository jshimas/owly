const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controllers/errorController");
const userRoutes = require("./routes/userRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const invitationRoutes = require("./routes/invitationRoutes");

require("dotenv").config();
const { sequelize } = require("./models");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/meetings", meetingRoutes);
app.use("/api/v1/invitations", invitationRoutes);
// app.use("/api/v1/school", schoolRouter);

app.all("*", (req, res, next) => {
  return res
    .status(404)
    .json({ error: `Can not find ${req.originalUrl} on this server` });
});

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 8080;

app.listen(port, host, async () => {
  console.log(`App running at http://${host}:${port}/`);
  await sequelize.authenticate();
  // await sequelize.sync({ alter: true });
  console.log("Database connected!");
});

app.use(globalErrorHandler);

// START SERVER
module.exports = app;
