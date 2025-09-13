import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.users.findUnique({
      where: { user_id: verified.user_id },
    });

    req.user_id = user.user_id;
    req.role = user.role;

    next();
  } catch (err) {
    console.log("Error verify token:", err);
    return res.status(500).send("Internal Server Error");
  }
};
