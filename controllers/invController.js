const invModel = require("../models/inventoryModel")
const utilities = require("../utilities")

const invCont = {}

/******************************
 *  Build vehicle management
 * **************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/vehicleManagement", {
      title: "Vehicle Management",
      nav,
    })

}

/******************************
 *  Add new class form
 * **************************** */

invCont.buildNewClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/addClassification", {
      title: "Add a new classification",
      nav,
      errors: null
    })
}


/******************************
 *  Add new vehicle form
 * **************************** */

invCont.buildNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.getClassificationOptions()
  const inv_image = "/images/vehicles/no-image.png"
  const inv_thumbnail = "/images/vehicles/no-image.png"
  res.render("inventory/addVehicle", {
    title: "Add a new Vehicle",
    nav,
    classificationList,
    inv_image,
    inv_thumbnail,
    errors: null
  })
}

/* ***************************
 *  Build vehicles by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getVehiclesByClassificationId(classification_id)
    console.log(data);
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0]? data[0].classification_name : "Not found"
    res.render("inventory/classification", {
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
    res.render("inventory/detailView", {
      title: vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model,
      nav,
      vehicleDetailView,
    })
}


/* ****************************************
*  Process adding classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const classificationResult = await invModel.addNewClassification(
    classification_name
  )

  if (classificationResult) {
    nav = await utilities.getNav()
    req.flash(
      "success",
      `The ${classification_name} was added successfully.`
    )
    res.status(201).render("inventory/vehicleManagement", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, we couldn't add your classification.")
    res.status(501).render("inventory/addClassification", {
      title: "Add classification",
      nav,
    })
  }
}

/* ****************************************
*  Process adding vehicle
* *************************************** */
invCont.addVehicle = async function (req, res) {
  let nav = await utilities.getNav()
  const {       
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
   } = req.body

  const vehicleResult = await invModel.addVehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  )

  if (vehicleResult) {
    req.flash(
      "success",
      `The ${inv_year} ${inv_model} ${inv_make} was added successfully.`
    )
    res.status(201).render("inventory/vehicleManagement", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, we couldn't add your vehicle.")
    res.status(501).render("inventory/addVehicle", {
      title: "Add Vehicle",
      nav,
    })
  }
}

module.exports = invCont