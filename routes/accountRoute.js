const validation = require('../utilities/accountValidation')
const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const accountController = require('../controllers/accountController')

router.get('/login', utilities.handleErrors(accountController.buildLogin))
router.get('/registration', utilities.handleErrors(accountController.buildRegister))

router.post(
    '/register',
    validation.registationRules(),
    validation.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    validation.loginRules(),
    validation.checkLoginData,
    (req, res) => {
      res.status(200).send('login process')
    }
)

module.exports = router