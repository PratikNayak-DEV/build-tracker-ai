const path = require('path');
const ConstructionImage = require('../models/ConstructionImage');
const { predictStage } = require('../services/mlService');
const { STAGE_PROGRESS_MAP, STAGES } = require('../config/constants');

function getProgressForStage(stage) {
  return STAGE_PROGRESS_MAP[stage] ?? 0;
}

async function uploadImage(req, res) {
  try {
    const { projectName, activityType } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }

    if (!projectName || !activityType) {
      return res.status(400).json({
        error: 'projectName and activityType are required.',
      });
    }

    const imageDoc = await ConstructionImage.create({
      projectName,
      activityType,
      imagePath: req.file.path,
      uploadDate: new Date(),
    });

    return res.status(201).json({
      message: 'Image uploaded successfully.',
      image: imageDoc,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to upload image.',
      details: error.message,
    });
  }
}

async function analyzeImage(req, res) {
  try {
    const { imageId, projectName, activityType } = req.body;

    let imageDoc = null;

    if (imageId) {
      imageDoc = await ConstructionImage.findById(imageId);
      if (!imageDoc) {
        return res.status(404).json({ error: 'Image not found for provided imageId.' });
      }
    } else if (req.file) {
      if (!projectName || !activityType) {
        return res.status(400).json({
          error: 'projectName and activityType are required when sending a new file.',
        });
      }

      imageDoc = await ConstructionImage.create({
        projectName,
        activityType,
        imagePath: req.file.path,
        uploadDate: new Date(),
      });
    } else {
      return res.status(400).json({
        error: 'Provide either imageId or upload a file in field "image".',
      });
    }

    const prediction = await predictStage(path.resolve(imageDoc.imagePath));
    const predictedStage = prediction.stage;

    if (!STAGES.includes(predictedStage)) {
      return res.status(502).json({
        error: 'ML service returned an invalid stage.',
        stage: predictedStage,
      });
    }

    if (imageDoc.activityType.toLowerCase() !== predictedStage.toLowerCase()) {
      return res.status(400).json({
        error: `Uploaded image appears to be ${predictedStage} work. Please select correct activity type.`,
        detectedStage: predictedStage,
      });
    }

    const previousImage = await ConstructionImage.findOne({
      projectName: imageDoc.projectName,
      _id: { $ne: imageDoc._id },
      stage: { $ne: null },
    })
      .sort({ uploadDate: -1 })
      .lean();

    const previousProgress = previousImage ? previousImage.progressPercent : 0;
    const progressPercent = getProgressForStage(predictedStage);
    const progressDelta = progressPercent - previousProgress;

    imageDoc.stage = predictedStage;
    imageDoc.confidence = prediction.confidence;
    imageDoc.progressPercent = progressPercent;
    imageDoc.progressDelta = progressDelta;

    await imageDoc.save();

    return res.json({
      stage: predictedStage,
      confidence: prediction.confidence,
      progressPercent,
      progressDelta,
      imageId: imageDoc._id,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to analyze image.',
      details: error.message,
    });
  }
}

async function getHistory(req, res) {
  try {
    const history = await ConstructionImage.find({})
      .sort({ uploadDate: -1 })
      .select('projectName activityType imagePath stage uploadDate progressPercent confidence progressDelta');

    return res.json({
      count: history.length,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch history.',
      details: error.message,
    });
  }
}

module.exports = {
  uploadImage,
  analyzeImage,
  getHistory,
};
