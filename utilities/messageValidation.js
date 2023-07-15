const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Message Validation Rules
 * ********************************* */
validate.messageRules = () => {
  return [
    body('message_to')
      .notEmpty()
      .escape()
      .withMessage("A message receiver is required."),
  
    body('message_subject')
      .notEmpty()
      .escape()
      .trim()
      .withMessage("A message subject is required."),

    body('message_body')
      .notEmpty()
      .escape()
      .trim()
      .withMessage("A message body is required."),
      
    body('message_from')
      .notEmpty()
      .escape()
      .trim()
      .withMessage("A message sender is required.")
  ]
}

    

/* *********************************
*Validate the message
***********************************/
validate.checkMessage = async (req, res, next) => {
  const { 
      message_to,
      message_subject,
      message_body,
      message_from,
   } = req.body

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const receiverList = await utilities.buildAccountList(message_to)

    res.render("message/newMessage", {
      title: 'New Message',
      nav,
      errors,
      receiverList,
      message_from,
      message_subject,
      message_body

    })

    return
  }
  next()
}


/* *********************************
*Validate the message
***********************************/
validate.checkReply = async (req, res, next) => {
  const { 
      message_to,
      message_subject,
      message_body,
      message_from,
      full_name
   } = req.body

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    
    res.status(200).render('message/reply', {
      title: 'Reply '+ full_name,
      nav,
      message_from,
      message_subject,
      message_to,
      full_name,
      message_body,
      errors
  })

    return
  }
  next()
}
  
  module.exports = validate