var express = require("express");
var router = express.Router();

var renderer = require("../modules/renderer.js");

router.get('/', function (req, res, next) {
    renderer.renderTemplate("home", res);
});

router.get('/:view', function (req, res, next) {
    renderer.renderTemplate(req.params.view, res);
});

module.exports = router;