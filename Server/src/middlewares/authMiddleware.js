import admin from '../config/firebase.js';

    // Middleware to verify Firebase ID tokens.
    // Decodes the token and attaches the UID to req.user.
 
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token with Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Attach the UID to the request object
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email
      };

      next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};