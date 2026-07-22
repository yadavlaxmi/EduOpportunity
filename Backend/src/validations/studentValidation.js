exports.createStudentValidation = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required"),

  body("phone")
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  body("educationLevel")
    .notEmpty()
    .withMessage("Education level is required"),
];