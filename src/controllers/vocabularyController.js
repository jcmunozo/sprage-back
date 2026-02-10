const Vocabulary = require('../models/Vocabulary');

// @desc    Get all vocabulary cards
// @route   GET /api/vocabulary
// @access  Public
const getVocabulary = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.find({});
    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vocabulary card by ID
// @route   GET /api/vocabulary/:id
// @access  Public
const getVocabularyById = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findOne({ id: req.params.id });
    if (vocabulary) {
      res.json(vocabulary);
    } else {
      res.status(404).json({ message: 'Vocabulary card not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a vocabulary card
// @route   POST /api/vocabulary
// @access  Public
const createVocabulary = async (req, res) => {
  const { type, language, category, front, back, example, tags, difficulty, id } = req.body;

  if (!language || !category || !front || !id) {
    return res.status(400).json({ message: 'Please enter all required fields: language, category, front, id' });
  }

  try {
    const vocabulary = new Vocabulary({
      type,
      language,
      category,
      front,
      back,
      example,
      tags,
      difficulty,
      id,
    });

    const createdVocabulary = await vocabulary.save();
    res.status(201).json(createdVocabulary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a vocabulary card
// @route   PUT /api/vocabulary/:id
// @access  Public
const updateVocabulary = async (req, res) => {
  const { type, language, category, front, back, example, tags, difficulty } = req.body;

  try {
    const vocabulary = await Vocabulary.findOne({ id: req.params.id });

    if (vocabulary) {
      vocabulary.type = type || vocabulary.type;
      vocabulary.language = language || vocabulary.language;
      vocabulary.category = category || vocabulary.category;
      vocabulary.front = front || vocabulary.front;
      vocabulary.back = back || vocabulary.back;
      vocabulary.example = example || vocabulary.example;
      vocabulary.tags = tags || vocabulary.tags;
      vocabulary.difficulty = difficulty || vocabulary.difficulty;

      const updatedVocabulary = await vocabulary.save();
      res.json(updatedVocabulary);
    } else {
      res.status(404).json({ message: 'Vocabulary card not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a vocabulary card
// @route   DELETE /api/vocabulary/:id
// @access  Public
const deleteVocabulary = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findOne({ id: req.params.id });

    if (vocabulary) {
      await Vocabulary.deleteOne({ id: req.params.id });
      res.json({ message: 'Vocabulary card removed' });
    } else {
      res.status(404).json({ message: 'Vocabulary card not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVocabulary,
  getVocabularyById,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
};