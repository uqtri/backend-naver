import bcrypt from "bcryptjs";
import {
  signUpValidator,
  resetPasswordValidator,
} from "../validation/userValidation.js";
import { prisma } from "../config/db.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import generateToken from "../utils/generateToken.js";
import clourdinary from "../config/cloudinary.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../config/nodemailer.js";

export const getAllUsers = async (req, res) => {
  try {
    const {
      username,
      email,
      fullname,
      phone_number,
      sortBy,
      sortOrder,
      page = 1,
      limit = 6,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const filters = {};

    if (username) {
      filters.username = {
        contains: username,
        mode: "insensitive",
      };
    }

    if (email) {
      filters.email = {
        contains: email,
        mode: "insensitive",
      };
    }

    if (fullname) {
      filters.fullname = {
        contains: fullname,
        mode: "insensitive",
      };
    }

    if (phone_number) {
      filters.phone_number = {
        contains: phone_number,
        mode: "insensitive",
      };
    }

    const validSortFields = ["username", "email", "created_at"];
    const orderBy = {};

    if (sortBy && validSortFields.includes(sortBy)) {
      orderBy[sortBy] = sortOrder === "desc" ? "desc" : "asc";
    }

    const totalItems = await prisma.users.count();

    const users = await prisma.users.findMany({
      where: filters,
      orderBy: Object.keys(orderBy).length ? orderBy : undefined,
      include: {
        sales_orders: true,
        service_orders: { include: { service_order_details: true } },
        carts: { include: { cart_details: { include: { product: true } } } },
      },
      skip,
      take: limitNumber,
    });

    return res.status(200).json({
      success: true,
      data: users,
      totalItems,
      totalPages: page ? Math.ceil(totalItems / parseInt(limit)) : 1,
      currentPage: page ? parseInt(page) : 1,
    });
  } catch (error) {
    console.error("Error get all users:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  const user_id = req.user_id;
  console.log("User ID:", user_id);
  try {
    const user = await prisma.users.findUnique({
      omit: {
        password: true,
      },
      where: { user_id },
      include: {
        sales_orders: true,
        service_orders: {
          include: {
            service_order_details: {
              include: {
                service: true,
              },
            },
          },
        },
        carts: { include: { cart_details: { include: { product: true } } } },
      },
    });

    if (user) {
      return res.status(200).json({ success: true, data: user });
    }

    return res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    console.log("Error get user: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  const user_id = req.params.id;
  try {
    const user = await prisma.users.findUnique({
      omit: {
        password: true,
      },
      where: { user_id },
      include: {
        sales_orders: true,
        service_orders: {
          include: {
            service_order_details: {
              include: {
                service: true,
              },
            },
          },
        },
        service_orders: true,
        carts: { include: { cart_details: { include: { product: true } } } },
      },
    });

    if (user) {
      return res.status(200).json({ success: true, data: user });
    }

    return res.status(404).json({ success: false, message: "User not found" });
  } catch (error) {
    console.log("Error get user: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const user_id = req.user_id;
  const file = req.file;
  const data = req.body;
  console.log("Update user data:", user_id);

  if (file) {
    const profileBase64String = `data:${
      file.mimetype
    };base64,${file.buffer.toString("base64")}`;
    try {
      const UrlObject = await clourdinary.uploader.upload(profileBase64String);
      data.profile_pic = UrlObject.secure_url;
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  try {
    // if (!data || Object.keys(data).length === 0) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Vui lòng cung cấp đủ thông tin." });
    // }
    console.log("Data to update:", data, "@@@");
    const updatedUser = await prisma.users.update({
      where: { user_id },
      data,
    });

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log("Error update user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const signUp = async (req, res) => {
  const data = req.body;
  console.log(data);

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng cung cấp đủ thông tin." });
    }

    await signUpValidator.validateAsync(data);

    const [checkUsername, checkEmail, checkPhoneNumber] = await Promise.all([
      await prisma.users.findUnique({ where: { username: data.username } }),
      await prisma.users.findUnique({ where: { email: data.email } }),
      await prisma.users.findUnique({
        where: { phone_number: data.phone_number },
      }),
    ]);

    if (checkEmail) {
      return res
        .status(409)
        .json({ success: false, message: "Email đã tồn tại." });
    }

    if (checkUsername) {
      return res
        .status(409)
        .json({ success: false, message: "Tên đăng nhập đã tồn tại." });
    }

    if (checkPhoneNumber) {
      return res
        .status(409)
        .json({ success: false, message: "Số điện thoại đã tồn tại." });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.users.create({
      data: {
        username: data.username,
        phone_number: data.phone_number,
        email: data.email,
        password: hashedPassword,
        role: data.role ? data.role : "USER",
      },
    });

    generateTokenAndSetCookie(newUser.user_id, newUser.role, res);

    return res
      .status(200)
      .json({ success: true, message: "Sign up sucesfully", data: newUser });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }
    console.log("Error signing up: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const signIn = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đủ thông tin.",
      });
    }

    const user = await prisma.users.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone_number: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(406).json({ success: false, message: "Sai mật khẩu" });
    }

    generateTokenAndSetCookie(user.user_id, user.role, res);

    return res.json({
      success: true,
      data: {
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phone_number: user.phone_number,
        profile_pic: user.profile_pic,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error sign in:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const signInGoogle = async (req, res, next, user) => {
  try {
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    generateTokenAndSetCookie(user.user_id, user.role, res);

    res.status(200).json({ message: "Login successful", data: user });
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signOut = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    return res
      .status(200)
      .json({ success: true, message: "Sign out successfully" });
  } catch (error) {
    console.log("Error sign out:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getVerificationToken = async (req, res) => {
  const { user_id } = req;
  try {
    const user = await prisma.users.findUnique({ where: { user_id } });

    if (user) {
      if (!user.is_verified) {
        const verification_token = generateToken();

        await prisma.users.update({
          where: { user_id },
          data: {
            verification_token: verification_token,
            verification_token_expires_at: new Date(
              Date.now() + 20 * 60 * 1000
            ),
          },
        });

        await sendVerificationEmail(user.email, verification_token);

        return res.status(200).json({ message: "Gửi mã xác nhận thành công!" });
      } else {
        return res
          .status(400)
          .json({ message: "Người dùng đã được xác thực." });
      }
    }

    return res.status(404).json({ message: "Không tìm thấy người dùng." });
  } catch (error) {
    console.log("Error send token", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { verification_token } = req.body;

  try {
    if (verification_token == null) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đủ thông tin.",
      });
    }

    const user = await prisma.users.findFirst({
      where: {
        verification_token,
        verification_token_expires_at: { gt: new Date() },
      },
    });

    if (user) {
      await prisma.users.update({
        where: { verification_token },
        data: {
          is_verified: true,
          verification_token: null,
          verification_token_expires_at: null,
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "Xác thực người dùng thành công." });
    }

    return res
      .status(404)
      .json({ success: false, message: "Mã xác thực không hợp lệ." });
  } catch (error) {
    console.log("Error verify email:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internet Server Error" });
  }
};

export const getResetPasswordToken = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });

    const reset_password_token = generateToken();

    await prisma.users.update({
      where: { email },
      data: {
        reset_password_token: reset_password_token,
        reset_password_token_expires_at: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await sendResetPasswordEmail(user.email, reset_password_token);

    return res.status(200).json({
      success: true,
      message: "Mã xác nhận đã được gửi tới email của bạn.",
    });
  } catch (error) {
    console.log("Error send reset password mail:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { reset_password_token } = req.params;
  const { new_password, confirm_new_password } = req.body;
  try {
    await resetPasswordValidator.validateAsync(req.body);

    const user = await prisma.users.findUnique({
      where: {
        reset_password_token,
        reset_password_token_expires_at: { gt: new Date() },
      },
    });

    if (user) {
      const hashedPassword = await bcrypt.hash(new_password, 10);

      await prisma.users.update({
        where: { reset_password_token },
        data: {
          password: hashedPassword,
          reset_password_token: null,
          reset_password_token_expires_at: null,
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "Đặt lại mật khẩu thành công." });
    }

    return res
      .status(400)
      .json({ sucess: false, message: "Mã xác thực không hợp lệ." });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }
    console.log("Error reset password: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const banUser = async (req, res) => {
  const { user_id } = req.body;
  try {
    const bannedUser = await prisma.users.update({
      where: { user_id },
      data: { is_banned: true },
    });

    if (!bannedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Ban user successfully" });
  } catch (error) {
    console.log("Error ban user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
