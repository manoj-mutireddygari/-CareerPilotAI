import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const hasAdminConfig = Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);

export const firebaseAdmin = hasAdminConfig
  ? admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    })
  : null;

export const firestore = firebaseAdmin ? admin.firestore() : null;

firestore?.settings({ ignoreUndefinedProperties: true });
