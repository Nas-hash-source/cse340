const invModel = require("../models/inventoryModel")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */

Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul class='navigation' id='navigation'>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/* ************************
 * Constructs classification list in the add new vehicle view
 ************************** */

Util.getClassificationOptions = async function (optionSelected) {
  let data = await invModel.getClassifications()
  let options = "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
      options += `
        <option 
          value="${row.classification_id}"
          ${row.classification_id === Number(optionSelected)? 'selected':''}
        >
          ${row.classification_name}
        </option>
      `
  })
  return options
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data) {
    let grid = ""
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li class="inv_display_item">'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="' + vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors"></a>'
        grid += '<div class="namePrice">'
        grid += '<hr>'
        grid += '<h2 class="vehicle-title">'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

Util.buildInventoryDetailView = async function(vehicle) {
      let vehicleDetailView
      if(vehicle) {
          vehicleDetailView = `
            <article class="detail-view-grid">
                <div>
                    <img class="vehicle-image" src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
                </div>
                <div>
                    <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
                    <p><span class="bold">Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span></p>
                    <p><span class="bold">Description: </span>${vehicle.inv_description}</p>
                    <p><span class="bold">Color: </span>${vehicle.inv_color}</p>
                    <p><span class="bold">Miles: </span>${new Intl.NumberFormat().format(vehicle.inv_miles)}</p>
                </div>
            </article>
          `
        } else { 
          vehicleDetailView += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
        }
        return vehicleDetailView
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util