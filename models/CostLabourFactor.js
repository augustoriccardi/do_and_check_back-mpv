const { mongoose, Schema } = require("../db");

const costLabourFactorSchema = new Schema(
  {
    costLabourFactor: { type: "Number", required: true },
  },
  { timestamps: true },
);

costLabourFactorSchema.set("toJSON", {
  virtuals: true,
});

const CostLabourFactor = mongoose.model("CostLabourFactor", costLabourFactorSchema);

module.exports = CostLabourFactor;
