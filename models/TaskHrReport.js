const { mongoose, Schema } = require("../db");

const taskHrReportSchema = new Schema(
  {
    date: { type: Date, required: true },
    worker: { type: Schema.Types.ObjectId, ref: "Worker", required: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    hours: { type: Number, required: true },
  },
  { timestamps: true },
);

taskHrReportSchema.set("toJSON", {
  virtuals: true,
});

const TaskHrReport = mongoose.model("TaskHrReport", taskHrReportSchema);

module.exports = TaskHrReport;
