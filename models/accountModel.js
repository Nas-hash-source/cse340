const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT account_email FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email
  } catch (error) {
    return error.message
  }
}

/**** Retrieve the lists of the accounts ****/
async function getAccounts() {
  try {
    const data = await pool.query(
      "SELECT account_id, account_firstname, account_lastname FROM public.account"
    )
    return data.rows
  } catch (error) {
    console.error("getAccounts error " + error)
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account_id
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/*****Update details of the account  ****/
async function updateDetails(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id])
    return data;

  } catch (error) {
    return error.message
  }
}


/*****Update password of the account  ****/
async function updatePassword(account_id, account_password) {
  try {
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2"

    return await pool.query(sql, [
      account_password,
      account_id])

  } catch (error) {
    return error.message
  }
}

module.exports = { getAccounts, registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateDetails, updatePassword }
