// const admin = require("firebase-admin");
// const path = require("path");
// const fs = require("fs");

// const serviceAccountPath = path.join(
//   __dirname,
//   "mededoctor-firebase-adminsdk-fbsvc-0648f63750.json"
// );

// if (!fs.existsSync(serviceAccountPath)) {
//   throw new Error(
//     `Firebase service account file not found at ${serviceAccountPath}`
//   );
// }

// const serviceAccount = require(serviceAccountPath);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;
