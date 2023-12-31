const { mongoose, Schema } = require("../db");
const bcrypt = require("bcryptjs");

const adminSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true },
);

adminSchema.methods.toJSON = function () {
  const admin = this.toObject();
  admin.id = admin._id.toString();
  delete admin.password;
  delete admin._id;
  return admin;
};

adminSchema.methods.comparePassword = async function comparePassword(password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

adminSchema.set("toJSON", {
  virtuals: true,
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
