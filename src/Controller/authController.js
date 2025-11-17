require("dotenv").config();
const UserModal = require("../Modals/User.modal.js");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const resetTracks = require("./utils/resetTask.js");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
  // note: token is the idToken (credential) from Google client
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body; // idToken from Google
    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    const payload = await verifyGoogleToken(token);
    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    // Find existing user by email
    let user = await UserModal.findOne({ email: payload.email });

    // If user doesn't exist -> create it
    if (!user) {
      user = await UserModal.create({
        email: payload.email,
        googleId: payload.sub,
        firstName: payload.given_name,
        lastName: payload.family_name,
        profilePicture: payload.picture,
      });
    } else {
      // Optionally update changed fields (non-destructive)
      const updates = {};
      if (payload.sub && user.googleId !== payload.sub) updates.googleId = payload.sub;
      if (payload.given_name && user.firstName !== payload.given_name) updates.firstName = payload.given_name;
      if (payload.family_name && user.lastName !== payload.family_name) updates.lastName = payload.family_name;
      if (payload.picture && user.profilePicture !== payload.picture) updates.profilePicture = payload.picture;

      if (Object.keys(updates).length > 0) {
        user = await UserModal.findByIdAndUpdate(user._id, updates, { new: true });
      }
    }

    // Create JWT for the user
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return token and user
    return res.status(200).json({
      message: "User logged in successfully",
      token: jwtToken, // unified key 'token' expected by frontend
      user,
    });
  } catch (error) {
    console.error("Error during Google login:", error);
    return res.status(500).json({
      message: "Something went wrong during login",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    // If you use cookies, clear cookie here. For token-based auth, client removes token.
    // Example: res.clearCookie('jwtToken');
    // const userId = req.userId; // assuming protection middleware sets req.userId
    // console.log(`User with ID ${userId} logged out.`);  
    res.clearCookie("jwtToken");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Something went wrong during logout", error: error.message });
  }
};

const refreshAuthToken = async (req, res) => {
  try {
    const { oldToken } = req.body;

    if (!oldToken) return res.status(400).json({ message: "Old token is required" });

    // Verify old token (it might be expired but still valid structure)
    const decoded = jwt.decode(oldToken);
    if (!decoded || !decoded.id) return res.status(400).json({ message: "Invalid token" });

    // Optional: check user still exists
    const user = await UserModal.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate new token
    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // calling resetTracks function to reset user's tracks
   const resetResult = await resetTracks(user._id);

    return res.status(200).json({
      message: "Token refreshed successfully",
      token: newToken
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Token refresh failed", error: error.message });
  }
};

module.exports = { googleLogin, logout, refreshAuthToken };
