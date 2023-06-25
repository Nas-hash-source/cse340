/* ***********************
 * Require Statements
 *************************/
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const session = require("express-session")
const pool = require('./database/')
const baseController = require("./controllers/baseController.js")
const errorController = require("./controllers/errorController.js")
const utilities = require("./utilities/")

const express = require("express")
const expressLayouts = require("express-ejs-layouts")

const dotenv = require("dotenv")

dotenv.config()

const app = express()


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(cookieParser())

app.use(utilities.checkJWTToken)

/**override render function **/
// Override the res.render() function with the custom implementation
app.use(utilities.overrideRenderFunction)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts)
app.set("layout", "./layouts/layout"); // not at views root         

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"));

// Intentional error route
app.get("/trigger-error", utilities.handleErrors(errorController.throwInternalError));

// Account routes
app.use("/account", require("./routes/accountRoute"));

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"));

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
app.get("/", function (req, res) {
  res.render("index", {title: "Home"});
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if  (err.status == 404 || err.status == 500){
    message = err.message
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
