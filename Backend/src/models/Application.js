const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    opportunityType: {
      type: String,
      enum: ["Scholarship", "Olympiad"],
      required: true,
    },

    scholarship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scholarship",
      default: null,
    },

    olympiad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Olympiad",
      default: null,
    },

    status: {
      type: String,
      enum: ["Saved", "Applied"],
      default: "Saved",
    },

    appliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index(
  {
    student: 1,
    scholarship: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      scholarship: {
        $exists: true,
      },
    },
  }
);

applicationSchema.index(
  {
    student: 1,
    olympiad: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      olympiad: {
        $exists: true,
      },
    },
  }
);

module.exports = mongoose.model("Application", applicationSchema);