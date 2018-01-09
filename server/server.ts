import express = require("express");
import http = require("http");
import path = require("path");
//import morgan = require("morgan");
import fs = require("fs");

var app = express();
app.set("port", process.env.PORT || 3000);
//app.use(morgan("dev"));

// Static routes
app.use("/scripts", express.static(path.join(__dirname, "./node_modules")));
app.use("/app", express.static(path.join(__dirname, "build", "app")));
app.use("/css", express.static(path.join(__dirname, "docs", "css")));
app.use("/js", express.static(path.join(__dirname, "docs", "js")));
app.use("/mesh", express.static(path.join(__dirname, "docs", "mesh")));
app.use("/load-engine.js", express.static(path.join(__dirname, "docs", /*"js",*/ "load-engine.js")));
//app.use("/game-engine", express.static(path.join(__dirname, "build", "game-engine")));
app.use("/engine-bundle.js", express.static(path.join(__dirname, "docs", "engine-bundle.js")));

app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "docs", "html", "./index.html"));
});

var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Example app is listening on port ' + app.get('port'));
});