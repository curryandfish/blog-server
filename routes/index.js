var express = require("express");
var router = express.Router();
router.use(require("./file.js"));
router.use(require("./login.js"));
router.use(require("./tag.js"));
router.use(require("./category.js"));
router.use(require("./user.js"))
router.use(require("./article.js"));
router.use(require("./link.js"));
module.exports = router;
