const { mongoose, Schema } = require("../db");

const TaskQtyReportSchema = new Schema(
  {
    date: { type: Date, required: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    progressQty: { type: Number, required: true },
  },
  { timestamps: true },
);

TaskQtyReportSchema.set("toJSON", {
  virtuals: true,
});

const TaskQtyReport = mongoose.model("TaskQtyReport", TaskQtyReportSchema);

module.exports = TaskQtyReport;
