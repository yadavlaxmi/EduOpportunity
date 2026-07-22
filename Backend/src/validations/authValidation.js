exports.registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters"),

  body("role")
    .isIn(["student", "organization"])
    .withMessage("Invalid role"),
];