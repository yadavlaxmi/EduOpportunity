const { body } = require("express-validator");

exports.createOrganizationValidation = [
  body("organizationName")
    .notEmpty()
    .withMessage("Organization name is required"),

  body("organizationType")
    .notEmpty()
    .withMessage("Organization type is required"),

  body("contactPerson")
    .notEmpty()
    .withMessage("Contact person is required"),
];