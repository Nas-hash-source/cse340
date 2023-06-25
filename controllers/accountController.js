const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")
const utilities = require("../utilities")
const accountModel = require("../models/accountModel");

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver account Management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  const accountDetails = await accountModel.getAccountById(
    res.locals.accountData.account_id
  )
  res.render("account/", {
    title: "Account Management",
    nav,
    errors: null,
    firstname: accountDetails.account_firstname,
    account_type: accountDetails.account_type
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res, next) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
     title: "Login",
     nav,
     errors: null,
     account_email,
    })
  }
  } catch (error) {
    return new Error('Access Forbidden')
  }
 } 

 /****Process logging out ****/
 async function processLogout(req, res, next) {
    res.clearCookie('jwt')
    delete res.locals.loggedin
    delete res.locals.accountData
    res.redirect('/')
 }

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildEditAccount(req, res, next) {
  const accountData = res.locals.accountData
  const accountDetails = await accountModel.getAccountById(
    accountData.account_id
  )
  let nav = await utilities.getNav()
  const fullName = accountDetails.account_firstname + " " + accountDetails.account_lastname
  res.render("account/editAccount", {
    title: "Edit " + fullName +  "'s account", 
    errors: null,
    nav,
    account_firstname: accountDetails.account_firstname,
    account_lastname: accountDetails.account_lastname,
    account_email: accountDetails.account_email,
    account_id: accountData.account_id
  })
}


/*update details*/
async function updateDetails(req, res, next) {
  let nav = await utilities.getNav()
  const { 
    account_id,
    account_firstname, 
    account_lastname, 
    account_email
  } = req.body

  const updateResult = await accountModel.updateDetails(
    account_id,
    account_firstname, 
    account_lastname, 
    account_email
  )

  if (updateResult) {
    req.flash(
      "success",
      `Your account was updated successfully.`
    )
    res.redirect("/account/")
  } else {
    const fullName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, we couldn't update your information.")
    res.status(501).render("account/editAccount", {
      title: "Edit" + fullName + " 's accçount",
      nav,
      errors: null,
      account_id,
      account_firstname, 
      account_lastname, 
      account_email
    })
  }
}


/*update password*/
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { 
    account_id,
    account_password
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    
  } catch (error) {
    const accountData = res.locals.accountData
    const fullName = `${accountData.account_firstname} ${accountData.account_lastname}`
    req.flash("notice", "Sorry, we couldn't update your password.")
    res.status(501).render("account/editAccount", {
      title: "Edit" + fullName + " 's account",
      nav,
      errors: null,
      account_id,
      account_firstname: accountData.account_firstname, 
      account_lastname: accountData.account_lastname, 
      account_email: accountData.account_email
    })
    return
  }

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )

  if (updateResult) {
    req.flash(
      "success",
      `Your password was updated successfully.`
    )
    res.redirect("/account/")
  } else {
      const accountData = res.locals.accountData
      const fullName = `${accountData.account_firstname} ${accountData.account_lastname}`
      req.flash("notice", "Sorry, we couldn't update your password.")
      res.status(501).render("account/editAccount", {
        title: "Edit" + fullName + " 's account",
        nav,
        errors: null,
        account_id,
        account_firstname: accountData.account_firstname, 
        account_lastname: accountData.account_lastname, 
        account_email: accountData.account_email
    })
  } 
}

 
module.exports = { 
  buildLogin, 
  buildRegister, 
  buildEditAccount, 
  buildAccountManagement,
  registerAccount, 
  accountLogin,
  updateDetails,
  updatePassword,
  processLogout
}