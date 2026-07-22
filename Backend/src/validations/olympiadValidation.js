exports.createOlympiadValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("olympiadType")
    .notEmpty()
    .withMessage("Olympiad type is required"),

  body("registrationStartDate")
    .isISO8601()
    .withMessage("Invalid registration start date"),

  body("registrationEndDate")
    .isISO8601()
    .withMessage("Invalid registration end date"),
];