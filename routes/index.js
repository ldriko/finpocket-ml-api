const express = require("express");
const path = require("path");
const tfjs = require("@tensorflow/tfjs-node");

const router = express.Router();

// Fungsi untuk memuat model
async function loadModel() {
  const modelUrl = path.join(__dirname, "..", "model", "model.json");
  console.log("Loading Model...");
  return await tfjs.loadLayersModel(`file://${modelUrl}`);
}

// Fungsi untuk mempersiapkan input dan melakukan prediksi
async function predict(model, income, age, dependents) {
  // Persiapkan input tensor
  const input = tfjs.tensor2d([[parseFloat(income), parseInt(age), parseInt(dependents)]]);
  
  // Lakukan prediksi
  console.log("Performing prediction...");
  const output = model.predict(input);
  const prediction = output.dataSync();  // Ambil hasil prediksi

  return prediction;  // Kembalikan nilai prediksi pertama
}

/**
 * Required params:
 * 1. income
 * 2. age
 * 3. dependents
 */
router.get("/", async (req, res, next) => {
  const { income, age, dependents } = req.query;

  // Periksa apakah semua parameter ada
  if (!income || !age || !dependents) {
    return res.status(400).json({
      message: "Missing required parameters",
      status: "error",
      data: null,
    });
  }

  // Memuat model
  let model;
  try {
    model = await loadModel();
  } catch (error) {
    console.error("Error loading model:", error);
    return res.status(500).json({
      message: "Error loading model",
      status: "error",
      data: null,
    });
  }

  // Lakukan prediksi
  let prediction;
  try {
    prediction = await predict(model, income, age, dependents);
  } catch (error) {
    console.error("Error performing prediction:", error);
    return res.status(500).json({
      message: "Error performing prediction",
      status: "error",
      data: null,
    });
  }

  // Kembalikan hasil prediksi
  return res.json({
    message: "Prediction successful",
    status: "success",
    data: { prediction: prediction },  // Kembalikan nilai prediksi
  });
});

module.exports = router;
