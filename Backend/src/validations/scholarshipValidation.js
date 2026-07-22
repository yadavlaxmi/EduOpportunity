const { body } = require("express-validator");

exports.createScholarshipValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("scholarshipType")
    .notEmpty()
    .withMessage("Scholarship Type is required"),

  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number"),

  body("educationLevel")
    .notEmpty()
    .withMessage("Education Level is required"),

  body("startDate")
    .isISO8601()
    .withMessage("Start Date is required"),

  body("lastDate")
    .isISO8601()
    .withMessage("Last Date is required"),
];

exports.updateScholarshipValidation = [
  body("title").optional().notEmpty(),
  body("amount").optional().isNumeric(),
  body("educationLevel").optional(),
];