const express = require('express')
const router = express.Router()
const indexController = require("./contorllers/indexController")
const loginController = require("./contorllers/loginController")

router.get("/callback", loginController.login)
router.get("/", indexController.home)

module.exports = router