const chatMessageTimestamp = () => {
  return new Date().toLocaleTimeString().slice(0, 5);
}

module.exports = {
  chatMessageTimestamp
}
