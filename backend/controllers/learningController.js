const LearningPath = require('../models/LearningPath');

// @route   GET /api/learning
// @desc    Get all learning paths for the list page
const getAllPaths = async (req, res, next) => {
  try {
    const paths = await LearningPath.find({}, '-topics').sort({ id: 1 });
    // Returns the success wrapper with 'materials' array as requested previously
    res.json({
      success: true,
      materials: paths
    });
  } catch (err) { 
    res.status(500).json({ success: false, error: err.message });
  }
};

// @route   GET /api/learning/:id
// @desc    Get a single learning path by its numeric ID (Phase 1 logic)
const getPathById = async (req, res, next) => {
  try {
    const topicId = Number(req.params.id); // Convert "1" to number 1
    const material = await LearningPath.findOne({ id: topicId });

    if (!material) {
      return res.status(404).json({ message: "Topic not found in Database" });
    }
    
    // Send the data object directly as requested in Phase 1
    res.json(material); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllPaths, getPathById };
