const mongoose = require('mongoose');

const constructionImageSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    activityType: {
      type: String,
      required: true,
      trim: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      default: null,
    },
    confidence: {
      type: Number,
      default: null,
    },
    progressPercent: {
      type: Number,
      default: 0,
    },
    progressDelta: {
      type: Number,
      default: 0,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

constructionImageSchema.index({ projectName: 1, uploadDate: -1 });

module.exports = mongoose.model('ConstructionImage', constructionImageSchema);
