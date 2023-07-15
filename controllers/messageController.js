const utilities = require("../utilities/")
const accountModel = require("../models/accountModel")
const messageModel = require("../models/messageModel")

const message = {}

message.buildInbox = async function (req, res, next) {
  const nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const accountDetail = await accountModel.getAccountById(account_id)
  const fullname = accountDetail.account_firstname + " " + accountDetail.account_lastname
  const messages = await messageModel.getMessages(account_id)
  const messageTable = await utilities.buildMessageList(messages)
  const archivedCount = await messageModel.countArchivedMessage(account_id)
  const archivedNotification = `
  ${archivedCount} Archived ${archivedCount > 1? "Messages": "Message"}  
  `
  
  res.render('message/inbox', {
    title:fullname + " inbox",
    nav,
    messageTable,
    archivedNotification
  }) 
}

message.buildMessageById = async function (req, res, next) {
  const nav = await utilities.getNav()
  const message_id = parseInt(req.params.messageId)
  const account_id = res.locals.accountData.account_id
  const accountDetail = await accountModel.getAccountById(account_id)
  const fullname = accountDetail.account_firstname + " " + accountDetail.account_lastname
  const messageContent = await messageModel.getMessageById(message_id)

  res.render('message/content', {
    title: fullname + " inbox",
    nav,
    ...messageContent
  }) 
}

message.buildArchive = async function (req, res, next) {
  const nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const accountDetail = await accountModel.getAccountById(account_id)
  const fullname = accountDetail.account_firstname + " " + accountDetail.account_lastname
  const messages = await messageModel.getArchivedMessages(account_id)
  const messageTable = await utilities.buildMessageList(messages)
  res.render('message/inbox', {
    title:fullname + " archived messages",
    nav,
    messageTable
  }) 
}

message.buildCreateMessage = async function (req, res, next) {
    const nav = await utilities.getNav()
    const message_from = res.locals.accountData.account_id
    const receiverList = await utilities.buildAccountList()
    res.render('message/newMessage', {
        title: 'New Message',
        nav,
        message_from,
        receiverList,
        errors: null
    })
}

message.replyMessage = async function (req, res, next) {
  const nav = await utilities.getNav()
  const message_id = parseInt(req.params.messageId)
  const message = await messageModel.getMessageById(message_id)
  const message_from = res.locals.accountData.account_id

  res.status(200).render('message/reply', {
      title: 'Reply '+ message.full_name,
      nav,
      message_from,
      message_subject: messsage.message_subject,
      message_to: message.account_id,
      fullname: message.full_name,
      errors: null
  })
}

message.sendMessage = async function(req, res, next) {
    const nav = await utilities.getNav()
    const { 
        message_to,
        message_subject,
        message_body,
        message_from 
    } = req.body
  
    const messageResult = await messageModel.addNewMessage(
      message_to,
      message_subject,
      message_body,
      message_from
    )
// We need to return back to this code later
    if (messageResult) {
      req.flash(
        "success",
        `Your message was sent.`
      )
      const account_id = res.locals.accountData.account_id
      const accountDetail = await accountModel.getAccountById(account_id)
      const fullname = accountDetail.account_firstname + " " + accountDetail.account_lastname
      const messages = await messageModel.getMessages(account_id)
      const messageTable = await utilities.buildMessageList(messages)
      const archivedCount = await messageModel.countArchivedMessage(account_id)
      const archivedNotification = `
      ${archivedCount} Archived ${archivedCount > 1? "Messages": "Message"}  
      `
      res.status(201).render('message/inbox', {
        title:fullname + " inbox",
        nav,
        messageTable,
        archivedNotification
      }) 
    } else {
      req.flash("notice", "Sorry, we couldn't send your message.")
      const message_from = res.locals.accountData.account_id
      const receiverList = await utilities.buildAccountList()
      res.status(501).render('message/newMessage', {
          title: 'New Message',
          nav,
          message_from,
          receiverList,
          errors: null
      })
    }
}


message.sendReply = async function(req, res, next) {
  const nav = await utilities.getNav()
  const { 
      message_to,
      message_subject,
      message_body,
      message_from 
  } = req.body

  const messageResult = await messageModel.addNewMessage(
    message_to,
    message_subject,
    message_body,
    message_from
  )
// We need to return back to this code later
  if (messageResult) {
    req.flash(
      "success",
      `Your message was sent.`
    )
    const account_id = res.locals.accountData.account_id
    const accountDetail = await accountModel.getAccountById(account_id)
    const fullname = accountDetail.account_firstname + " " + accountDetail.account_lastname
    const messages = await messageModel.getMessages(account_id)
    const messageTable = await utilities.buildMessageList(messages)
    const archivedCount = await messageModel.countArchivedMessage(account_id)
    const archivedNotification = `
    ${archivedCount} Archived ${archivedCount > 1? "Messages": "Message"}  
    `
    res.status(201).render('message/inbox', {
      title:fullname + " inbox",
      nav,
      messageTable,
      archivedNotification
    }) 
  } else { 
    req.flash("notice", "Sorry, we couldn't send your message.")
    const { 
      full_name, 
      message_to, 
      message_subject,
      message_body,
      message_from
    } = req.body
  
    res.status(200).render('message/reply', {
        title: 'Reply '+ full_name,
        nav,
        message_from,
        message_subject,
        message_to,
        full_name,
        message_body,
        errors: null
    })
  }
}

module.exports = message;