const express = require('express');
const nutritionController = require('../controllers/nutrition.controller');

const router = express.Router();

// 营养相关路由
router.post('/record', nutritionController.recordNutrition); // 记录营养摄入
router.get('/analysis/:userName', nutritionController.getNutritionAnalysis); // 获取营养分析
router.get('/records/:userName', nutritionController.getNutritionRecords); // 获取营养记录
router.get('/stats/:userName', nutritionController.getNutritionStats); // 获取营养统计

module.exports = router;
