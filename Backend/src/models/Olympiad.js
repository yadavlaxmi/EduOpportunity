const mongoose = require("mongoose");

const olympiadSchema = new mongoose.Schema(
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

    olympiadType: {
      type: String,
      enum: [
        "Mathematics",
        "Science",
        "Coding",
        "English",
        "GK",
        "Robotics",
        "Other",
      ],
      required: true,
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

    registrationFee: {
      type: Number,
      default: 0,
    },

    prizes: [
      {
        type: String,
      },
    ],

    syllabus: {
      type: String,
      default: "",
    },

    examPattern: {
      type: String,
      default: "",
    },

    examDuration: {
      type: Number,
      default: 60,
    },

    examMode: {
      type: String,
      enum: [
        "Online",
        "Offline",
      ],
      default: "Online",
    },

    examDate: {
      type: Date,
    },

    registrationStartDate: {
      type: Date,
      required: true,
    },

    registrationEndDate: {
      type: Date,
      required: true,
    },

    resultDate: Date,

    examCenters: [
      {
        state: String,
        city: String,
        address: String,
      },
    ],

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

    totalRegistrations: {
      type: Number,
      default: 0,
    },

    winnersCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Draft", "Published", "Closed"],
      default: "Draft",
    },
    requiredDocuments: [
  {
    type: String,
    trim: true
  }
],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Olympiad", olympiadSchema);