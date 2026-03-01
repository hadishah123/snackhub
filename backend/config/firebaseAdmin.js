const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("../config/serviceAccountKey.json")),
});

module.exports = admin;