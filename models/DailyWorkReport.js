const { mongoose, Schema } = require("../db");

const dailyWorkReportSchema = new Schema(
  {
    date: { type: Date, required: true },
    supervisor: { type: Schema.Types.ObjectId, ref: "Worker", required: true },
    entries: [{ type: Schema.Types.ObjectId, ref: "TaskWorkEntry" }],
  },
  { timestamps: true },
);

const DailyWorkReport = mongoose.model("DailyWorkReport", dailyWorkReportSchema);

module.exports = DailyWorkReport;
