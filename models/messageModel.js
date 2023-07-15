const pool = require("../database/")

async function getMessages(account_id) {
  try {
    const sql = "SELECT m.message_id, message_created, m.message_subject, m.message_read, CONCAT(a.account_firstname, ' ', a.account_lastname) AS full_name FROM public.message m INNER JOIN public.account a ON m.message_from = a.account_id WHERE m.message_to = $1 AND m.message_archived = FALSE ORDER BY m.message_CREATED DESC"
    
    const data = await pool.query(sql, [
      account_id
    ])

    return data.rows

  } catch (error) {
    return error.message
  }
}

async function getMessageById(message_id) {
  try {
    const sql = "SELECT m.message_read, m.message_archived, m.message_subject, m.message_body,a.account_id, CONCAT(a.account_firstname, ' ', a.account_lastname) AS full_name FROM public.message m INNER JOIN public.account a ON m.message_from = a.account_id WHERE m.message_id = $1"
    
    const data = await pool.query(sql, [
      message_id
    ])

    return data.rows[0]
  } catch (error) {
    return error.message
  }
}


async function getArchivedMessages(account_id) {
  try {
    const sql = "SELECT m.message_id, message_created, m.message_subject, m.message_read, CONCAT(a.account_firstname, ' ', a.account_lastname) AS full_name FROM public.message m INNER JOIN public.account a ON m.message_from = a.account_id WHERE m.message_to = $1 AND m.message_archived = TRUE ORDER BY m.message_CREATED DESC"
    
    const data = await pool.query(sql, [
      account_id
    ])
    return data.rows
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Add New Message
* *************************** */
async function addNewMessage(
    message_to,
    message_subject,
    message_body,
    message_from
){  
    try {
      const sql = "INSERT INTO message (message_to, message_subject, message_body, message_from) VALUES ($1, $2, $3, $4) RETURNING *"
      return await pool.query(sql, [
        message_to,
        message_subject,
        message_body,
        message_from
      ])
    } catch (error) {
      return error.message
    }
}

async function markMessageAsRead(message_id) {
  try {
    const sql = "UPDATE public.message SET message_read = TRUE WHERE message_id = $1"
    
    const data = await pool.query(sql, [
      message_id
    ])

    return data.rowCount
  } catch (error) {
    return error.message
  }
}

async function markMessageAsArchive(message_id) {
  try {
    const sql = "UPDATE public.message SET message_archived = TRUE WHERE message_id = $1"
    
    const data = await pool.query(sql, [
      message_id
    ])

    return data.rowCount
  } catch (error) {
    return error.message
  }
}

async function removeMessage(message_id) {
  try {
    const sql = "DELETE FROM public.message WHERE message_id = $1"
    
    const data = await pool.query(sql, [
      message_id
    ])

    return data.rowCount
  } catch (error) {
    return error.message
  }
}


async function countUnreadMessage(accountID) {
  try {
    const sql = "SELECT COUNT(message_id) FROM public.message WHERE message_to = $1 AND message_read = FALSE AND message_archived = FALSE"
    const data = await pool.query(sql, [
      accountID
    ])
    return parseInt(data.rows[0].count)
  } catch (error) {
    return error.message
  }
}

async function countArchivedMessage(accountID) {
  try {
    const sql = "SELECT COUNT(message_id) FROM public.message WHERE message_to = $1 AND message_archived = TRUE"
    const data = await pool.query(sql, [
      accountID
    ])
    return parseInt(data.rows[0].count)
  } catch (error) {
    return error.message
  }
}

module.exports = {
    getMessages,
    getMessageById,
    getArchivedMessages,
    addNewMessage,
    markMessageAsRead,
    markMessageAsArchive,
    removeMessage,
    countUnreadMessage,
    countArchivedMessage
}
