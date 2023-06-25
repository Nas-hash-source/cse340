const validation = require('../utilities/accountValidation')
const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const accountController = require('../controllers/accountController')

// Login and Registration
router.get('/login', utilities.handleErrors(accountController.buildLogin))
router.get('/registration', utilities.handleErrors(accountController.buildRegister))
router.post(
    '/register',
    validation.registationRules(),
    validation.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
router.post(
    "/login",
    validation.loginRules(),
    validation.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

router.get(
    '/logout',
    utilities.checkLogin,
    utilities.handleErrors(accountController.processLogout)
)

// account management and account edit
router.get('/', utilities.checkLogin, accountController.buildAccountManagement)
router.get('/edit/', utilities.checkLogin, accountController.buildEditAccount)

// update the account details excluding the password
router.post(
    '/updateDetails',
    utilities.checkLogin,
    validation.updateDetailRules(),
    validation.checkUpdateDetails,
    utilities.handleErrors(accountController.updateDetails)
)

// update the the password
router.post(
    '/updatePassword',
    utilities.checkLogin, 
    validation.updatePasswordRules(),
    validation.checkUpdatePassword,
    utilities.handleErrors(accountController.updatePassword)
)

module.exports = router