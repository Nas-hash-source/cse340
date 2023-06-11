const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all vehicles and classification_name by classification_id
 * ************************** */
async function getVehiclesByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

async function getVehicleByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i WHERE i.inv_id = $1",
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getVehicleByInventoryId error: " + error)
  }
}


/* *****************************
*   add new classification
* *************************** */
async function addNewClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}


/* *****************************
*   add new vehicle
* *************************** */
async function addVehicle(
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
  ) {
    try {
      const sql = "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"

      return await pool.query(sql, [
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color])

    } catch (error) {
      return error.message
    }
}

/* **********************
*   Check for existing classification name
* ********************* */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {
  getClassifications, 
  getVehiclesByClassificationId, 
  getVehicleByInventoryId,
  addNewClassification,
  addVehicle,
  checkExistingClassification
}