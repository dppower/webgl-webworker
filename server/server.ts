import express = require("express");
import http = require("http");
import path = require("path");
//import morgan = require("morgan");
import fs = require("fs");

var app = express();

//app.use(morgan("dev"));
app.use("/scripts", express.static(path.join(__dirname, "./node_modules")));
app.use("/app", express.static(path.join(__dirname, "build", "app")));
app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use("/js", express.static(path.join(__dirname, "public", "js")));
app.use("/load-engine.js", express.static(path.join(__dirname, "public", "js", "load-engine.js")));
app.use("/game-engine", express.static(path.join(__dirname, "build", "game-engine")));

app.set("port", process.env.PORT || 3000);

app.get("/mesh/:fileName", (req, res) => {
    let fileName = req.params.fileName;
    let filePath = "./public/mesh/" + fileName + ".json";
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) throw err;
        var obj = JSON.parse(data);
        res.json(obj);
    });
});

app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "public", "html", "./index.html"));
});

var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Example app is listening on port ' + app.get('port'));
});