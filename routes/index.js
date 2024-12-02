var express = require("express");
var router = express.Router();

/**
 * Required params:
 * 1. income
 * 2. age
 * 3. dependents
 */
router.get("/", function (req, res, next) {
    if (!req.query.income || !req.query.age || !req.query.dependents) {
        return res.status(400).json({
            message: "Missing required parameters",
            status: "error",
            data: null,
        });
    }

    // Perform prediction here

    res.json({
        message: "Prediction successful",
        status: "success",
        data: null,
    });
});

module.exports = router;
