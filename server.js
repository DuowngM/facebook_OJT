const express = require("express");
const server = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./src/routers");
//setup
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
server.use(morgan("dev"));
server.use(cors());
//Router
server.use("/", routes);

//PORT
server.listen(8000, "10.100.6.139", console.log("sever run port: " + 8000));
