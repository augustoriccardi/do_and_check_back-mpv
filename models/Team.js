const { mongoose, Schema } = require("../db");

const teamSchema = new Schema(
  {
    title: { type: String, required: true },
    dateEstablished: { type: Date, required: true },
    leader: { type: Schema.Types.ObjectId, ref: "Worker" },
    members: [{ type: Schema.Types.ObjectId, ref: "Worker" }],
    tasks: [
      {
        task: { type: Schema.Types.ObjectId, ref: "Task" },
        productiveHours: [
          {
            hours: { type: String, enum: ["normal", "extra", "night"] },
            quantity: Number,
          },
        ],
      },
    ],
    nonProductiveHours: [
      {
        hours: { type: String, enum: ["rain", "break", "sick", "vacation"] },
        quantity: Number,
      },
    ],
  },
  { timestamps: true },
);

teamSchema.set("toJSON", {
  virtuals: true,
});

// Poblar el campo 'leader' y 'members'
teamSchema.virtual("leaderDetails", {
  ref: "Worker",
  localField: "leader",
  foreignField: "_id",
  justOne: true,
});

teamSchema.virtual("memberDetails", {
  ref: "Worker",
  localField: "members",
  foreignField: "_id",
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
