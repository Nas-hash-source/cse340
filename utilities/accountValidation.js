const accountModel = require("../models/accountModel")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("Enter a valid email")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (!emailExists){
        throw new Error("Email doesn't have an account, Please sign up instead")
      }
    })
    ,

    // password is required and must be strong password
    body("account_password")
      .notEmpty()
      .withMessage("Please enter your password")
      
  ]
}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists.rowCount){
          throw new Error("Email already exists. Please log in or use different email")
        }
      })
      ,
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


/*  **********************************
 *  Update Detail Validation Rules
 * ********************************* */
validate.updateDetailRules = () => {
  return [
    body("account_id")
      .isInt()
      .withMessage("Provide a valid id"),

    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      const email = emailExists.rows[0].account_email
      if ( email && email!==account_email){
        throw new Error("Email exists. Please log in or use different email")
      }
    })
  ]
}


/*  **********************************
 *  Update password Validation Rules
 * ********************************* */
validate.updatePasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements.")
  ]
}


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

validate.checkLoginData = async (req, res, next) => {
    const {account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
}

  

  /* ******************************
 * Check update details
 * ***************************** */
validate.checkUpdateDetails = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const fullName = account_firstname + " " + account_lastname
    res.render("account/editAccount", {
      title: "Edit " + fullName + "'s account",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })

    return
  }
  next()
}

/* ******************************
 Check update password
 ***************************** */
validate.checkUpdatePassword = async (req, res, next) => {
  const { account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData

    const fullName = accountData.account_firstname + " " + accountData.account_lastname
    res.render("account/editAccount", {
      title: "Edit" + fullName + "'s account",
      nav,
      errors,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account.account_lastname,
      account_email: accountData.account_email,
      account_id
    })

    return
  }
  next()
}
  
module.exports = validate