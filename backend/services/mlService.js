const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/predict';

async function predictStage(imagePath) {
  const formData = new FormData();
  formData.append('image', fs.createReadStream(imagePath));

  const response = await axios.post(ML_SERVICE_URL, formData, {
    headers: formData.getHeaders(),
    timeout: 20000,
  });

  return response.data;
}

module.exports = {
  predictStage,
};
