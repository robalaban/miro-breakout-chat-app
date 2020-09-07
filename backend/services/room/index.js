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

const getRooms = async (db, status = 'active') => {
  let rows;
  let rooms = {};

  try {
    rows = await db.all(`SELECT * FROM Rooms WHERE status = '${status}'`);
  } catch (error) {
    throw Error('Could not retrieve Rooms');
  }

  rows.map(val => rooms[val.id] = val)
  return rooms
}

module.exports = {
  createUpdateRoom,
  getRooms
}
