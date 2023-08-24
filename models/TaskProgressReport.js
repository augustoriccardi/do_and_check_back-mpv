const { mongoose, Schema } = require("../db");

const taskProgressReportSchema = new Schema(
  {
    date: { type: Date, required: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    progressQty: { type: Number, required: true },
  },
  { timestamps: true },
);

const TaskProgressReport = mongoose.model("TaskProgressReport", taskProgressReportSchema);

module.exports = TaskProgressReport;
