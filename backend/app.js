const express = require("express");
const cors = require("cors");

const vacationController=require("./controllers-layer/vacations-controller");
const usersController=require("./controllers-layer/users-controller");

const server = express();
server.use(cors());
server.use(express.json());

server.use("/vacations", vacationController);
server.use("/users", usersController);

server.use("*", (req, res) => {
    res.status(404).send(`Route not found ${req.originalUrl}`);
});

server.listen(4000, () => {
    console.log("Listening on 4000");
});