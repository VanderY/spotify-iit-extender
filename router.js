const express = require('express')
const router = express.Router()
const indexController = require("./contorllers/indexController")
const loginController = require("./contorllers/loginController")
const toptracks = require("./contorllers/toptracks");

router.get("/callback", loginController.login)
router.get("/", indexController.home)
router.get("/top-tracks", toptracks.toptracks)

module.exports = router