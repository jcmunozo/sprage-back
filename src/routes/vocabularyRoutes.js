const express = require('express');
const router = express.Router();
const {
  getVocabulary,
  getVocabularyById,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
  importVocabulary,
} = require('../controllers/vocabularyController');

router.route('/').get(getVocabulary).post(createVocabulary);
router.post('/import', importVocabulary);
router
  .route('/:id')
  .get(getVocabularyById)
  .put(updateVocabulary)
  .delete(deleteVocabulary);

module.exports = router;