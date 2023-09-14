const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Display a listing of the resource.
async function index(req, res) {
  const admins = await Admin.find();
  return res.json(admins);
}

async function token(req, res) {
  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) {
    return res.json({ error: "Credenciales inválidas" });
  } else if (!(await admin.comparePassword(req.body.password))) {
    return res.json({ error: "Credenciales inválidas" });
  } else {
    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.SESSION_SECRET);

    return res.json({
      token,
      id: admin.id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      username: admin.username,
    });
  }
}

// Display the specified resource.
async function show(req, res) {}

// Show the form for creating a new resource
async function create(req, res) {}

// Store a newly created resource in storage.
async function store(req, res) {
  const { firstname, lastname, password, email, phone } = req.body;

  if (!firstname || !lastname || !password || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const newAdmin = new Admin(req.body);
    await newAdmin.save();
    return res.json("[Database] New Admin saved.");
  } catch (error) {
    return res.status(500).json({ error: "Error saving Admin." });
  }
}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.
async function update(req, res) {
  const { firstname, lastname, password, email, phone } = req.body;

  if (!firstname || !lastname || !password || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const adminEmailMatches = await Admin.findOne({ email });
  if (adminEmailMatches && req.auth.email !== email) {
    return res
      .status(401)
      .json({ error: "Admin with same email is already registered. Please enter another." });
  }

  try {
    hashedPassword = await bcrypt.hash(req.body.password, 8);

    await Admin.findByIdAndUpdate(req.params.id, {
      firstname,
      lastname,
      password: hashedPassword,
      email,
      phone,
    });

    return res.json("[Database] Admin updated.");
  } catch (error) {
    return res.status(500).json({ error: "Error updating Admin." });
  }
}

// Remove the specified resource from storage.
async function destroy(req, res) {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    return res.json("Admin has been deleted");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting the requested Admin." });
  }
}

module.exports = {
  index,
  show,
  create,
  store,
  edit,
  update,
  destroy,
  token,
};
