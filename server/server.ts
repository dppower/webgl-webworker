import express = require("express");
import http = require("http");
import path = require("path");
import morgan = require("morgan");
import fs = require("fs");

var app = express();

app.use(morgan("dev"));
app.use("/scripts", express.static(path.join(__dirname, "../node_modules")));
app.use("/app", express.static(path.join(__dirname, "app")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/game-engine", express.static(path.join(__dirname, "game-engine")));

app.set("port", process.env.PORT || 3000);

app.get("/mesh/:fileName", (req, res) => {
    var fileName = req.params.fileName;
    fs.readFile("./assets/mesh/" + fileName, "utf-8", (err, data) => {
        if (err) throw err;
        var obj = JSON.parse(data);
        res.json(obj);
    });
});

app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "./index.html"));
});

var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Example app is listening on port ' + app.get('port'));
});