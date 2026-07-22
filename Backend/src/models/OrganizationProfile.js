const mongoose = require("mongoose");

const organizationProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    organizationName: {
      type: String,
      required: true,
      trim: true,
    },

    organizationType: {
      type: String,
      enum: [
        "School",
        "College",
        "University",
        "NGO",
        "Government",
        "Private Company",
        "Foundation",
        "Trust",
        "Other",
      ],
      required: true,
    },

    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      required: true,
    },

    alternatePhone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    district: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "India",
    },

    registrationNumber: {
      type: String,
      default: "",
    },

    establishedYear: {
      type: Number,
      default: null,
    },

    about: {
      type: String,
      default: "",
    },

    organizationLogo: {
      type: String,
      default: "",
    },

    verified: {
      type: Boolean,
      default: false,
    },

    socialLinks: {
      linkedin: {
        type: String,
        default: "",
      },

      facebook: {
        type: String,
        default: "",
      },

      instagram: {
        type: String,
        default: "",
      },

      twitter: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "OrganizationProfile",
  organizationProfileSchema
);