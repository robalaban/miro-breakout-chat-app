const createUpdateRoom = async (db, roomId, status = 'active') => {
  let room;
  try {
    room = await db.run(`INSERT or REPLACE 
    INTO Rooms VALUES (${roomId}, '${status}')`)
  } catch (error) {
    throw Error(`Could not create/update Room: ${error}`)
  }

  return room;
}

module.exports = {
  createUpdateRoom
}
