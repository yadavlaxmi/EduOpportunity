const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
        type: String,
        default: "",
        trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },

    dob: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },

    state: {
      type: String,
      default: "",
    },

    district: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    collegeName: {
      type: String,
      default: "",
    },
    educationLevel: {
    type: String,
    enum: [
        "School",
        "Diploma",
        "UG",
        "PG"
    ],
    default: "School"
},
    degree: {
      type: String,
      default: "",
    },
    graduationYear: {
      type: Number,
      default: null,
    },
    currentClass: {
      type: String,
      default: "",
    },

    schoolName: {
      type: String,
      default: "",
    },

    board: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST", "EWS"],
      default: "General",
    },

    annualIncome: {
      type: Number,
      default: 0,
    },

    isMinority: {
      type: Boolean,
      default: false,
    },

    isDisabled: {
      type: Boolean,
      default: false,
    },

    interestedIn: [
  {
    type: String,
    enum: ["Scholarship", "Olympiad"],
  },
],
    profilePhoto: {
    type: String,
    default: ""
   },
    tenthPercentage: {
      type: Number,
    },

    twelfthPercentage: {
      type: Number,
    },

    cgpa: {
      type: Number,
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);