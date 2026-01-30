import admin from "firebase-admin";

function getServiceAccount() {
  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  const json = JSON.parse(raw);
  if (json.private_key && typeof json.private_key === "string") {
    json.private_key = json.private_key.replace(/\\n/g, "\n");
  }
  return json;
}

export function getAdminApp() {
  if (admin.apps.length) return admin.app();
  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    throw new Error("Missing FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON");
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  return admin.app();
}

export function getAdminAuth() {
  getAdminApp();
  return admin.auth();
}
