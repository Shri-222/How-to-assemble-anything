
import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.post('/sync', async (req, res) => {
  const { uid, email } = req.body;
  if (!uid || !email) {
    return res.status(400).json({ message: "UID and Email are required" });
  }

  try {
    // This will create the user if they don't exist, or update them if they do exits 
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { email },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;