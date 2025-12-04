import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync("./ranger-med-core-firebase.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const FCM = admin.messaging();
