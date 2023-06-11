// Needed Resources
const utilities = require("../utilities/")
const validation = require("../utilities/inventoryValidation")
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to add new classification
router.get("/add/classification", utilities.handleErrors(invController.buildNewClassification));

// Route to add new classification
router.get("/add/vehicle", utilities.handleErrors(invController.buildNewVehicle));

// Route to build the inventory detail view by inventory id
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build vehicle management
router.get("/", utilities.handleErrors(invController.buildVehicleManagement));

// Post new classification
router.post("/add/classification", 
    validation.classificationRules(),
    validation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Post new classification
router.post("/add/vehicle", 
    validation.vehicleRules(),
    validation.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)
);

module.exports = router;