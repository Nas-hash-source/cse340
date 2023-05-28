const invModel = require("../models/inventoryModel")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build vehicles by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getVehiclesByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
}

invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getVehicleByInventoryId(inventory_id)
    const vehicle = data[0]
    const vehicleDetailView = await utilities.buildInventoryDetailView(vehicle)
    let nav = await utilities.getNav()
    res.render("./inventory/detailView", {
      title: vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model,
      nav,
      vehicleDetailView,
    })
}

module.exports = invCont