const { chatMessageTimestamp } = require('../../helpers')

const saveMessage = async (db, roomId, text, author) => {
  let message;
  const timestamp = chatMessageTimestamp();

  try {
    message = await db.run(`INSERT 
    INTO Messages (text, author, timestamp, room_id) 
    VALUES ('${text}', '${author}', '${timestamp}', '${roomId}')`)
  } catch (error) {
    throw Error(`Could not create message: ${error}`);
  }

  return message;
}

const retrieveMessages = async (db, roomId) => {
  let messages;
  try {
    messages = await db.all(`SELECT author, text, timestamp 
      FROM Messages WHERE room_id = ${roomId} ORDER BY timestamp`, []);
  } catch (error) {
    throw Error(`Could not retrieve messages ${error}`);
  }

  return messages;
}

module.exports = {
  saveMessage,
  retrieveMessages
}
