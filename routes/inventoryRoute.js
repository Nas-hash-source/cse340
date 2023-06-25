// Needed Resources
const utilities = require("../utilities/")
const validation = require("../utilities/inventoryValidation")
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to add new classification
router.get("/add/classification",
    utilities.checkLogin,
    utilities.checkAdministrativeAccess,
    utilities.handleErrors(invController.buildNewClassification)
);

// Route to add new classification
router.get("/add/vehicle",  
    utilities.checkLogin,
    utilities.checkAdministrativeAccess,
    utilities.handleErrors(invController.buildNewVehicle)
);

// Route to build the inventory detail view by inventory id
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Router to get the Inventory by classificationId
router.get("/getInventory/:classificationId",  
    utilities.checkLogin,
    utilities.checkAdministrativeAccess,
    utilities.handleErrors(invController.getInventoryJSON)
)

// Router to edit an inventory by inventoryId
router.get("/edit/:inventoryId",  
    utilities.checkLogin,
    utilities.checkAdministrativeAccess,
    utilities.handleErrors(invController.buildEditInventory)
)

// Router to delete an inventory by inventoryId
router.get("/delete/:inventoryId",  
    utilities.checkLogin,
    utilities.checkAdministrativeAccess,
    utilities.handleErrors(invController.buildDeleteInventory)
)

// Route to build vehicle management
router.get("/", 
    utilities.checkLogin,
    utilities.checkAdministrativeAccess,
    utilities.handleErrors(invController.buildVehicleManagement)
);

// Post new classification
router.post("/add/classification",
    utilities.checkLogin,
    utilities.checkAdministrativeAccess,
    validation.classificationRules(),
    validation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Post new classification
router.post("/add/vehicle", 
    utilities.checkLogin,
    utilities.checkAdministrativeAccess,
    validation.vehicleRules(),
    validation.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)
);
// Update Vehicle
router.post("/update/", 
    utilities.checkLogin,
    utilities.checkAdministrativeAccess,
    validation.vehicleRules(),
    validation.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Delete Vehicle
router.post("/delete/", 
    utilities.checkLogin,
    utilities.checkAdministrativeAccess,
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;