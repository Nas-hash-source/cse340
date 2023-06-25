const invModel = require("../models/inventoryModel")
const utilities = require("../utilities")

const invCont = {}

/******************************
 *  Build vehicle management
 * **************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/vehicleManagement", {
      title: "Vehicle Management",
      nav,
      classificationSelect
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
  let classificationList = await utilities.buildClassificationList()
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

  const classificationSelect = await utilities.buildClassificationList()

  if (classificationResult) {
    nav = await utilities.getNav()
    req.flash(
      "success",
      `The ${classification_name} was added successfully.`
    )
    res.status(201).render("inventory/vehicleManagement", {
      title: "Vehicle Management",
      nav,
      classificationSelect
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
  const classificationSelect = await utilities.buildClassificationList()
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
      classificationSelect
    })
  } else {
    req.flash("notice", "Sorry, we couldn't add your vehicle.")
    res.status(501).render("inventory/addVehicle", {
      title: "Add Vehicle",
      nav,
    })
  }
}


/* ****************************************
*  Process edit inventory
* *************************************** */
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const {       
    classification_id,
    inv_id,
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

  const updateResult = await invModel.updateInventory(
    classification_id,
    inv_id,
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

  if (updateResult) {
    const itemName = inv_make + " " + inv_model
    req.flash(
      "success",
      `The ${itemName} was updated successfully.`
    )
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, we couldn't add your vehicle.")
    res.status(501).render("inventory/editInventory", {
      title: "Edit" + itemName,
      nav,
      classificationList: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}


/* ****************************************
*  Process delete inventory
* *************************************** */
invCont.deleteInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_id, inv_make, inv_model, inv_price } = req.body
  const inventoryId = parseInt(inv_id)
  const deleteResult = await invModel.deleteInventory(inventoryId)
  const itemName = inv_make + " " + inv_model
  if (deleteResult) {
    req.flash(
      "success",
      `The ${itemName} was deleted successfully.`
    )
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, we couldn't delete your vehicle.")
    res.status(501).render("inventory/deleteInventory", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_price,

    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classificationId)
  const invData = await invModel.getVehiclesByClassificationId(classification_id)
  if (invData[0] && invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ****************************************
*  Edit inventory
* *************************************** */

invCont.buildEditInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inventoryId = parseInt(req.params.inventoryId)
  const itemDataPromise = await invModel.getVehicleByInventoryId(inventoryId)
  const itemData = itemDataPromise[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  let classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const inv_image = "/images/vehicles/no-image.png"
  const inv_thumbnail = "/images/vehicles/no-image.png"
  res.render("inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    inv_image,
    inv_thumbnail,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ****************************************
*  Delete inventory
* *************************************** */

invCont.buildDeleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inventoryId = parseInt(req.params.inventoryId)
  let itemData = await invModel.getVehicleByInventoryId(inventoryId)
  itemData = itemData[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("inventory/deleteConfirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}


module.exports = invCont