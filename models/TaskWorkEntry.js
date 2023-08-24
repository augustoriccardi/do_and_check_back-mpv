const { mongoose, Schema } = require("../db");

const taskWorkEntrySchema = new Schema(
  {
    worker: { type: Schema.Types.ObjectId, ref: "Worker", required: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    productiveHrs: [
      {
        type: { type: String, enum: ["normal", "extra", "night"] },
        hours: Number,
      },
    ],
    nonProductiveHrs: [
      {
        type: { type: String, enum: ["rain", "break", "sick", "vacation"] },
        hours: Number,
      },
    ],
    date: { type: Date, required: true },
  },
  { timestamps: true },
);

const TaskWorkEntry = mongoose.model("TaskWorkEntry", taskWorkEntrySchema);

module.exports = TaskWorkEntry;
