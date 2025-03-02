const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Enable CORS
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/healthDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Define Mongoose Schema
const HealthSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  mobileNumber: String,
  height: Number,
  weight: Number,
  allergies: String,
  surgeries: String,
  medicalTreatment: String,
  bloodType: String,
  alcoholOrSmoke: String,
  dietarySupplements: String,
  purpose: String,
  healthCheckupDate: String,
  medicalReport: String, // File path
});

const HealthData = mongoose.model("HealthData", HealthSchema);

// Route to handle form submission
app.post("/submit", upload.single("medicalReport"), async (req, res) => {
  try {
    if (!req.body.fullName || !req.body.age || !req.body.gender) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const medicalReportPath = req.file ? req.file.path : "";

    const newEntry = new HealthData({
      ...req.body,
      medicalReport: medicalReportPath,
    });

    await newEntry.save();
    res.status(201).json({ message: "✅ Form submitted successfully!" });
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ message: "⚠️ Internal server error" });
  }
});

// Route to fetch all health data
app.get("/health-data", async (req, res) => {
  try {
    const data = await HealthData.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    res.status(500).json({ message: "⚠️ Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
