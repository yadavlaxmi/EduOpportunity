const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    scholarshipType: {
      type: String,
      enum: [
        "Merit",
        "Need Based",
        "Sports",
        "Minority",
        "Government",
        "Private",
        "International",
        "Other",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    applicationFee: {
      type: Number,
      default: 0,
    },

    educationLevel: {
      type: String,
      enum: ["School", "Diploma", "UG", "PG"],
      required: true,
    },

    eligibleClasses: [
      {
        type: String,
      },
    ],

    boards: [
      {
        type: String,
        enum: [
          "CBSE",
          "ICSE",
          "State Board",
          "NIOS",
          "University",
          "Other",
        ],
      },
    ],

    minimumPercentage: {
      type: Number,
      default: 0,
    },

    annualIncomeLimit: {
      type: Number,
      default: 0,
    },

    category: [
      {
        type: String,
        enum: [
          "General",
          "OBC",
          "SC",
          "ST",
          "EWS",
        ],
      },
    ],

    gender: {
      type: String,
      enum: [
        "Male",
        "Female",
        "Any",
      ],
      default: "Any",
    },

    nationality: {
      type: String,
      default: "Indian",
    },

    locations: [
      {
        state: String,
        cities: [String],
      },
    ],

  requiredDocuments: [
  {
    type: String,
    trim: true
  }
],
    startDate: {
      type: Date,
      required: true,
    },

    lastDate: {
      type: Date,
      required: true,
    },

    resultDate: Date,

    applicationMode: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Online",
    },

    applicationLink: {
      type: String,
      default: "",
    },

    applicationCenters: [
      {
        state: String,
        city: String,
        address: String,
      },
    ],

    totalSeats: {
      type: Number,
      default: 0,
    },

    officialWebsite: {
      type: String,
      default: "",
    },

    contactEmail: {
      type: String,
      default: "",
    },

    contactPhone: {
      type: String,
      default: "",
    },

    brochure: {
      type: String,
      default: "",
    },

    bannerImage: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    totalApplications: {
      type: Number,
      default: 0,
    },

    selectedStudents: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Draft", "Published", "Closed"],
      default: "Draft",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);