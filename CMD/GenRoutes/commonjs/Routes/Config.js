const router = require("express").Router();

const Config = require("./../Controller/Scheme/Config/init");

router.post("/", Config);

module.exports = router;
