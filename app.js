const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// error handler 404
app.use(function (req, res, next) {
    res.status(404).json({
        message: "Route tidak ditemukan",
        status: "error",
        data: null,
    });
});

// General error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        status: "error",
        data: null,
    });
});

module.exports = app;
