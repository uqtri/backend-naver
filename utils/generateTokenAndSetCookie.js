import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (user_id, email, role, res) => {
  console.log(user_id, email, role);
  const token = jwt.sign(
    {
      userId: user_id,
      email: email,
      role: role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    }
  );
  console.log(
    {
      userId: user_id,
      email: email,
      role: role,
    },
    "!@#!@vc"
  );
  // Set cookie
  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000, //ms
    httpOnly: true, //prevent XSS attacks cross-site scripting attack
    sameSite: "none", //CSRF attack
    secure: true, //cookie only works in https
  });
};

export default generateTokenAndSetCookie;
