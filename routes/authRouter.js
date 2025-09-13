import {
  signUp,
  signIn,
  getUser,
  signOut,
  getAllUsers,
  signInGoogle,
  verifyEmail,
  getVerificationToken,
  getResetPasswordToken,
  resetPassword,
  updateUser,
  banUser,
  getUserById,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import express from "express";
import passport from "passport";
import { upload } from "../middleware/multer.js";
const router = express.Router();

router.get("/me", verifyToken, getUser);
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.get("/:id", verifyToken, verifyAdmin, getUserById);
router.put("/me", upload.single("avatar"), verifyToken, updateUser);
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);
router.put("/ban", verifyToken, verifyAdmin, banUser);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// Route callback sau khi Google xác thực
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      console.error("Google OAuth Error:", err);
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Gọi hàm signInGoogle để xử lý login
    signInGoogle(req, res, next, user);
  })(req, res, next);
});
router.get("/verification-token", verifyToken, getVerificationToken);
router.post("/verify", verifyEmail);

router.post("/reset-password-token", getResetPasswordToken);
router.post("/reset-password/:reset_password_token", resetPassword);
export default router;
