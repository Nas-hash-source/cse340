const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageController")
const { messageRules, checkMessage, checkReply } = require("../utilities/messageValidation")
const { checkLogin, handleErrors } = require("../utilities")


router.get('/inbox',
    checkLogin,
    handleErrors(messageController.buildInbox)
)

router.get('/inbox/:messageId',
    checkLogin,
    handleErrors(messageController.buildMessageById)
)

router.get('/archived',
    checkLogin,
    handleErrors(messageController.buildArchive)
)

router.get('/add',
    checkLogin,
    handleErrors(messageController.buildCreateMessage)
)

router.post('/add',
    checkLogin,
    messageRules(),
    checkMessage,
    handleErrors(messageController.sendMessage)
)

router.get("/reply/:messageId",
    checkLogin,
    handleErrors(messageController.replyMessage)
)

router.post("/reply/",
    checkLogin,
    messageRules(),
    checkReply,
    handleErrors(messageController.sendReply)
)

router.get("/markread/:messageId",
    checkLogin,
    handleErrors(messageController.markRead)
)

router.get("/archive/:messageId",
    checkLogin,
    handleErrors(messageController.markAsArchived)
)

router.get("/delete/:messageId",
    checkLogin,
    handleErrors(messageController.buildDeleteconfirm)
)

router.post("/delete/",
    checkLogin,
    handleErrors(messageController.removeMessage)
)


module.exports = router