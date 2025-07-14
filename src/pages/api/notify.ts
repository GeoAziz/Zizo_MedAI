import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, title, body } = req.body;
  try {
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : undefined;
    const fcmToken = userData && userData.fcmToken ? userData.fcmToken : null;
    if (!fcmToken) {
      return res.status(400).json({ error: 'No FCM token found for user.' });
    }
    const message = {
      token: fcmToken,
      notification: { title, body },
      data: { userId },
    };
    await admin.messaging().send(message);
    return res.status(200).json({ success: true });
  } catch (err) {
    const errorMessage = typeof err === 'object' && err !== null && 'message' in err ? (err as { message?: string }).message : undefined;
    return res.status(500).json({ error: errorMessage || 'Failed to send notification.' });
  }
}