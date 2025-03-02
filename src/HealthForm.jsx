import React, { useState } from "react";
import axios from "axios";
import "./HealthForm.css";

const HealthForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    mobileNumber: "",
    height: "",
    weight: "",
    allergies: "",
    surgeries: "",
    medicalTreatment: "",
    bloodType: "",
    alcoholOrSmoke: "",
    dietarySupplements: "",
    purpose: "",
    healthCheckupDate: "",
  });

  const [medicalReport, setMedicalReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setMedicalReport(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Prepare form data
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (medicalReport) {
      data.append("medicalReport", medicalReport);
    }

    try {
      const response = await axios.post("http://localhost:5000/submit", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Form submitted successfully!");
      console.log(response.data);

      // Reset form
      setFormData({
        fullName: "",
        age: "",
        gender: "",
        mobileNumber: "",
        height: "",
        weight: "",
        allergies: "",
        surgeries: "",
        medicalTreatment: "",
        bloodType: "",
        alcoholOrSmoke: "",
        dietarySupplements: "",
        purpose: "",
        healthCheckupDate: "",
      });
      setMedicalReport(null);
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      setMessage("⚠️ Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Health Tracking Form</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <h3>Basic Details</h3>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="tel" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} required />
        <input type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} required />
        <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} required />

        <h3>Medical Details</h3>
        <input type="text" name="allergies" placeholder="Allergies (if any)" value={formData.allergies} onChange={handleChange} />
        <input type="text" name="surgeries" placeholder="Past Surgeries" value={formData.surgeries} onChange={handleChange} />
        <input type="text" name="medicalTreatment" placeholder="Current Medical Treatment" value={formData.medicalTreatment} onChange={handleChange} />
        <input type="text" name="bloodType" placeholder="Blood Type" value={formData.bloodType} onChange={handleChange} required />

        <label>Upload Medical Report:</label>
        <input type="file" onChange={handleFileChange} required />

        <h3>Other Details</h3>
        <select name="alcoholOrSmoke" value={formData.alcoholOrSmoke} onChange={handleChange} required>
          <option value="">Do you consume alcohol or smoke?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <input type="text" name="dietarySupplements" placeholder="Dietary Supplements (if any)" value={formData.dietarySupplements} onChange={handleChange} />
        <input type="text" name="purpose" placeholder="What are you here for?" value={formData.purpose} onChange={handleChange} required />
        <input type="date" name="healthCheckupDate" value={formData.healthCheckupDate} onChange={handleChange} required />

        <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
      </form>
    </div>
  );
};

export default HealthForm;
