const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageController")
const { messageRules, checkMessage, checkReply } = require("../utilities/messageValidation")


router.get('/inbox',
    messageController.buildInbox
)

router.get('/inbox/:messageId',
    messageController.buildMessageById
)

router.get('/archived',
    messageController.buildArchive
)

router.get('/add',
    messageController.buildCreateMessage
)

router.post('/add',
    messageRules(),
    checkMessage,
    messageController.sendMessage
)

router.get("/reply/:messageId",
    messageController.replyMessage
)

router.post("/reply/",
    messageRules(),
    checkReply,
    messageController.sendReply
)

router.post("/markread"
)

router.post("/archive")

router.post('delete')


module.exports = router