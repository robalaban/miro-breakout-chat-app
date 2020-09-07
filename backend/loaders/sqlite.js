const Database = require('sqlite-async');

const database = async () => {

  try {
      db = await Database.open('./database/breakoutchat.db')
  } catch (error) {
      throw Error('Cannot access Database', error);
  }

  // Enable foreign-key support
  db.get("PRAGMA foreign_keys = ON")
  
  try {
    await db.run(`CREATE TABLE IF NOT EXISTS Rooms (
      id integer PRIMARY KEY,
      status text)`);    
  } catch (error) {
    throw Error('Could not create table Rooms')
  }

  try {
    await db.run(`CREATE TABLE IF NOT EXISTS Messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      author TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      room_id integer NOT NULL, FOREIGN KEY (room_id) REFERENCES Rooms (id))`);    
  } catch (error) {
    throw Error('Could not create table Messages')
  }

  return db
}

module.exports = database;
