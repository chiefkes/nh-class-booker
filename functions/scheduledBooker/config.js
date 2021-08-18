const admin = require("firebase-admin");
const db = admin.firestore();

const getConfig = async () => {
  let bookingConfig = await db.collection("Config").doc("booking").get();
  return bookingConfig.data();
};

module.exports = {
  browserHandler: {},
  booking: {},
  getConfig,
};
