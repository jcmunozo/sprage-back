const express = require('express');
const router = express.Router();
const {
  getVocabulary,
  getVocabularyById,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
} = require('../controllers/vocabularyController');

router.route('/').get(getVocabulary).post(createVocabulary);
router
  .route('/:id')
  .get(getVocabularyById)
  .put(updateVocabulary)
  .delete(deleteVocabulary);

module.exports = router;