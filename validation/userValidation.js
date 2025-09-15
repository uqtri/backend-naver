import Joi from "@hapi/joi";

export const signUpValidator = Joi.object({
  // username: Joi.string().alphanum().min(6).max(20).required().messages({
  //   "any.required": "Tên đăng nhập là bắt buộc",
  //   "string.empty": "Tên đăng nhập không được để trống",
  //   "string.min": "Tên đăng nhập phải có ít nhất 6 ký tự",
  //   "string.max": "Tên đăng nhập không được vượt quá 20 ký tự",
  // }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .pattern(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    )
    .required()
    .messages({
      "string.empty": "Email không được để trống",
      "string.email": "Email không hợp lệ",
      "any.required": "Email là bắt buộc",
      "string.pattern.base": "Email không hợp lệ",
    }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .max(20)
    .messages({
      "any.required": "Mật khẩu là bắt buộc",
      "string.empty": "Mật khẩu không được để trống",
      "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
      "string.max": "Mật khẩu không được vượt quá 20 ký tự",
      "string.pattern.base": "Mật khẩu không hợp lệ",
    }),
  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "any.required": "Xác nhận mật khẩu là bắt buộc",
      "any.only": "Mật khẩu xác nhận không khớp",
    }),
  role: Joi.string(),
});

export const resetPasswordValidator = Joi.object({
  new_password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .max(20)
    .messages({
      "any.required": "Mật khẩu mới là bắt buộc",
      "string.empty": "Mật khẩu mới không được để trống",
      "string.min": "Mật khẩu mới phải có ít nhất 6 ký tự",
      "string.max": "Mật khẩu mới không được vượt quá 20 ký tự",
      "string.pattern.base": "Mật khẩu mới không hợp lệ",
    }),
  confirm_new_password: Joi.string()
    .required()
    .valid(Joi.ref("new_password"))
    .messages({
      "any.required": "Xác nhận mật khẩu là bắt buộc",
      "any.only": "Mật khẩu xác nhận không khớp",
    }),
});
