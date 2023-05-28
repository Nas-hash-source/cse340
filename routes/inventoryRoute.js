// Needed Resources
const utilities = require("../utilities/")
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build the inventory detail view by inventory id
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));
module.exports = router;