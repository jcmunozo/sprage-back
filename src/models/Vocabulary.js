const mongoose = require('mongoose');

const VocabularySchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: 'vocabulary',
    },
    language: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    front: {
      type: String,
      required: true,
    },
    back: {
      type: String,
    },
    example: {
      type: String,
    },
    tags: {
      type: [String],
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    id: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vocabulary', VocabularySchema);