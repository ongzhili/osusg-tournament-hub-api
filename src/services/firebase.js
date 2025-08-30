const admin = require('firebase-admin');

const serviceAccountPath = process.env.firebase_cert;
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;