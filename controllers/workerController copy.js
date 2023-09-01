const Worker = require("../models/Worker");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  auth: { persistSession: false },
});

async function index(req, res) {
  try {
    const workersList = await Worker.find();
    return res.json(workersList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

async function token(req, res) {
  try {
    const worker = await Worker.findOne({ email: req.body.email });

    if (!worker) {
      return res.json({ error: "Invalid Credentials" });
    } else if (!(await worker.comparePassword(req.body.password))) {
      return res.json({ error: "Invalid Credentials" });
    } else {
      const token = jwt.sign({ id: worker.id }, process.env.SESSION_SECRET);

      return res.json({
        token,
        firstname: worker.firstname,
        lastname: worker.lastname,
        email: worker.email,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

async function show(req, res) {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({ error: "Worker not found." });
    }

    return res.json({ worker });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

async function store(req, res) {
  try {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: "Error parsing form data." });
      }

      const { firstname, lastname, category } = fields;
      if (!firstname || !lastname || !category || !files.avatar) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const existingWorker = await Worker.findOne({
        firstname: fields.firstname,
        lastname: fields.lastname,
      });
      if (existingWorker) {
        return res
          .status(400)
          .json({ error: "Worker with this firstname and lastname already exists." });
      }

      const ext = path.extname(files.avatar.filepath);
      const newFileName = `image_${Date.now()}${ext}`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(newFileName, fs.createReadStream(files.avatar.filepath), {
          cacheControl: "3600",
          contentType: files.avatar.mimetype,
          duplex: "half",
        });

      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error uploading the avatar image." });
      }

      const updatedWorker = new Worker({
        firstname,
        lastname,
        category,
        avatar: newFileName,
      });

      try {
        await updatedWorker.save();
        return res.status(201).json(updatedWorker);
      } catch (saveError) {
        console.error(saveError);
        return res.status(500).json({ error: "Error saving the new worker." });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

async function update(req, res) {
  try {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: "Error parsing form data." });
      }

      const { firstname, lastname, category } = fields;

      if (!firstname || !lastname || !category || !files.avatar) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const ext = path.extname(files.avatar.filepath);
      const newFileName = `image_${Date.now()}${ext}`;
      console.log(files.avatar.filepath);
      const { data, error } = await supabase.storage
        .from("images")
        .upload(newFileName, fs.createReadStream(files.avatar.filepath), {
          cacheControl: "3600",
          contentType: files.avatar.mimetype,
          duplex: "half",
        });

      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error uploading the avatar image." });
      }

      try {
        // Assuming you have an ID for the worker you want to update
        const workerId = req.params.id; // Adjust the parameter name as needed

        // Update the worker in the database by ID
        await Worker.findByIdAndUpdate(workerId, updatedWorker);

        // Optionally, you can retrieve the updated worker from the database and send it in the response
        const updatedWorkerFromDB = await Worker.findById(workerId);

        return res.status(200).json(updatedWorkerFromDB); // Return the updated worker
      } catch (updateError) {
        console.error(updateError);
        return res.status(500).json({ error: "Error updating the worker." });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

async function destroy(req, res) {
  try {
    const admin = await Admin.findById(req.auth.id);

    if (admin) {
      await Worker.findByIdAndDelete(req.params.id);
      return res.json("Worker has been deleted");
    } else {
      return res.json("You are not an administrator");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting the requested worker." });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  token,
};
