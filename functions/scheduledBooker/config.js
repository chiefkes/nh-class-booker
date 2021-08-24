const admin = require("firebase-admin");
const db = admin.firestore();
const Err = require("./error.js");

const getConfig = async (attempt = 1) => {
  try {
    let bookingConfig = await db.collection("Config").doc("booking").get();
    return bookingConfig.data();
  } catch (err) {
    if (attempt > 8) throw new Err("GET_CONFIG", err);
    return await getConfig(attempt + 1);
  }
};

module.exports = {
  browserHandler: {},
  booking: {},
  getConfig,
};
