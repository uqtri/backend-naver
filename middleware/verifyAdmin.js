export const verifyAdmin = async (req, res, next) => {
  try {
    if (req.role != "ADMIN")
      return res.status(401).json({
        success: false,
        message: "Access denied. You need an Admin role to get access.",
      });
    next();
  } catch (error) {
    console.log("Error verify admin:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
