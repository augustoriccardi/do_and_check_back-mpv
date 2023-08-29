const { mongoose, Schema } = require("../db");

const taskSchema = new Schema(
  {
    code: { type: Number, required: true },
    title: { type: String, required: true },
    description: String,
    taskGroup: {
      type: String,
      enum: [
        "Paintings",
        "Hand Excavation",
        "Machine Excavation",
        "Concrete",
        "Masonry",
        "Roofing",
        "Miscellaneous",
        "Finishes",
        "Subfloors",
        "Flooring",
      ],
      required: true,
    },
    taskStatus: {
      type: String,
      enum: ["uninitiated", "pending", "completed"],
      required: true,
    },
    unit: {
      type: String,
      enum: ["gl", "m", "m2", "m3", "un"],
      required: true,
    },
    totalBudgetQty: Number,
    totalBudgetHrs: Number,
    totalLabourCost: Number,
    budgetPerfRatio: Number,
    slug: String,
  },
  { timestamps: true },
);

taskSchema.set("toJSON", {
  virtuals: true,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
