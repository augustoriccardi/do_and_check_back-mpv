const { mongoose, Schema } = require("../db");
const bcrypt = require("bcryptjs");

const workerSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    avatar: String,
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String, enum: ["operator", "supervisor"] },
    documentNumber: { type: Number },
    status: { type: String, enum: ["activo", "inactivo"] },
    team: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  },
  { timestamps: true },
);

workerSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.id = user._id.toString();
  delete user.password;
  delete user._id;
  return user;
};

workerSchema.methods.comparePassword = async function comparePassword(password) {
  return await bcrypt.compare(password, this.password);
};

workerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

const Worker = mongoose.model("Worker", workerSchema);

module.exports = Worker;
